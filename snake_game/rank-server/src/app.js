const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const rankRoutes = require('./routes/rank');
const config = require('../config');
const path = require('path');
const { startDailyRankResetJob } = require('./utils/dailyRankReset');

// 创建Express应用
const app = express();

// 配置中间件
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 配置静态文件服务
app.use(express.static(path.join(__dirname, '../public')));

// 配置数据库连接
mongoose.connect(config.database.uri, config.database.options)
.then(() => {
  console.log('Connected to MongoDB');
  startDailyRankResetJob();
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// 注册路由
app.use(config.api.prefix, rankRoutes);

// 健康检查路由
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// 404 处理中间件
app.use((req, res, next) => {
  res.status(404).json({ code: 404, message: 'API endpoint not found' });
});

// 全局错误处理中间件
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  res.status(500).json({ code: 500, message: 'Internal server error' });
});

// 启动服务器
app.listen(config.server.port, () => {
  console.log(`Server is running on port ${config.server.port}`);
  console.log(`Web Dashboard: http://localhost:${config.server.port}/index.html`);
  console.log(`API Endpoints:`);
  console.log(`- GET  /health`);
  console.log(`- GET  ${config.api.prefix}/rankconfig`);
  console.log(`- POST ${config.api.prefix}/rankreport`);
  console.log(`- POST ${config.api.prefix}/rankdata`);
  console.log(`- POST ${config.api.prefix}/initconfig`);
  console.log(`- POST ${config.api.prefix}/reset`);
});