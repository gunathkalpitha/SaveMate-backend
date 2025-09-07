const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  member: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: { type: String }
});

module.exports = mongoose.model('Transaction', transactionSchema);
