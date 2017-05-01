const mongoose = require('../mongodb').mongoose;
const autoIncrement = require('mongoose-auto-increment');
const mongoosePaginate = require('mongoose-paginate');

autoIncrement.initialize(mongoose.connection);

const tagSchema = new mongoose.Schema({
  name: { type: String, required: true, validate: /\S+/ },
  slug: { type: String, required: true, validate: /\S+/ },
  description: String,
  displayOrder: { type: Number, default: 1 },
  enabled: { type: Boolean, default: false },
  create: { type: Date, default: Date.now },
  update: { type: Date }
});

tagSchema.plugin(mongoosePaginate)
tagSchema.plugin(autoIncrement.plugin, {
  model: 'Tag',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});

tagSchema.pre('findOneAndUpdate', function (next) {
  this.findOneAndUpdate({}, { update: Date.now() });
  next();
});

module.exports = mongoose.model('Tag', tagSchema);
