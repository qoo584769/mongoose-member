const HttpMethod = require('../HttpFun');
const { memberModel } = require('../models/mongooseMemberModel');

const {
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require('../repository/mongooseDB');
const { verifyToken, checkEmail } = require('../models/verification');
const { hashPassword } = require('../models/hash');
// jwt token產生
const jwt = require('jsonwebtoken');

const mongooseUserLogin = async (req, res) => {
  try {
    const memberData = {
      email: req.body.email,
      password: hashPassword(req.body.password),
    };

    const result = await getUser(memberData, memberModel);
    // 登入成功給token
    if (result.status === 200) {
      const token = jwt.sign(
        {
          // 加密方式
          algorithm: 'HS256',
          // 多久之後到期 60一分鐘到期 60*60一小時 也可以不用exp直接在secret後面加上{ expiresIn: '1h' }
          exp: Math.floor(Date.now() / 1000) + 60 * 60,
          // data的內容可以在登入解密出來
          data: result.id,
        },
        // 給jwt一個字串當作加密編碼參考 需要隱藏起來 否則會有被反推的機會
        // 驗證的時候要用一樣的字串去解 不然會算不出原本的資料
        'secret'
      );
      res.setHeader('token', token);

      return HttpMethod(
        res,
        result.status,
        result.status,
        result,
        result.message
      );
    } else if (result.status === 404) {
      return HttpMethod(
        res,
        result.status,
        result.status,
        result.result,
        result.message
      );
    }
  } catch (error) {
    console.log(error);
    return HttpMethod(
      res,
      error.status,
      error.status,
      error.result,
      error.message
    );
  }
};

const mongooseUserCreate = async (req, res) => {
  if (checkEmail(req.body.email)) {
    const memberData = {
      name: req.body.name,
      email: req.body.email,
      password: hashPassword(req.body.password),
    };

    const newUser = new memberModel(memberData);

    try {
      const result = await createUser(newUser, memberModel);
      return HttpMethod(
        res,
        result.status,
        result.status,
        result.result,
        result.message
      );
    } catch (error) {
      console.log('會員註冊 ' + error);
      HttpMethod(res, 404, 'false', error, '註冊失敗');
      return error;
    }
  } else {
    const result = {
      status: 404,
      result: req.body.email,
      message: '電子信箱格式錯誤',
    };
    return HttpMethod(
      res,
      result.status,
      result.status,
      result.result,
      result.message
    );
  }
};

const mongooseUserEdit = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.token;

  //   如果沒token直接跳去下面catch
  try {
    const verify = await verifyToken(token);
    // 驗證有無 token 與要修改的帳號是不是登入的帳號
    if (verify && verify === id) {
      // 測試資料全部都寫  實際上如果沒填就用前端取得的舊會員資料
      const memberData = {
        id: verify,
        name: req.body.name,
        email: req.body.email,
        password: hashPassword(req.body.password),
      };

      try {
        const result = await updateUser(memberData, memberModel);
        return HttpMethod(
          res,
          result.status,
          result.status,
          result.result,
          result.message
        );
      } catch (updateError) {
        console.log(updateError);
        return HttpMethod(
          res,
          updateError.status,
          updateError.status,
          updateError.result,
          updateError.message
        );
      }
    }
    //   ID不是同一個帳號
    else {
      return HttpMethod(res, 404, 404, '驗證失敗', '會員 ID 或 token 錯誤');
    }
  } catch (error) {
    return HttpMethod(res, 404, 'token驗證失敗', {}, '請重新登入');
  }
};

const mongooseUserDelete = async (req, res) => {
  const id = req.params.id;
  const token = req.headers.token;
  try {
    const verify = await verifyToken(token);
    if (verify && verify === id) {
      const result = await deleteUser(id, memberModel);
      return HttpMethod(
        res,
        result.status,
        result.status,
        result.result,
        result.message
      );
    } else {
      return HttpMethod(res, 404, 'token驗證失敗或ID錯誤', {}, '請重新登入');
    }
  } catch (error) {
    console.log(error);
    return HttpMethod(res, 404, error, {}, '請重新登入');
  }
};

const mongooseUserLogout = async (req, res) => {
  try {
    req.session.destroy((err) => {
    });
    res.removeHeader('token');

    return HttpMethod(res, 200, '登出成功', {}, '請重新登入');
  } catch (error) {
    console.log(error);
    return HttpMethod(res, 200, '登出成功', {}, '請重新登入');
  }
};

module.exports = {
  mongooseUserLogin,
  mongooseUserCreate,
  mongooseUserEdit,
  mongooseUserDelete,
  mongooseUserLogout,
};
