const { Schema, model } = require('mongoose');;

const memberSchema = () => {
  return new Schema(
    {
      name: { type: String, required: [true, '會員名稱必填'] },
      email: { type: String, require: [true, '電子信箱必填'] },
      password: { type: String, require: [true, '密碼必填'] },
      createAt: { type: Date, default: Date.now().getTime, select: false },
      updateAt: { type: Date, default: Date.now().getTime, select: false },
    },
    {
      versionKey: false,
    }
  );
};

const memberModel = model('mongoose_member', memberSchema());

module.exports = { memberModel };
