const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const nullDateRecords = await collection.find({ date: null }).toArray();
  console.log('找到', nullDateRecords.length, '条date为null的记录');
  
  if (nullDateRecords.length > 0) {
    console.log('这些记录的详细信息:');
    nullDateRecords.forEach((record, index) => {
      console.log(`${index + 1}. _id: ${record._id}, appid: ${record.appid}, rankid: ${record.rankid}, openid: ${record.openid}, score: ${record.score}`);
    });
    
    const deleteResult = await collection.deleteMany({ date: null });
    console.log('删除结果:', deleteResult);
  } else {
    console.log('没有找到date为null的记录');
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});