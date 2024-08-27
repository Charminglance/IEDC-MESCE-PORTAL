const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  phoneNumber: { type: String, required: true, unique: true },
  role: { type: String, enum: ['admin', 'registration', 'member'], default: 'registration' },
  fullName: String,
  batch: String,
  department: String,
  address: String, // You can use this for generating credentials
});

const User = mongoose.model('User', userSchema);

module.exports = User;
