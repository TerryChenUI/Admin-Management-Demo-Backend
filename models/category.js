const mongoose = require('../mongodb').mongoose;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },
  slug: { type: String, required: true, validate: /\S+/ },
  description: String,
  pid: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', default: null },
  displayOrder: { type: Number, required: true },
  enabled: { type: Boolean, required: true },
  create: { type: Date, default: Date.now },
  update: { type: Date }
});

categorySchema.set('toObject', { getters: true });

categorySchema.plugin(mongoosePaginate);
categorySchema.plugin(autoIncrement.plugin, {
  model: 'Category',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

categorySchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update: Date.now() });
  next();
});

module.exports = mongoose.model('Category', categorySchema);
