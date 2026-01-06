const mongoose = require('mongoose');

const uri = 'mongodb://localhost:27017/rank-server';

const rankDataSchema = new mongoose.Schema({
  appid: String,
  rankid: String,
  openid: String,
  nickname: String,
  score: Number,
  date: String,
  timestamp: { type: Date, default: Date.now }
}, { collection: 'rankdatas' });

const RankData = mongoose.model('RankData', rankDataSchema);

async function cleanupNullDateRecords() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');
    
    const nullDateRecords = await RankData.find({ date: null }).exec();
    console.log('找到', nullDateRecords.length, '条date为null的记录');
    
    if (nullDateRecords.length > 0) {
      console.log('这些记录的详细信息:');
      nullDateRecords.forEach(record => {
        console.log(`  _id: ${record._id}, appid: ${record.appid}, rankid: ${record.rankid}, openid: ${record.openid}, score: ${record.score}`);
      });
      
      const result = await RankData.deleteMany({ date: null }).exec();
      console.log('\n删除了', result.deletedCount, '条记录');
    } else {
      console.log('没有date为null的记录');
    }
    
    console.log('\n=== 验证删除结果 ===');
    
    const totalRecords = await RankData.find({ rankid: 'rank_total' }).exec();
    console.log('总榜记录数:', totalRecords.length);
    console.log('总榜date值:', [...new Set(totalRecords.map(r => r.date))]);
    
    const dailyRecords = await RankData.find({ rankid: 'rank_day' }).exec();
    console.log('日榜记录数:', dailyRecords.length);
    console.log('日榜date值:', [...new Set(dailyRecords.map(r => r.date))]);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.connection.close();
  }
}

cleanupNullDateRecords().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
