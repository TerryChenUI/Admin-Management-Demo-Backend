const mongoose = require('../mongodb').mongoose;;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

const categorySchema = new mongoose.Schema({
  // 分类名称
  name: { type: String, required: true, validate: /\S+/ },
  // 别名
  slug: { type: String, required: true, validate: /\S+/ },
  // 分类描述
  description: String,
  // 排序
  displayOrder: { type: Number, required: true, default: 1 },
  // 可见
  visible: { type: Boolean, required: true, default: false },
  // 创建时间
  create_time: { type: Date, default: Date.now },
  // 更新时间
  update_time: { type: Date },
  // 父分类ID
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
});

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

categorySchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_time: Date.now() });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
