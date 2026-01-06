const http = require('http');

function getRankData(rankid) {
  const postData = JSON.stringify({
    appid: 'wxf67531bdf3d328af',
    rankid: rankid,
    openid: null,
    range_from: 0,
    range_to: 9
  });

  const options = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankdata',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        console.log(`\n=== 获取${rankid}数据 ===`);
        console.log('状态码:', res.statusCode);
        try {
          const json = JSON.parse(data);
          console.log('响应体:', JSON.stringify(json, null, 2));
          if (json.code === 0 && json.data && json.data.ranklist) {
            console.log('排行榜记录数:', json.data.ranklist.length);
            if (json.data.ranklist.length > 0) {
              console.log('前3条记录:');
              json.data.ranklist.slice(0, 3).forEach(item => {
                console.log(`  排名${item.rank}: ${item.playername} (${item.openid}) - ${item.score}分, date=${item.date}`);
              });
            }
          }
          resolve(data);
        } catch (e) {
          console.log('响应体:', data);
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      console.error(`获取${rankid}数据错误:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testRankings() {
  console.log('=== 测试排行榜数据获取 ===');
  
  try {
    console.log('\n1. 获取总榜数据...');
    await getRankData('rank_total');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n2. 获取日榜数据...');
    await getRankData('rank_day');
    
    console.log('\n=== 测试完成 ===');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testRankings();