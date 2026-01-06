const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const result = await mongoose.connection.db.collection('rankdatas').deleteMany({ date: null });
  console.log('Deleted', result.deletedCount, 'records with null date');
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
