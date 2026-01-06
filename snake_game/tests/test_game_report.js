const http = require('http');

const appid = 'wxf67531bdf3d328af';
const openid = 'test_game_user_' + Date.now();
const playerName = '测试玩家';
const score = 10;

const postData = JSON.stringify({
  appid: appid,
  rankid: 'rank_total',
  openid: openid,
  score: score,
  playername: playerName,
  portrait: '',
  ext: '{}'
});

const options = {
  hostname: '43.139.6.101',
  port: 3000,
  path: '/v2/rank/api/report/rankreport?appid=' + appid,
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

console.log('=== 测试总榜上报 ===');
console.log('URL:', `http://${options.hostname}:${options.port}${options.path}`);
console.log('Data:', postData);
console.log('');

const req = http.request(options, (res) => {
  console.log(`状态码: ${res.statusCode}`);
  console.log('响应头:', JSON.stringify(res.headers, null, 2));
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', data);
    console.log('');
    
    testDayRank();
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.write(postData);
req.end();

function testDayRank() {
  const dayPostData = JSON.stringify({
    appid: appid,
    rankid: 'rank_day',
    openid: openid,
    score: score,
    playername: playerName,
    portrait: '',
    ext: '{}'
  });

  const dayOptions = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankreport?appid=' + appid,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(dayPostData)
    }
  };

  console.log('=== 测试日榜上报 ===');
  console.log('URL:', `http://${dayOptions.hostname}:${dayOptions.port}${dayOptions.path}`);
  console.log('Data:', dayPostData);
  console.log('');

  const dayReq = http.request(dayOptions, (res) => {
    console.log(`状态码: ${res.statusCode}`);
    console.log('响应头:', JSON.stringify(res.headers, null, 2));
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应体:', data);
      console.log('');
      console.log('测试完成！');
    });
  });

  dayReq.on('error', (error) => {
    console.error('请求错误:', error);
  });

  dayReq.write(dayPostData);
  dayReq.end();
}
