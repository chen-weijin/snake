const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const nullDateRecords = await collection.find({ date: null }).toArray();
  console.log('Found', nullDateRecords.length, 'records with null date:');
  nullDateRecords.forEach(record => {
    console.log('  -', record._id, 'openid:', record.openid, 'rankid:', record.rankid);
  });
  
  const result = await collection.deleteMany({ date: null });
  console.log('Deleted', result.deletedCount, 'records with null date');
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
