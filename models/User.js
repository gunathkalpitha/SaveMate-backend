const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  accountType: { type: String, required: true }, // 'team' or 'personal'
  teamName: String,
  role: { type: String, default: 'user' } // 'user' or 'team'
});

module.exports = mongoose.model('User', userSchema);
