const mongoose = require('./rank-server/node_modules/mongoose');
const RankConfig = require('./rank-server/src/models/RankConfig');
const config = require('./rank-server/config');

async function initConfig() {
  try {
    // 连接数据库
    await mongoose.connect(config.database.uri, config.database.options);
    console.log('Connected to MongoDB');

    const appid = 'wxf67531bdf3d328af';
    
    // 检查是否已经存在配置
    const existing = await RankConfig.findOne({ appid });
    if (existing) {
      console.log('Config already exists');
      return;
    }

    // 创建总榜配置
    await RankConfig.create({
      appid: appid,
      rankid: 'rank_total',
      name: '总排行榜',
      order: 'desc',
      min_score: 0,
      max_count: 100
    });

    // 创建日榜配置
    await RankConfig.create({
      appid: appid,
      rankid: 'rank_day',
      name: '日排行榜',
      order: 'desc',
      min_score: 0,
      max_count: 100
    });

    console.log('Default config created successfully');
    
  } catch (error) {
    console.error('Error initializing config:', error);
  } finally {
    // 关闭数据库连接
    await mongoose.disconnect();
  }
}

initConfig();
