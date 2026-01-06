const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const record = await collection.findOne({ _id: new mongoose.Types.ObjectId('695a498b2b53e8ebb8af8914') });
  console.log('查找记录 695a498b2b53e8ebb8af8914:', record);
  
  const allRecords = await collection.find({ appid: 'wxf67531bdf3d328af', rankid: 'rank_day', date: '2026-01-04' }).toArray();
  console.log('\n所有符合条件的记录:');
  allRecords.forEach((item, index) => {
    console.log(`${index + 1}. ${item.openid} - ${item.score}分 (ID: ${item._id})`);
  });
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
