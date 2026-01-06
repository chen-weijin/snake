const http = require('http');

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);

const yesterdayDate = `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
const todayDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

console.log('测试日榜重置功能');
console.log('==================');
console.log(`昨天日期: ${yesterdayDate}`);
console.log(`今天日期: ${todayDate}`);
console.log('');

function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    console.log(`  请求: ${options.method} http://${options.hostname}:${options.port}${options.path}`);
    console.log(`  数据: ${data}`);
    
    const req = http.request(options, (res) => {
      console.log(`  响应状态: ${res.statusCode}`);
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', (e) => { 
      console.error(`  请求错误: ${e.message}`);
      console.error(`  错误详情: ${JSON.stringify(e)}`);
      reject(e); 
    });
    req.write(data);
    req.end();
  });
}

async function testDailyRankReset() {
  const baseUrl = '43.139.6.101';
  const port = 3000;
  const appid = 'wxf67531bdf3d328af';
  const rankid = 'rank_day';

  try {
    console.log('步骤1: 添加今天的日榜数据');
    const todayData = JSON.stringify({
      appid,
      rankid,
      openid: 'test_user_today',
      score: 300,
      playername: 'today_user'
    });

    const todayOptions = {
      hostname: baseUrl,
      port,
      path: '/v2/rank/api/report/rankreport',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': todayData.length
      }
    };

    try {
      const todayResult = await makeRequest(todayOptions, todayData);
      console.log(`状态: ${todayResult.status}`);
      console.log(`响应: ${JSON.stringify(todayResult.data)}`);
    } catch (error) {
      console.error('步骤1失败:', error.message);
      return;
    }
    console.log('');

    console.log('步骤2: 查询所有日榜数据');
    const queryData = JSON.stringify({
      appid,
      rankid,
      range_from: 0,
      range_to: 9
    });

    const queryOptions = {
      hostname: baseUrl,
      port,
      path: '/v2/rank/api/report/rankdata',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': queryData.length
      }
    };

    try {
      const queryResult = await makeRequest(queryOptions, queryData);
      console.log(`状态: ${queryResult.status}`);
      console.log(`响应: ${JSON.stringify(queryResult.data)}`);
    } catch (error) {
      console.error('步骤2失败:', error.message);
      return;
    }
    console.log('');

    console.log('步骤3: 测试日榜重置(删除今天的数据)');
    const resetData = JSON.stringify({
      appid,
      rankid,
      date: todayDate
    });

    const resetOptions = {
      hostname: baseUrl,
      port,
      path: '/v2/rank/api/report/reset',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': resetData.length
      }
    };

    try {
      const resetResult = await makeRequest(resetOptions, resetData);
      console.log(`状态: ${resetResult.status}`);
      console.log(`响应: ${JSON.stringify(resetResult.data)}`);
    } catch (error) {
      console.error('步骤3失败:', error.message);
      return;
    }
    console.log('');

    console.log('步骤4: 再次查询日榜数据,验证今天的数据已被删除');
    try {
      const queryAfterResetResult = await makeRequest(queryOptions, queryData);
      console.log(`状态: ${queryAfterResetResult.status}`);
      console.log(`响应: ${JSON.stringify(queryAfterResetResult.data)}`);
      console.log('');

      if (queryAfterResetResult.data.code === 0 && queryAfterResetResult.data.data.ranklist) {
        const ranklist = queryAfterResetResult.data.data.ranklist;
        
        if (ranklist.length === 0) {
          console.log('✓ 测试成功: 今天的数据已被删除,日榜已清空');
        } else {
          console.log('❌ 测试失败: 今天的数据仍然存在');
        }
      }
    } catch (error) {
      console.error('步骤4失败:', error.message);
    }

  } catch (error) {
    console.error('测试失败:', error.message);
  }
}

testDailyRankReset();
