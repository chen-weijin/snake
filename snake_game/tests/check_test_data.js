const mongoose = require('./rank-server/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  const rankDataSchema = new mongoose.Schema({
    appid: String, rankid: String, openid: String, playername: String, score: Number, date: String
  }, { collection: 'rankdatas' });
  const RankData = mongoose.model('RankData', rankDataSchema);
  
  const testData = await RankData.find({ playername: '测试修复后的URL' }).exec();
  console.log('=== 查询测试数据 ===');
  console.log('找到', testData.length, '条记录');
  testData.forEach(d => {
    console.log('rankid:', d.rankid, 'openid:', d.openid, 'score:', d.score, 'date:', d.date);
  });
  
  await mongoose.connection.close();
}).catch(err => console.error('Error:', err));
