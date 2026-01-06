const mongoose = require('/root/rank-server/node_modules/mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  // Define the schema
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
  
  const RankData = mongoose.model('TestRankData', rankDataSchema);
  
  // Test creating a record with total date
  console.log('\n=== 测试创建带有 total 日期的记录 ===');
  const testRecord = await RankData.create({
    appid: 'wxf67531bdf3d328af',
    rankid: 'rank_total',
    openid: 'manual_test_' + Date.now(),
    playername: '手动测试',
    score: 999,
    date: 'total'
  });
  
  console.log('创建的记录:', testRecord);
  
  // Test querying all records to see what's in the database
  console.log('\n=== 查询所有记录 ===');
  const allRecords = await RankData.find({}).sort({ created_at: -1 }).limit(5);
  console.log('最近 5 条记录:');
  allRecords.forEach((record, index) => {
    console.log(`\n${index + 1}. ID: ${record._id}`);
    console.log(`   rankid: ${record.rankid}`);
    console.log(`   openid: ${record.openid}`);
    console.log(`   score: ${record.score}`);
    console.log(`   date: ${record.date}`);
    console.log(`   created_at: ${record.created_at}`);
  });
  
  await mongoose.connection.close();
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});