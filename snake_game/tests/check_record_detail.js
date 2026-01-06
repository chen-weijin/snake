const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const testRecord = await collection.findOne({
    openid: 'test_game_client_1767525470154'
  });
  
  console.log('找到记录:');
  console.log('完整记录:', JSON.stringify(testRecord, null, 2));
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});