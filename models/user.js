const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String, required: true, unique: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    fullName: { type: String },
    batch: { type: String },
    department: { type: String },
    address: { type: String },
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

module.exports = User;
