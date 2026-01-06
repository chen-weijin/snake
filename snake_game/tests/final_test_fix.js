const http = require('http');

async function testScoreReporting() {
  console.log('=== 测试修复后的分数上报功能 ===\n');
  
  const testOpenid = 'final_test_' + Date.now();
  const testData = {
    appid: 'wxf67531bdf3d328af',
    rankid: 'rank_total',
    openid: testOpenid,
    playername: '最终测试',
    score: 456
  };
  
  console.log('1. 发送分数上报请求:', testData);
  
  // 发送上报请求
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
    req.write(JSON.stringify(testData));
    req.end();
  });
  
  console.log('2. 上报响应:', reportResult);
  
  if (reportResult.code !== 0) {
    console.log('✗ 上报失败');
    return;
  }
  
  // 查询总榜数据
  console.log('\n3. 查询总榜数据');
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
      appid: 'wxf67531bdf3d328af',
      rankid: 'rank_total',
      openid: testOpenid
    }));
    req.end();
  });
  
  console.log('4. 排行榜查询响应:', rankResult);
  
  if (rankResult.code === 0 && rankResult.data) {
    console.log('\n5. 验证结果:');
    
    // 检查排行榜列表中是否有我们的测试数据
    const foundInList = rankResult.data.ranklist.find(item => item.openid === testOpenid);
    if (foundInList) {
      console.log('✓ 测试数据出现在排行榜列表中:', foundInList);
    } else {
      console.log('✗ 测试数据未出现在排行榜列表中');
      console.log('排行榜列表:', rankResult.data.ranklist);
    }
    
    // 检查自己的数据是否返回
    if (rankResult.data.self) {
      console.log('✓ 自己的数据正确返回:', rankResult.data.self);
    } else {
      console.log('✗ 自己的数据未返回');
    }
  } else {
    console.log('\n✗ 查询排行榜失败');
  }
  
  console.log('\n=== 测试完成 ===');
}

testScoreReporting().catch(console.error);