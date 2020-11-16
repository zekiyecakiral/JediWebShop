const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const crystalSchema = new Schema({
  color: { type: String, required: true },
  name: { type: String, required: true },
  planet: { type: String, required: true },
  forcePercentage: { type: Number, require: true },
  harvestedAmount: { type: Number, require: true },
});

module.exports = mongoose.model('Crystal', crystalSchema);
