const mongoose = require('../mongodb').mongoose;;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

const articleSchema = new mongoose.Schema({
  // 文章标题
  title: { type: String, required: true, validate: /\S+/ },
  // 文章关键字（SEO）
  keywords: [{ type: String }],
  // 文章作者
  author: String,
  // 文章来源
  source: String,
  // 简短描述
  description: String,
  // 缩略图
  thumb: String,
  // 文章内容
  content: { type: String, required: true, validate: /\S+/ },
  // 文章发布状态 => 0草稿，1已发布，2回收站
  state: { type: Number, default: 1 },
  // 发布时间
  create_time: { type: Date, default: Date.now },
  // 创建时间
  update_time: { type: Date, default: Date.now },
  // 其他元信息
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }]
});

articleSchema.set('toObject', { getters: true });

articleSchema.plugin(mongoosePaginate);
articleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

articleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update_time: Date.now() });
  next();
});

module.exports = mongoose.model('Article', articleSchema);
