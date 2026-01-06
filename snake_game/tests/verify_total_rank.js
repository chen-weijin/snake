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
      count: 20
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
  console.log('=== 验证总榜数据 ===\n');

  try {
    const totalRank = await getRankData('rank_total');
    if (totalRank.code === 0 && totalRank.data && totalRank.data.ranklist) {
      console.log('总榜数据 (前20名):');
      totalRank.data.ranklist.forEach((r, index) => {
        console.log(`${index + 1}. ${r.playername} - 分数: ${r.score} - openid: ${r.openid}`);
      });
      
      console.log('\n查找测试数据:');
      const found = totalRank.data.ranklist.filter(r => r.openid.startsWith('test_fixed_url'));
      if (found.length > 0) {
        console.log('✓ 找到', found.length, '条测试数据:');
        found.forEach(r => {
          console.log('  -', r.playername, '- 分数:', r.score, '- openid:', r.openid);
        });
      } else {
        console.log('✗ 未找到测试数据');
      }
    } else {
      console.log('✗ 获取总榜失败:', totalRank);
    }
  } catch (error) {
    console.error('验证失败:', error);
  }

  console.log('\n==================');
}

main();
