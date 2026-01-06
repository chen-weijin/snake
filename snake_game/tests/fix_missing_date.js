const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  console.log('当前日期:', todayDate);
  
  const recordsWithoutDate = await collection.find({ date: { $exists: false } }).toArray();
  console.log('找到', recordsWithoutDate.length, '条没有date字段的记录');
  
  if (recordsWithoutDate.length > 0) {
    for (const record of recordsWithoutDate) {
      const newDate = record.rankid === 'rank_day' ? todayDate : 'total';
      console.log(`修复记录: ${record._id}, rankid: ${record.rankid}, date: ${newDate}`);
      
      await collection.updateOne(
        { _id: record._id },
        { $set: { date: newDate } }
      );
    }
    console.log('修复完成');
  } else {
    console.log('没有需要修复的记录');
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});