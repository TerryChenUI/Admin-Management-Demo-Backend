const mongoose = require('../mongodb').mongoose;;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

const tagSchema = new mongoose.Schema({
  // 标签名称
  name: { type: String, required: true, validate: /\S+/ },
  // 别名
  slug: { type: String, required: true, validate: /\S+/ },
  // 标签描述
  description: String,
  // 排序
  displayOrder: { type: Number, required: true, default: 1 },
  // 可见
  visible: { type: Boolean, required: true, default: false },
  // 发布时间
  create_time: { type: Date, default: Date.now },
  // 更新时间
  update_time: { type: Date }
});

tagSchema.plugin(mongoosePaginate);
tagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

tagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_time: Date.now() });
  next();
});

module.exports = mongoose.model('Tag', tagSchema);
