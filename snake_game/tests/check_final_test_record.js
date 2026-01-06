const mongoose = require('./rank-server/node_modules/mongoose');

mongoose.connect('mongodb://43.139.6.101:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  // Define the schema
  const rankDataSchema = new mongoose.Schema({
    appid: String,
    rankid: String,
    openid: String,
    playername: String,
    score: Number,
    date: String,
    created_at: Date
  }, { collection: 'rankdatas' });
  
  const RankData = mongoose.model('TestRankData', rankDataSchema);
  
  // Check all records created in the last 5 minutes
  const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
  console.log('\n=== 查询最近5分钟创建的所有记录 ===');
  const recentRecords = await RankData.find({
    created_at: { $gte: fiveMinutesAgo }
  }).sort({ created_at: -1 });
  
  console.log(`找到 ${recentRecords.length} 条最近记录:`);
  recentRecords.forEach((record, index) => {
    console.log(`\n${index + 1}.`);
    console.log(`   appid: ${record.appid}`);
    console.log(`   rankid: ${record.rankid}`);
    console.log(`   openid: ${record.openid}`);
    console.log(`   playername: ${record.playername}`);
    console.log(`   score: ${record.score}`);
    console.log(`   date: ${record.date}`);
    console.log(`   created_at: ${record.created_at}`);
  });
  
  // Check if any records have date: undefined
  console.log('\n=== 查询所有 date 为 undefined 的记录 ===');
  const undefinedDateRecords = await RankData.find({ date: undefined }).limit(5);
  console.log(`找到 ${undefinedDateRecords.length} 条 date 为 undefined 的记录:`);
  undefinedDateRecords.forEach((record, index) => {
    console.log(`\n${index + 1}.`);
    console.log(`   rankid: ${record.rankid}`);
    console.log(`   openid: ${record.openid}`);
    console.log(`   score: ${record.score}`);
    console.log(`   date: ${record.date}`);
  });
  
  // Check if any records have date: 'total'
  console.log('\n=== 查询所有 date 为 total 的记录 ===');
  const totalDateRecords = await RankData.find({ date: 'total' });
  console.log(`找到 ${totalDateRecords.length} 条 date 为 total 的记录:`);
  totalDateRecords.forEach((record, index) => {
    console.log(`\n${index + 1}.`);
    console.log(`   rankid: ${record.rankid}`);
    console.log(`   openid: ${record.openid}`);
    console.log(`   score: ${record.score}`);
    console.log(`   date: ${record.date}`);
  });
  
  await mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});