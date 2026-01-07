#!/bin/bash

# 新服务器部署脚本
# 使用方法：bash deploy_new_server.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署新服务器...${NC}"

# 1. 检查Node.js版本
echo -e "${YELLOW}1. 检查Node.js版本...${NC}"
node -v
npm -v

# 2. 安装PM2（如果未安装）
echo -e "${YELLOW}2. 安装PM2...${NC}"
npm install -g pm2

# 3. 创建项目目录
echo -e "${YELLOW}3. 创建项目目录...${NC}"
mkdir -p /opt/server
chown -R $USER:$USER /opt/server

# 4. 复制项目文件
echo -e "${YELLOW}4. 复制项目文件...${NC}"
cp -r . /opt/server/

# 5. 安装项目依赖
echo -e "${YELLOW}5. 安装项目依赖...${NC}"
cd /opt/server
npm install

# 6. 创建环境变量文件
echo -e "${YELLOW}6. 创建环境变量文件...${NC}"
cat > .env << EOF
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://43.139.6.101:27017/rank-server

# 日志级别
LOG_LEVEL=info
EOF

# 7. 停止旧服务（如果存在）
echo -e "${YELLOW}7. 停止旧服务...${NC}"
pm2 stop rank-server 2>/dev/null || true
pm2 delete rank-server 2>/dev/null || true

# 8. 启动新服务器
echo -e "${YELLOW}8. 启动新服务器...${NC}"
pm2 start app.js --name "server"

# 9. 配置PM2开机自启
echo -e "${YELLOW}9. 配置PM2开机自启...${NC}"
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

# 10. 初始化排行榜配置
echo -e "${YELLOW}10. 初始化排行榜配置...${NC}"
sleep 5 # 等待服务启动
curl -X POST http://localhost:3000/v2/rank/api/initconfig \
  -H "Content-Type: application/json" \
  -d '{"appid": "wxf67531bdf3d328af"}'

# 11. 显示部署结果
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}新服务器已成功部署！${NC}"
echo -e "${YELLOW}服务状态：${NC}"
pm2 status

echo -e "${YELLOW}访问地址：${NC}"
echo -e "http://$(curl -s ifconfig.me):3000/health"
echo -e "http://$(curl -s ifconfig.me):3000/v2/rank/api/"
echo -e "http://$(curl -s ifconfig.me):3000/v2/userdata/"

echo -e "${YELLOW}查看日志：${NC}"
echo -e "pm2 logs server"

echo -e "${YELLOW}重启服务：${NC}"
echo -e "pm2 restart server"

echo -e "${GREEN}部署脚本执行完成！${NC}"