const fs = require('fs');
const path = require('path');

// Read the controller file
const controllerPath = '/root/rank-server/src/controllers/rankController.js';

if (fs.existsSync(controllerPath)) {
  const content = fs.readFileSync(controllerPath, 'utf8');
  console.log('=== 当前服务器上的 controller 代码 ===');
  console.log(content);
} else {
  console.log('文件不存在:', controllerPath);
}