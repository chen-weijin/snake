const mongoose = require('/root/rank-server/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  const rankConfigSchema = new mongoose.Schema({
    appid: String, rankid: String, name: String, order: String, min_score: Number
  }, { collection: 'rankconfigs' });
  const RankConfig = mongoose.model('RankConfig', rankConfigSchema);
  const configs = await RankConfig.find({ appid: 'wxf67531bdf3d328af' }).exec();
  console.log('=== 排行榜配置 ===');
  configs.forEach(c => {
    console.log('rankid:', c.rankid, 'name:', c.name, 'order:', c.order, 'min_score:', c.min_score);
  });
  await mongoose.connection.close();
}).catch(err => console.error('Error:', err));
