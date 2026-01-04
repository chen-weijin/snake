const http = require('http');

const data = JSON.stringify({
  appid: 'wxf67531bdf3d328af',
  rankid: 'rank_day',
  openid: 'test_user_3',
  score: 300,
  playername: 'testuser3'
});

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/v2/rank/api/report/rankreport',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, (res) => {
  let body = '';
  res.on('data', (chunk) => {
    body += chunk;
  });
  res.on('end', () => {
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
