const mongoose = require('/root/rank-server/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  const rankDataSchema = new mongoose.Schema({
    appid: String, rankid: String, openid: String, playername: String, score: Number, date: String
  }, { collection: 'rankdatas' });
  const RankData = mongoose.model('RankData', rankDataSchema);
  
  console.log('=== 清理旧测试数据 ===');
  const result = await RankData.deleteMany({ openid: /test_fixed_url/ });
  console.log('删除了', result.deletedCount, '条记录');
  
  await mongoose.connection.close();
}).catch(err => console.error('Error:', err));
