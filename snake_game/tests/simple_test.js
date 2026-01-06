const http = require('http');

function testRankReport() {
  const options = {
    hostname: 'localhost',
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
    openid: 'test_' + Date.now(),
    playername: '测试用户',
    score: 100
  };

  const req = http.request(options, (res) => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', JSON.stringify(res.headers, null, 2));
    
    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log('Response Body:', data);
      try {
        const result = JSON.parse(data);
        console.log('Parsed Result:', JSON.stringify(result, null, 2));
      } catch (e) {
        console.error('Failed to parse JSON:', e);
      }
    });
  });

  req.on('error', (error) => {
    console.error('Request Error:', error);
  });

  console.log('Sending Test Data:', JSON.stringify(testData, null, 2));
  req.write(JSON.stringify(testData));
  req.end();
}

testRankReport();
