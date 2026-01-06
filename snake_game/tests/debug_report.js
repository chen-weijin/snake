const http = require('http');

// 测试单独上报到总榜
try {
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
    rankid: 'rank_total',
    openid: 'debug_test_' + Date.now(),
    playername: '调试测试',
    score: 123
  };

  console.log('发送测试数据:', testData);

  const req = http.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('响应:', data);
    });
  });

  req.on('error', (error) => {
    console.error('请求错误:', error);
  });

  req.write(JSON.stringify(testData));
  req.end();
} catch (error) {
  console.error('发送失败:', error);
}