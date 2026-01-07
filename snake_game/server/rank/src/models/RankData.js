const mongoose = require('mongoose');

const rankDataSchema = new mongoose.Schema({
  appid: {
    type: String,
    required: true,
    index: true
  },
  rankid: {
    type: String,
    required: true,
    index: true
  },
  openid: {
    type: String,
    required: true,
    index: true
  },
  playername: {
    type: String,
    required: true
  },
  portrait: {
    type: String,
    default: ''
  },
  score: {
    type: Number,
    required: true,
    index: true
  },
  ext: {
    type: String,
    default: '{}'
  },
  date: {
    type: String,
    required: true,
    index: true,
    default: () => {
      const now = new Date();
      return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    }
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

rankDataSchema.index({ appid: 1, rankid: 1, score: -1 });
rankDataSchema.index({ appid: 1, rankid: 1, openid: 1, date: 1 }, { unique: true });
rankDataSchema.index({ appid: 1, rankid: 1, date: 1 });

const RankData = mongoose.model('RankData', rankDataSchema);

module.exports = RankData;