const mongoose = require('/root/rank-server/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  const rankDataSchema = new mongoose.Schema({
    appid: String,
    rankid: String,
    openid: String,
    playername: String,
    score: Number,
    date: String,
    created_at: Date,
    updated_at: Date
  }, { collection: 'rankdatas' });
  
  const RankData = mongoose.model('RankData', rankDataSchema);
  
  console.log('=== 查询最近的测试数据 ===\n');
  
  const recentData = await RankData.find({}).sort({ created_at: -1 }).limit(10).exec();
  console.log('找到', recentData.length, '条最近的记录:');
  
  recentData.forEach((d, index) => {
    console.log(`\n${index + 1}. appid: ${d.appid}`);
    console.log(`   rankid: ${d.rankid}`);
    console.log(`   openid: ${d.openid}`);
    console.log(`   playername: ${d.playername}`);
    console.log(`   score: ${d.score}`);
    console.log(`   date: ${d.date}`);
    console.log(`   created_at: ${d.created_at}`);
  });
  
  console.log('\n=== 查询总榜数据 (date=total) ===');
  const totalData = await RankData.find({ date: 'total' }).sort({ score: -1 }).limit(5).exec();
  console.log('找到', totalData.length, '条总榜记录:');
  totalData.forEach((d, index) => {
    console.log(`${index + 1}. ${d.playername} - ${d.score} - ${d.openid}`);
  });
  
  const today = new Date();
  const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  console.log(`\n=== 查询日榜数据 (date=${todayDate}) ===`);
  const dayData = await RankData.find({ date: todayDate }).sort({ score: -1 }).limit(5).exec();
  console.log('找到', dayData.length, '条日榜记录:');
  dayData.forEach((d, index) => {
    console.log(`${index + 1}. ${d.playername} - ${d.score} - ${d.openid}`);
  });
  
  await mongoose.connection.close();
}).catch(err => console.error('Error:', err));