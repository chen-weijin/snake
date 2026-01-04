const mongoose = require('mongoose');

const rankConfigSchema = new mongoose.Schema({
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
  name: {
    type: String,
    required: true
  },
  order: {
    type: String,
    required: true,
    enum: ['asc', 'desc']
  },
  min_score: {
    type: Number,
    default: 0
  },
  max_count: {
    type: Number,
    default: 100
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

// 添加复合索引，确保每个appid下的rankid唯一
rankConfigSchema.index({ appid: 1, rankid: 1 }, { unique: true });

const RankConfig = mongoose.model('RankConfig', rankConfigSchema);

module.exports = RankConfig;