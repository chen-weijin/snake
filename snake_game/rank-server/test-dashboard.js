const http = require('http');

const SERVER_HOST = '43.139.6.101';
const SERVER_PORT = 3000;

function testHealthCheck() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: SERVER_HOST,
      port: SERVER_PORT,
      path: '/health',
      method: 'GET',
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

    req.end();
  });
}

async function testWebDashboard() {
  console.log('测试服务器健康检查...');
  try {
    const health = await testHealthCheck();
    console.log('✓ 服务器健康检查通过:', health);
    console.log('\n========================================');
    console.log('可视化工具已成功部署！');
    console.log('========================================');
    console.log(`访问地址: http://${SERVER_HOST}:${SERVER_PORT}/index.html`);
    console.log(`本地访问: http://localhost:${SERVER_PORT}/index.html`);
    console.log('========================================\n');
  } catch (error) {
    console.error('✗ 测试失败:', error.message);
  }
}

testWebDashboard();