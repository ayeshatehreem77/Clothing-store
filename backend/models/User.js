const mongoose = require('mongoose')
const { Schema } = mongoose

const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  // Email verification
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },

    // Password reset
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

});

const users = mongoose.model('user', UserSchema)

users.createIndexes();

module.exports = users