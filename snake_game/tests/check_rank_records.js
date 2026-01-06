const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const totalRecords = await collection.find({ rankid: 'rank_total' }).toArray();
  console.log('找到', totalRecords.length, '条总榜记录');
  
  if (totalRecords.length > 0) {
    console.log('总榜记录的详细信息:');
    totalRecords.forEach(record => {
      console.log(`  _id: ${record._id}, appid: ${record.appid}, rankid: ${record.rankid}, openid: ${record.openid}, score: ${record.score}, date: ${record.date}`);
    });
  } else {
    console.log('没有总榜记录');
  }
  
  const dailyRecords = await collection.find({ rankid: 'rank_day' }).toArray();
  console.log('\n找到', dailyRecords.length, '条日榜记录');
  
  if (dailyRecords.length > 0) {
    console.log('日榜记录的date字段值:');
    const dateValues = [...new Set(dailyRecords.map(r => r.date))];
    console.log('  不同的date值:', dateValues);
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
