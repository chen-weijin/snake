const http = require('http');

const appid = 'wxf67531bdf3d328af';
const host = '43.139.6.101';
const port = 3000;

function getRankData(rankid) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      appid: appid,
      rankid: rankid,
      count: 10
    });

    const options = {
      hostname: host,
      port: port,
      path: '/v2/rank/api/report/rankdata',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function main() {
  try {
    console.log('=== 获取总榜数据 ===');
    const totalRank = await getRankData('rank_total');
    console.log('总榜数据:', JSON.stringify(totalRank, null, 2));
    
    console.log('\n=== 获取日榜数据 ===');
    const dayRank = await getRankData('rank_day');
    console.log('日榜数据:', JSON.stringify(dayRank, null, 2));
    
    console.log('\n验证完成！');
  } catch (error) {
    console.error('Error:', error);
  }
}

main().then(() => {
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
