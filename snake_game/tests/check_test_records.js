const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const testRecords = await collection.find({
    openid: { $regex: 'test_game_client' }
  }).toArray();
  
  console.log('找到', testRecords.length, '条test_game_client相关的记录:');
  testRecords.forEach((record, index) => {
    console.log(`${index + 1}. _id: ${record._id}, appid: ${record.appid}, rankid: ${record.rankid}, openid: ${record.openid}, score: ${record.score}, date: ${record.date}`);
  });
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});