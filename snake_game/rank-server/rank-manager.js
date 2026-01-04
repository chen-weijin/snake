const http = require('http');

const SERVER_HOST = '43.139.6.101';
const SERVER_PORT = 3000;
const API_BASE = `/v2/rank/api`;

function makeRequest(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = `${API_BASE}${path}`;
    const options = {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: url,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => {
        body += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          reject(new Error(`Failed to parse response: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function resetRankData(appid, rankid = null) {
  console.log(`\n=== 重置排行榜数据 ===`);
  console.log(`AppID: ${appid}`);
  if (rankid) {
    console.log(`RankID: ${rankid}`);
  }
  
  const data = { appid };
  if (rankid) {
    data.rankid = rankid;
  }
  
  try {
    const response = await makeRequest('POST', '/reset', data);
    console.log('✓ 重置成功');
    console.log(`删除记录数: ${response.data.deletedCount}`);
    return response;
  } catch (error) {
    console.error('✗ 重置失败:', error.message);
    throw error;
  }
}

async function reportScore(appid, rankid, openid, score, playername = null, portrait = null) {
  console.log(`\n=== 上报分数 ===`);
  console.log(`AppID: ${appid}`);
  console.log(`RankID: ${rankid}`);
  console.log(`OpenID: ${openid}`);
  console.log(`分数: ${score}`);
  
  const data = {
    appid,
    rankid,
    openid,
    score,
    playername,
    portrait,
  };
  
  try {
    const response = await makeRequest('POST', '/rankreport', data);
    console.log('✓ 上报成功');
    return response;
  } catch (error) {
    console.error('✗ 上报失败:', error.message);
    throw error;
  }
}

async function getRankList(appid, rankid, openid = null, rangeFrom = 0, rangeTo = 9) {
  console.log(`\n=== 获取排行榜 ===`);
  console.log(`AppID: ${appid}`);
  console.log(`RankID: ${rankid}`);
  console.log(`查询范围: ${rangeFrom} - ${rangeTo}`);
  if (openid) {
    console.log(`OpenID: ${openid}`);
  }
  
  const data = {
    appid,
    rankid,
    openid,
    range_from: rangeFrom,
    range_to: rangeTo,
  };
  
  try {
    const response = await makeRequest('POST', '/rankdata', data);
    console.log('✓ 获取成功');
    console.log(`\n排行榜数据:`);
    if (response.data.ranklist && response.data.ranklist.length > 0) {
      response.data.ranklist.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.playername || item.openid} - ${item.score}分 (OpenID: ${item.openid})`);
      });
    } else {
      console.log('  暂无数据');
    }
    
    if (response.data.self) {
      console.log(`\n当前玩家排名: 第${response.data.self.rank}名 - ${response.data.self.score}分`);
    }
    
    return response;
  } catch (error) {
    console.error('✗ 获取失败:', error.message);
    throw error;
  }
}

async function initConfig(appid) {
  console.log(`\n=== 初始化配置 ===`);
  console.log(`AppID: ${appid}`);
  
  try {
    const response = await makeRequest('POST', '/initconfig', { appid });
    console.log('✓ 初始化成功');
    return response;
  } catch (error) {
    console.error('✗ 初始化失败:', error.message);
    throw error;
  }
}

async function generateRandomPlayers(appid, rankid, count = 10) {
  console.log(`\n=== 生成随机玩家数据 ===`);
  console.log(`生成 ${count} 个玩家...`);
  
  const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑十一', '王十二', '小明', '小红', '小刚', '小丽', '小强'];
  
  for (let i = 0; i < count; i++) {
    const openid = `player_${Date.now()}_${i}`;
    const score = Math.floor(Math.random() * 10000) + 100;
    const playername = names[Math.floor(Math.random() * names.length)];
    
    await reportScore(appid, rankid, openid, score, playername);
    
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.log(`✓ 已生成 ${count} 个玩家数据`);
}

async function showMenu() {
  console.log('\n========================================');
  console.log('       排行榜管理工具');
  console.log('========================================');
  console.log('1. 重置排行榜数据');
  console.log('2. 上报玩家分数');
  console.log('3. 获取排行榜列表');
  console.log('4. 生成随机玩家数据');
  console.log('5. 初始化配置');
  console.log('6. 完整测试流程');
  console.log('0. 退出');
  console.log('========================================');
}

async function runFullTest() {
  console.log('\n\n========================================');
  console.log('       开始完整测试流程');
  console.log('========================================');
  
  const appid = 'test_app';
  const rankid = 'rank_total';
  
  try {
    await initConfig(appid);
    await resetRankData(appid, rankid);
    await generateRandomPlayers(appid, rankid, 5);
    await getRankList(appid, rankid);
    
    console.log('\n========================================');
    console.log('       测试完成！');
    console.log('========================================');
  } catch (error) {
    console.error('\n测试失败:', error.message);
  }
}

async function main() {
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  const question = (prompt) => {
    return new Promise((resolve) => {
      rl.question(prompt, resolve);
    });
  };
  
  while (true) {
    await showMenu();
    const choice = await question('请选择操作: ');
    
    switch (choice.trim()) {
      case '1': {
        const appid = await question('请输入 AppID: ');
        const rankidInput = await question('请输入 RankID (可选，直接回车跳过): ');
        const rankid = rankidInput.trim() || null;
        await resetRankData(appid, rankid);
        break;
      }
      
      case '2': {
        const appid = await question('请输入 AppID: ');
        const rankid = await question('请输入 RankID: ');
        const openid = await question('请输入 OpenID: ');
        const score = await question('请输入分数: ');
        const playername = await question('请输入玩家名称 (可选): ');
        await reportScore(appid, rankid, openid, parseInt(score), playername || null);
        break;
      }
      
      case '3': {
        const appid = await question('请输入 AppID: ');
        const rankid = await question('请输入 RankID: ');
        const openidInput = await question('请输入 OpenID (可选): ');
        const openid = openidInput.trim() || null;
        await getRankList(appid, rankid, openid);
        break;
      }
      
      case '4': {
        const appid = await question('请输入 AppID: ');
        const rankid = await question('请输入 RankID: ');
        const countInput = await question('请输入生成数量 (默认10): ');
        const count = parseInt(countInput) || 10;
        await generateRandomPlayers(appid, rankid, count);
        break;
      }
      
      case '5': {
        const appid = await question('请输入 AppID: ');
        await initConfig(appid);
        break;
      }
      
      case '6': {
        await runFullTest();
        break;
      }
      
      case '0':
        console.log('再见！');
        rl.close();
        return;
      
      default:
        console.log('无效的选择，请重新输入');
    }
    
    await question('\n按回车键继续...');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = {
  resetRankData,
  reportScore,
  getRankList,
  initConfig,
  generateRandomPlayers,
  runFullTest,
};