const http = require('http');

const testData = {
  appid: 'wxf67531bdf3d328af',
  rankid: 'rank_day',
  openid: 'test_user_final',
  score: 150,
  playername: 'finaltest'
};

const reportOptions = {
  hostname: '43.139.6.101',
  port: 3000,
  path: '/v2/rank/api/report/rankreport?appid=wxf67531bdf3d328af',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const postData = JSON.stringify(testData);

console.log('=== 上报分数 ===');
console.log('上报数据:', testData);

const req = http.request(reportOptions, (res) => {
  console.log('响应状态码:', res.statusCode);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应内容:', data);
    console.log('\n=== 获取排行榜数据 ===');
    
    const rankData = JSON.stringify({
      appid: 'wxf67531bdf3d328af',
      rankid: 'rank_day',
      range_from: 0,
      range_to: 9
    });

    const rankOptions = {
      hostname: '43.139.6.101',
      port: 3000,
      path: '/v2/rank/api/report/rankdata',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': rankData.length
      }
    };

    const rankReq = http.request(rankOptions, (rankRes) => {
      let rankBody = '';
      rankRes.on('data', (chunk) => {
        rankBody += chunk;
      });
      
      rankRes.on('end', () => {
        console.log('响应状态码:', rankRes.statusCode);
        const result = JSON.parse(rankBody);
        if (result.code === 0 && result.data && result.data.ranklist) {
          console.log('\n排行榜数据:');
          result.data.ranklist.forEach((item, index) => {
            console.log(`${index + 1}. ${item.playername} - ${item.score}分 (openid: ${item.openid})`);
          });
          
          const found = result.data.ranklist.find(item => item.openid === testData.openid);
          if (found) {
            console.log('\n✓ 上报的数据已成功保存到数据库！');
          } else {
            console.log('\n✗ 上报的数据未在排行榜中找到');
          }
        }
      });
    });

    rankReq.on('error', (error) => {
      console.error('获取排行榜错误:', error);
    });

    rankReq.write(rankData);
    rankReq.end();
  });
});

req.on('error', (error) => {
  console.error('上报错误:', error);
});

req.write(postData);
req.end();
