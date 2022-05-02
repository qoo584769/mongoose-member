require('../connections/mongooseConnection');

const getUser = async (modelData, collection_name) => {
  return new Promise((resolve, reject) => {
    let result = {};
    // findOne方法回傳的值 沒符合條件的res跟err都會是null 用err判斷會出問題
    collection_name
      .findOne({ email: modelData.email, password: modelData.password })
      .exec((err, res) => {
        if (res === null) {
          result.status = 404;
          result.result = '會員登入出現錯誤';
          result.message = 'mongoose 信箱或密碼錯誤';
          console.log('會員登入失敗');
          reject(result);
          return;
        }
        result.status = 200;
        result.result = '登入成功';
        result.message = '會員登入成功';
        result.id = res._id;
        result.name = res.name;
        console.log('會員登入成功');
        resolve(result);
      });
  });
};

const createUser = async (memberData, collection_name) => {
  return new Promise((resolve, reject) => {
    let result = {};
    collection_name.findOne({ email: memberData.email }).exec((err, res) => {
      if (err) {
        result.status = 404;
        result.result = '驗證信箱重複出現未知錯誤';
        result.message = 'mongoose 資料庫出現錯誤';
        console.log('會員註冊失敗');
        reject(result);
        return;
      }
      if (res === null) {
        // 直接save也會直接新增
        memberData
          .save()
          .then((res) => {
            result.status = 200;
            result.result = res;
            result.message = 'mongoose 會員註冊成功';
            console.log('mongoose 會員註冊成功');
            resolve(result);
          })
          .catch((err) => {
            result.status = 404;
            result.result = err;
            result.message = 'mongoose 會員註冊失敗';
            console.log('mongoose 會員註冊失敗');
            reject(result);
          });
        return;
      }

      result.status = 404;
      result.result = memberData.email;
      result.message = 'mongoose 會員信箱重複';
      console.log('mongoose 信箱存在');
      console.log('mongoose 會員註冊失敗');
      reject(result);
    });
  });
};

const updateUser = async (userData, collection_name) => {
  return new Promise((resolve, reject) => {
    let result = {};

    // exec類似then
    // 如果sort limit這種額外條件
    // 直接用點的加在查詢語法後面要用exec
    // 加在搜尋語法的第二個option位置後面用哪種都可以
    collection_name
      .findOne({ email: userData.email })
      .exec((findErr, findRes) => {
        if (findErr) {
          result.status = 404;
          result.result = '驗證信箱重複出現未知錯誤';
          result.message = 'mongoose 資料庫出現錯誤';
          console.log('會員註冊失敗');
          reject(result);
          return;
        }
        if (findRes === null) {
          collection_name
            .updateOne({ _id: userData.id }, userData)
            .exec((err, res) => {
              if (err) {
                result.status = 404;
                result.result = '會員資料更新失敗';
                result.message = 'mongoose 查無此筆資料';
                console.log('會員更新失敗');
                reject(result);
                return;
              }
              result.status = 200;
              result.result = res;
              result.message = 'mongoose 會員更新成功';
              console.log('mongoose 會員更新成功');
              resolve(result);
            });
          return;
        }

        result.status = 404;
        result.result = userData.email;
        result.message = 'mongoose 會員信箱重複';
        console.log('mongoose 信箱存在');
        console.log('mongoose 會員更新失敗');
        reject(result);
      });
  });
};

const deleteUser = async (userData, collection_name) => {
  return new Promise((resolve, reject) => {
    let result = {};
    collection_name.deleteOne({ _id: userData }).exec((err, res) => {
      if (err) {
        result.status = 404;
        result.result = '會員資料刪除失敗';
        result.message = 'mongoose 查無此筆資料';
        console.log('會員刪除失敗');
        reject(result);
        return;
      }
      result.status = 200;
      result.result = res;
      result.message = 'mongoose 會員刪除成功';
      console.log('mongoose 會員刪除成功');
      resolve(result);
    });
  });
};

module.exports = { getUser, createUser, updateUser, deleteUser };
