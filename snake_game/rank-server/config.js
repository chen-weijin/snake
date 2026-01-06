// 配置文件
module.exports = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
  },
  
  // 数据库配置
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://43.139.6.101:27017/rank-server',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  
  // API配置
  api: {
    prefix: '/v2/rank/api',
  },
  
  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
};