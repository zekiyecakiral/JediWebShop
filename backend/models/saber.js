const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const saberSchema = new Schema({
  saberId: { type: String, required: true },
  name: { type: String, required: true },
  available:{type:Number,required:true},
  image: { type: String, required: false },
  crystal: { type: mongoose.Types.ObjectId, required: true, ref: 'Crystal' },
});

saberSchema.index({ saberId: 1}, { unique: true });


module.exports = mongoose.model('Saber', saberSchema);

