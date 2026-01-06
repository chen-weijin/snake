const http = require('http');

const data = JSON.stringify({
  appid: 'wxf67531bdf3d328af',
  rankid: 'rank_day',
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
    const result = JSON.parse(body);
    if (result.code === 0 && result.data && result.data.list) {
      console.log('\n排行榜数据:');
      result.data.list.forEach((item, index) => {
        console.log(`${index + 1}. ${item.playername} - ${item.score}分 (openid: ${item.openid})`);
      });
    }
  });
});

req.on('error', (e) => {
  console.error('Error:', e.message);
});

req.write(data);
req.end();
