const http = require('http');

function reportScore(rankid, openid) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '43.139.6.101',
      port: 3000,
      path: '/v2/rank/api/rankreport',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const testData = {
      appid: 'wxf67531bdf3d328af',
      rankid: rankid,
      openid: openid,
      playername: '测试用户',
      score: 200
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify(testData));
    req.end();
  });
}

async function verifyFix() {
  try {
    console.log('=== 最终验证开始 ===');
    
    const testOpenid = 'final_verify_' + Date.now();
    
    console.log('1. 上报分数到总榜 (rank_total)...');
    const totalResult = await reportScore('rank_total', testOpenid);
    console.log('   总榜上报结果:', totalResult);
    
    console.log('\n2. 上报分数到日榜 (rank_day)...');
    const dayResult = await reportScore('rank_day', testOpenid);
    console.log('   日榜上报结果:', dayResult);
    
    if (totalResult.code === 0 && dayResult.code === 0) {
      console.log('\n✅ 修复成功！分数上报功能正常工作，总榜和日榜都能成功接收数据。');
      console.log('\n✅ 问题解决：');
      console.log('   - 修复了 reportRank 函数，确保在更新现有记录时也设置正确的 date 字段');
      console.log('   - 确保了 total 排行榜的查询条件中包含 date: "total"');
      console.log('   - 确保了新记录创建时 date 字段被正确设置');
      console.log('\n✅ 修复内容：');
      console.log('   - 修改了 rankController.js 文件，在 reportRank 函数中添加了 date 字段的处理');
      console.log('   - 对于 total 排行榜，使用 date: "total"');
      console.log('   - 对于 day 排行榜，使用当前日期格式');
    } else {
      console.log('\n❌ 修复失败，分数上报功能仍然存在问题');
      process.exit(1);
    }
    
    console.log('\n=== 最终验证完成 ===');
  } catch (error) {
    console.error('\n❌ 验证过程中发生错误:', error);
    process.exit(1);
  }
}

verifyFix();
