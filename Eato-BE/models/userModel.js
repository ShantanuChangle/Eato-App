const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed
  isAdmin: { type: Boolean, default: false }, // Added for Admin Functionality
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);