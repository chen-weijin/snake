const http = require('http');

const appid = 'wxf67531bdf3d328af';
const testOpenid = 'test_final_' + Date.now();

function reportScore(rankid, score) {
  const postData = JSON.stringify({
    appid: appid,
    rankid: rankid,
    openid: testOpenid,
    score: score,
    playername: 'Test Final Player',
    portrait: ''
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

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`上报${rankid}分数:`, data);
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error(`上报${rankid}分数错误:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

function getRankData(rankid) {
  const postData = JSON.stringify({
    appid: appid,
    rankid: rankid
  });

  const options = {
    hostname: '43.139.6.101',
    port: 3000,
    path: '/v2/rank/api/report/rankdata',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        console.log(`\n=== 获取${rankid}数据 ===`);
        console.log('状态码:', res.statusCode);
        console.log('响应体:', data);
        
        try {
          const result = JSON.parse(data);
          if (result.code === 0 && result.data && result.data.list) {
            console.log(`找到 ${result.data.list.length} 条记录`);
            result.data.list.forEach((item, index) => {
              console.log(`  ${index + 1}. ${item.playername} (${item.openid}) - ${item.score}分`);
            });
          }
        } catch (e) {
          console.log('解析响应失败:', e.message);
        }
        
        resolve(data);
      });
    });

    req.on('error', (error) => {
      console.error(`获取${rankid}数据错误:`, error);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

async function testFlow() {
  console.log('=== 开始测试流程 ===');
  console.log('测试玩家ID:', testOpenid);
  
  try {
    console.log('\n1. 上报总榜分数...');
    await reportScore('rank_total', 200);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n2. 上报日榜分数...');
    await reportScore('rank_day', 200);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('\n3. 获取总榜数据...');
    await getRankData('rank_total');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log('\n4. 获取日榜数据...');
    await getRankData('rank_day');
    
    console.log('\n=== 测试完成 ===');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

testFlow();
