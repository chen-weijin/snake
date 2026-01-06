const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const totalRecords = await collection.find({ rankid: 'rank_total' }).toArray();
  console.log('找到', totalRecords.length, '条总榜记录');
  
  let updatedCount = 0;
  
  for (const record of totalRecords) {
    if (record.date === undefined || record.date === null) {
      console.log(`更新记录: _id=${record._id}, openid=${record.openid}, score=${record.score}, date=${record.date}`);
      
      await collection.updateOne(
        { _id: record._id },
        { $set: { date: 'total' } }
      );
      
      updatedCount++;
    }
  }
  
  console.log('\n更新了', updatedCount, '条总榜记录');
  
  const dailyRecords = await collection.find({ rankid: 'rank_day', date: undefined }).toArray();
  console.log('\n找到', dailyRecords.length, '条date为undefined的日榜记录');
  
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  console.log('今天日期:', todayDate);
  
  let dailyUpdatedCount = 0;
  
  for (const record of dailyRecords) {
    console.log(`更新日榜记录: _id=${record._id}, openid=${record.openid}, score=${record.score}`);
    
    await collection.updateOne(
      { _id: record._id },
      { $set: { date: todayDate } }
    );
    
    dailyUpdatedCount++;
  }
  
  console.log('\n更新了', dailyUpdatedCount, '条日榜记录');
  
  console.log('\n=== 验证更新结果 ===');
  
  const totalAfter = await collection.find({ rankid: 'rank_total' }).toArray();
  console.log('总榜记录数:', totalAfter.length);
  console.log('总榜date值:', [...new Set(totalAfter.map(r => r.date))]);
  
  const dailyAfter = await collection.find({ rankid: 'rank_day' }).toArray();
  console.log('日榜记录数:', dailyAfter.length);
  console.log('日榜date值:', [...new Set(dailyAfter.map(r => r.date))]);
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});