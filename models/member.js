const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'user', 'member'], default: 'member' },
  fullName: String,
  batch: String,
  department: String,
  address: String,
  password: { type: String, required: true }, // Add password field
});

const Member = mongoose.model('Member', memberSchema);

module.exports = Member;
