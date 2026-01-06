const mongoose = require('./rank-server/node_modules/mongoose');

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

async function checkConfig() {
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
    
    console.log('\n配置检查完成！');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

checkConfig().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});