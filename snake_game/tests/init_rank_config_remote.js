const mongoose = require('./node_modules/mongoose');

const uri = 'mongodb://localhost:27017/rank-server';

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
}, { collection: 'rankconfigs' });

rankConfigSchema.index({ appid: 1, rankid: 1 }, { unique: true });

const RankConfig = mongoose.model('RankConfig', rankConfigSchema);

async function checkAndInitConfig() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const appid = 'wxf67531bdf3d328af';
    
    console.log('\n=== 检查现有配置 ===');
    const existingConfigs = await RankConfig.find({ appid }).exec();
    console.log('找到', existingConfigs.length, '条配置记录');
    
    if (existingConfigs.length > 0) {
      console.log('\n现有配置:');
      existingConfigs.forEach(config => {
        console.log(`  rankid: ${config.rankid}, name: ${config.name}, order: ${config.order}, min_score: ${config.min_score}`);
      });
    }
    
    console.log('\n=== 初始化配置 ===');
    
    const totalConfig = await RankConfig.findOneAndUpdate(
      { appid, rankid: 'rank_total' },
      {
        appid,
        rankid: 'rank_total',
        name: '总排行榜',
        order: 'desc',
        min_score: 0,
        max_count: 100,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('总榜配置:', totalConfig);
    
    const dayConfig = await RankConfig.findOneAndUpdate(
      { appid, rankid: 'rank_day' },
      {
        appid,
        rankid: 'rank_day',
        name: '日排行榜',
        order: 'desc',
        min_score: 0,
        max_count: 100,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('日榜配置:', dayConfig);
    
    console.log('\n=== 验证配置 ===');
    const allConfigs = await RankConfig.find({ appid }).exec();
    console.log('所有配置:');
    allConfigs.forEach(config => {
      console.log(`  rankid: ${config.rankid}, name: ${config.name}, order: ${config.order}, min_score: ${config.min_score}`);
    });
    
    console.log('\n配置初始化完成！');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkAndInitConfig().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
