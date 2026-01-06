const http = require('http');

const appid = 'wxf67531bdf3d328af';
const openid = 'test_game_client_' + Date.now();
const score = 50;
const playername = '游戏客户端测试玩家';
const portrait = '';

const postData = JSON.stringify({
  appid: appid,
  rankid: 'rank_total',
  openid: openid,
  score: score,
  playername: playername,
  portrait: portrait
});

const options = {
  hostname: '43.139.6.101',
  port: 3000,
  path: '/v2/rank/api/report/rankreport',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log('=== 上报总榜分数 ===');
  console.log('状态码:', res.statusCode);
  console.log('响应头:', res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('响应体:', data);
    
    setTimeout(() => {
      reportDailyRank();
    }, 1000);
  });
});

req.on('error', (error) => {
  console.error('请求错误:', error);
});

req.write(postData);
req.end();

function reportDailyRank() {
  const postData2 = JSON.stringify({
    appid: appid,
    rankid: 'rank_day',
    openid: openid,
    score: score,
    playername: playername,
    portrait: portrait
  });

  const options2 = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankreport',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData2)
    }
  };

  const req2 = http.request(options2, (res) => {
    console.log('\n=== 上报日榜分数 ===');
    console.log('状态码:', res.statusCode);
    console.log('响应头:', res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应体:', data);
      
      setTimeout(() => {
        getRankData();
      }, 1000);
    });
  });

  req2.on('error', (error) => {
    console.error('请求错误:', error);
  });

  req2.write(postData2);
  req2.end();
}

function getRankData() {
  const postData = JSON.stringify({
    appid: appid,
    rankid: 'rank_total'
  });

  const getOptions = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankdata',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const getReq = http.request(getOptions, (res) => {
    console.log('\n=== 获取总榜数据 ===');
    console.log('状态码:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应体:', data);
      
      setTimeout(() => {
        getDailyRankData();
      }, 1000);
    });
  });

  getReq.on('error', (error) => {
    console.error('请求错误:', error);
  });

  getReq.write(postData);
  getReq.end();
}

function getDailyRankData() {
  const postData = JSON.stringify({
    appid: appid,
    rankid: 'rank_day'
  });

  const getOptions = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankdata',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const getReq = http.request(getOptions, (res) => {
    console.log('\n=== 获取日榜数据 ===');
    console.log('状态码:', res.statusCode);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('响应体:', data);
      console.log('\n=== 测试完成 ===');
    });
  });

  getReq.on('error', (error) => {
    console.error('请求错误:', error);
  });

  getReq.write(postData);
  getReq.end();
}