const mongoose = require('../mongodb').mongoose;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true, validate: /\S+/ },
  keywords: [{ type: String }],
  description: String,
  content: { type: String, required: true, validate: /\S+/ },
  thumb: String,
  // 文章发布状态 => -1回收站，0草稿，1已发布
  state: { type: Number, default: 1 },
  create: { type: Date, default: Date.now },
  update: { type: Date, default: Date.now },
  meta: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    comments: { type: Number, default: 0 }
  },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true }]
});

articleSchema.set('toObject', { getters: true });

articleSchema.plugin(mongoosePaginate)
articleSchema.plugin(autoIncrement.plugin, {
  model: 'Article',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

articleSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update: Date.now() });
  next();
});

articleSchema.virtual('t_content').get(function () {
  const content = this.content;
  return !!content ? content.substring(0, 130) : content;
});

module.exports = mongoose.model('Article', articleSchema);;
