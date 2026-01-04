const http = require('http');

const options = {
  hostname: '43.139.6.101',
  port: 3000,
  path: '/v2/rank/api/report/rankdata',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
};

const postData = JSON.stringify({
  appid: 'wxf67531bdf3d328af',
  rankid: 'rank_total',
  openid: 'test123',
  range_from: 0,
  range_to: 9
});

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('HTTP状态码:', res.statusCode);
    console.log('响应内容:', data);
    try {
      const parsed = JSON.parse(data);
      console.log('解析后的JSON:', JSON.stringify(parsed, null, 2));
      
      if (parsed.code !== undefined) {
        console.log('✓ 响应包含code字段:', parsed.code);
      } else {
        console.log('✗ 响应缺少code字段');
      }
      
      if (parsed.data !== undefined) {
        console.log('✓ 响应包含data字段');
      } else {
        console.log('✗ 响应缺少data字段');
      }
    } catch (e) {
      console.error('解析JSON失败:', e);
    }
  });
});

req.on('error', (e) => {
  console.error('请求错误:', e);
});

req.write(postData);
req.end();
