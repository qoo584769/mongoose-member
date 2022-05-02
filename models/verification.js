const jwt = require('jsonwebtoken');

// 驗證token是否到期
function verifyToken(token) {
  let result = '';

  //   取得現在時間 單位為秒
  const time = Math.floor(Date.now() / 1000);

  return new Promise((resolve, reject) => {
    //   使用jwt函式判斷token是否過期
    if (token) {
      // secret字串要跟token加密的字串一樣 最好是寫在 env 檔裡面
      jwt.verify(token, 'secret', (error, decoded) => {
        //   console.log(decoded);
        if (error) {
          result = false;
          resolve(result);
        } else if (decoded.exp <= time) {
          result = false;
          resolve(result);
        } else {
          result = decoded.data;
          resolve(result);
        }
      });
    }else{
      result = '找不到token'
      reject(result);
    }
  });
}

// 驗證信箱格式
function checkEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const result = re.test(email);

  return result;
}

module.exports = { verifyToken, checkEmail };
