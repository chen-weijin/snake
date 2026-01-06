const http = require('http');

function reportScore(rankid, openid, playername, score) {
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
      playername: playername,
      score: score
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

function getRankData(rankid, openid) {
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
      openid: openid,
      range_from: 0,
      range_to: 19
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
  const testOpenid = 'test_verify_' + Date.now();
  const playerName = '验证上报功能';
  const testScore = 100;

  console.log('=== 验证分数上报功能 ===\n');

  try {
    console.log('1. 上报到总榜 (rank_total):');
    const totalReport = await reportScore('rank_total', testOpenid, playerName, testScore);
    console.log('   上报结果:', totalReport);

    console.log('\n2. 上报到日榜 (rank_day):');
    const dayReport = await reportScore('rank_day', testOpenid, playerName, testScore);
    console.log('   上报结果:', dayReport);

    console.log('\n3. 查询总榜数据:');
    const totalRank = await getRankData('rank_total', testOpenid);
    if (totalRank.code === 0 && totalRank.data) {
      console.log('   总榜排行榜数量:', totalRank.data.ranklist.length);
      const foundInTotal = totalRank.data.ranklist.find(r => r.openid === testOpenid);
      if (foundInTotal) {
        console.log('   ✓ 找到测试数据:', foundInTotal.playername, '- 分数:', foundInTotal.score, '- 排名:', foundInTotal.rank);
      } else {
        console.log('   ✗ 未找到测试数据');
      }
      if (totalRank.data.self) {
        console.log('   自己的数据:', totalRank.data.self.playername, '- 分数:', totalRank.data.self.score, '- 排名:', totalRank.data.self.rank);
      }
    } else {
      console.log('   ✗ 查询总榜失败:', totalRank);
    }

    console.log('\n4. 查询日榜数据:');
    const dayRank = await getRankData('rank_day', testOpenid);
    if (dayRank.code === 0 && dayRank.data) {
      console.log('   日榜排行榜数量:', dayRank.data.ranklist.length);
      const foundInDay = dayRank.data.ranklist.find(r => r.openid === testOpenid);
      if (foundInDay) {
        console.log('   ✓ 找到测试数据:', foundInDay.playername, '- 分数:', foundInDay.score, '- 排名:', foundInDay.rank);
      } else {
        console.log('   ✗ 未找到测试数据');
      }
      if (dayRank.data.self) {
        console.log('   自己的数据:', dayRank.data.self.playername, '- 分数:', dayRank.data.self.score, '- 排名:', dayRank.data.self.rank);
      }
    } else {
      console.log('   ✗ 查询日榜失败:', dayRank);
    }

    console.log('\n5. 结论:');
    const totalSuccess = totalReport.code === 0 && totalRank.code === 0 && totalRank.data && totalRank.data.ranklist.find(r => r.openid === testOpenid);
    const daySuccess = dayReport.code === 0 && dayRank.code === 0 && dayRank.data && dayRank.data.ranklist.find(r => r.openid === testOpenid);
    
    if (totalSuccess && daySuccess) {
      console.log('   ✓ 分数上报功能正常! 总榜和日榜都能正常接收和显示数据');
    } else {
      console.log('   ✗ 分数上报功能存在问题');
      if (!totalSuccess) console.log('   - 总榜上报或查询失败');
      if (!daySuccess) console.log('   - 日榜上报或查询失败');
    }

  } catch (error) {
    console.error('验证失败:', error);
  }

  console.log('\n==================');
}

main();