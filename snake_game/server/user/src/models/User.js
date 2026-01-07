const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  openid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  code: {
    type: String,
    required: true
  },
  appid: {
    type: String,
    required: true,
    index: true
  },
  user_data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
    type: Date,
    default: Date.now
  }
});

// Add compound index for appid and openid
userSchema.index({ appid: 1, openid: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

module.exports = User;