const http = require('http');

async function testWithNewAppid() {
  console.log('=== 使用新 appid 测试修复后的分数上报功能 ===\n');
  
  const newAppid = 'test_app_' + Date.now();
  const testOpenid = 'final_test_' + Date.now();
  
  // 1. 初始化配置
  console.log('1. 初始化排行榜配置');
  const initResult = await new Promise((resolve, reject) => {
    const options = {
      hostname: '43.139.6.101',
      port: 3000,
      path: '/v2/rank/api/initconfig',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ appid: newAppid }));
    req.end();
  });
  
  console.log('初始化结果:', initResult);
  
  // 2. 上报分数
  console.log('\n2. 上报分数');
  const reportResult = await new Promise((resolve, reject) => {
    const options = {
      hostname: '43.139.6.101',
      port: 3000,
      path: '/v2/rank/api/rankreport',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({
      appid: newAppid,
      rankid: 'rank_total',
      openid: testOpenid,
      playername: '新App测试',
      score: 789
    }));
    req.end();
  });
  
  console.log('上报结果:', reportResult);
  
  // 3. 查询排行榜
  console.log('\n3. 查询排行榜');
  const rankResult = await new Promise((resolve, reject) => {
    const options = {
      hostname: '43.139.6.101',
      port: 3000,
      path: '/v2/rank/api/rankdata',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({
      appid: newAppid,
      rankid: 'rank_total',
      openid: testOpenid
    }));
    req.end();
  });
  
  console.log('排行榜结果:', rankResult);
  
  // 4. 验证结果
  console.log('\n4. 验证结果:');
  if (rankResult.code === 0 && rankResult.data) {
    const foundInList = rankResult.data.ranklist.find(item => item.openid === testOpenid);
    if (foundInList) {
      console.log('✓ 测试数据出现在排行榜列表中:', foundInList);
    } else {
      console.log('✗ 测试数据未出现在排行榜列表中');
      console.log('排行榜列表:', rankResult.data.ranklist);
    }
    
    if (rankResult.data.self) {
      console.log('✓ 自己的数据正确返回:', rankResult.data.self);
    } else {
      console.log('✗ 自己的数据未返回');
    }
  } else {
    console.log('✗ 查询排行榜失败');
  }
  
  console.log('\n=== 测试完成 ===');
}

testWithNewAppid().catch(console.error);