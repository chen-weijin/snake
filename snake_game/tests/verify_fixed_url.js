const http = require('http');

function getRankData(rankid) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: '43.139.6.101',
      port: 3000,
      path: '/v2/rank/api/rankdata',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const testData = {
      appid: 'wxf67531bdf3d328af',
      rankid: rankid,
      count: 10
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

async function main() {
  console.log('=== 验证上报数据是否出现在排行榜中 ===\n');

  try {
    // 检查总榜
    console.log('检查总榜 (rank_total):');
    const totalRank = await getRankData('rank_total');
    if (totalRank.code === 0 && totalRank.data && totalRank.data.ranklist) {
      console.log('总榜数据:', totalRank.data.ranklist);
      const found = totalRank.data.ranklist.find(r => r.playername === '测试修复后的URL');
      if (found) {
        console.log('✓ 找到测试数据:', found);
      } else {
        console.log('✗ 未找到测试数据');
      }
    } else {
      console.log('✗ 获取总榜失败:', totalRank);
    }

    console.log('\n');

    // 检查日榜
    console.log('检查日榜 (rank_day):');
    const dayRank = await getRankData('rank_day');
    if (dayRank.code === 0 && dayRank.data && dayRank.data.ranklist) {
      console.log('日榜数据:', dayRank.data.ranklist);
      const found = dayRank.data.ranklist.find(r => r.playername === '测试修复后的URL');
      if (found) {
        console.log('✓ 找到测试数据:', found);
      } else {
        console.log('✗ 未找到测试数据');
      }
    } else {
      console.log('✗ 获取日榜失败:', dayRank);
    }

  } catch (error) {
    console.error('验证失败:', error);
  }

  console.log('\n========================================');
}

main();
