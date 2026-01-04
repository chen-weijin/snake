const cron = require('node-cron');
const RankData = require('../models/RankData');

function resetDailyRank() {
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  
  console.log(`[${new Date().toISOString()}] 开始重置日榜数据，删除日期: ${yesterdayDate}`);
  
  RankData.deleteMany({ rankid: 'rank_day', date: yesterdayDate })
    .then(result => {
      console.log(`[${new Date().toISOString()}] 日榜重置完成，删除了 ${result.deletedCount} 条记录`);
    })
    .catch(error => {
      console.error(`[${new Date().toISOString()}] 日榜重置失败:`, error);
    });
}

function startDailyRankResetJob() {
  cron.schedule('0 0 * * *', () => {
    console.log('执行日榜重置任务...');
    resetDailyRank();
  });
  
  console.log('日榜自动重置任务已启动，每天凌晨00:00执行');
}

module.exports = {
  resetDailyRank,
  startDailyRankResetJob
};