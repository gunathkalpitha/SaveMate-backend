// backend/models/PersonalTransaction.js
const mongoose = require('mongoose');

const PersonalTransactionSchema = new mongoose.Schema(
  {
    member: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    note: {
      type: String,
      default: '',
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    category: {
      type: String,
      required: true,
      enum: ['Income', 'Food', 'Health', 'Bills', 'Others'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PersonalTransaction', PersonalTransactionSchema);
