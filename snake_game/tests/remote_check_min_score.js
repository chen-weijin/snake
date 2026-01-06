const mongoose = require('/root/rank-server/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  const rankConfigSchema = new mongoose.Schema({
    appid: String,
    rankid: String,
    rankname: String,
    min_score: Number,
    max_score: Number,
    ranktype: String,
    created_at: Date,
    updated_at: Date
  }, { collection: 'rankconfigs' });
  
  const RankConfig = mongoose.model('RankConfig', rankConfigSchema);
  
  console.log('=== 检查排行榜配置 ===\n');
  
  const configs = await RankConfig.find({}).exec();
  console.log('找到', configs.length, '个排行榜配置:');
  
  configs.forEach(config => {
    console.log('\nRankID:', config.rankid);
    console.log('  RankName:', config.rankname);
    console.log('  MinScore:', config.min_score);
    console.log('  MaxScore:', config.max_score);
    console.log('  RankType:', config.ranktype);
    
    if (config.min_score !== 0) {
      console.log('  ⚠️  警告: min_score 不是 0, 可能导致分数上报失败!');
    } else {
      console.log('  ✓ min_score 正确设置为 0');
    }
  });
  
  await mongoose.connection.close();
}).catch(err => console.error('Error:', err));