const http = require('http');

const options = {
  hostname: '43.139.6.101',
  port: 3000,
  path: '/v2/rank/api/report/rankreport?appid=wxf67531bdf3d328af',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const testData = {
  appid: 'wxf67531bdf3d328af',
  rankid: 'rank_day',
  openid: 'test_user_1',
  score: 100,
  playername: 'testuser1'
};

const postData = JSON.stringify(testData);

console.log('发送请求...');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Headers:', options.headers);
console.log('Body:', postData);

const req = http.request(options, (res) => {
  console.log(`\n响应状态码: ${res.statusCode}`);
  console.log('响应头:', res.headers);

  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('\n响应内容:', data);
    try {
      const jsonData = JSON.parse(data);
      console.log('解析后的JSON:', jsonData);
    } catch (e) {
      console.error('解析响应JSON失败:', e);
    }
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.write(postData);
req.end();

console.log('\n等待服务器响应...');
