const http = require('http');

const options = {
  hostname: '43.139.6.101',
  port: 3000,
  path: '/v2/rank/api/rankreport?appid=wxf67531bdf3d328af',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const testData = {
  appid: 'wxf67531bdf3d328af',
  rankid: 'rank_total',
  openid: 'test_fixed_url_' + Date.now(),
  score: 100,
  playername: '测试修复后的URL',
  portrait: '',
  ext: '{}'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('=== 测试修复后的 API URL ===');
    console.log('状态码:', res.statusCode);
    console.log('响应:', data);
    console.log('==========================');
  });
});

req.on('error', (error) => {
  console.error('请求失败:', error);
});

req.write(JSON.stringify(testData));
req.end();
