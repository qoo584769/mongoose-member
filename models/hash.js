// node js 內建加密模組
const crypto = require('crypto');

// 密碼加密
function hashPassword(password) {
  let hash = crypto.createHash('sha1');
  hash.update(password);
  const newPassword = hash.digest('hex');
  return newPassword;
}

module.exports = { hashPassword };