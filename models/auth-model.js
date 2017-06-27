const mongoose = require('../mongodb').mongoose;;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');
const setting = require('../config/setting.js');

autoIncrement.initialize(mongoose.connection);

const authSchema = new mongoose.Schema({
  // 用户名
  username: { type: String, default: '' },
  // 密码
  password: {
    type: String,
    default: crypto.createHash('md5').update(setting.defaultPassword).digest('hex')
  },
  slogan: { type: String, default: '' },
  // 创建时间
  create_time: { type: Date, default: Date.now },
  // 更新时间
  update_time: { type: Date }
});

authSchema.plugin(mongoosePaginate);
authSchema.plugin(autoIncrement.plugin, {
  model: 'Auth',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

authSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_time: Date.now() });
  next();
});

module.exports = mongoose.model('Auth', authSchema);
