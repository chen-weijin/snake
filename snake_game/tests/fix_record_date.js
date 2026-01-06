const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/rank-server').then(async () => {
  console.log('Connected to MongoDB');
  
  const collection = mongoose.connection.db.collection('rankdatas');
  
  const now = new Date();
  const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  
  console.log('当前日期:', todayDate);
  
  const record = await collection.findOne({ _id: new mongoose.Types.ObjectId('695a498b2b53e8ebb8af8914') });
  console.log('修复前的记录:', record);
  
  if (record) {
    const result = await collection.updateOne(
      { _id: new mongoose.Types.ObjectId('695a498b2b53e8ebb8af8914') },
      { $set: { date: todayDate } }
    );
    console.log('更新结果:', result);
    
    const updatedRecord = await collection.findOne({ _id: new mongoose.Types.ObjectId('695a498b2b53e8ebb8af8914') });
    console.log('修复后的记录:', updatedRecord);
  } else {
    console.log('记录不存在');
  }
  
  mongoose.connection.close();
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
