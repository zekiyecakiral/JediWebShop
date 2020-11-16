const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  saberId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: 'Saber',
  },
  price: { type: Number, required: true },
  createdAt:{ type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
