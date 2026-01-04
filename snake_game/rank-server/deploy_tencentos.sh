#!/bin/bash

# 腾讯云TencentOS专用排行榜服务器部署脚本
# 使用方法：bash deploy_tencentos.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始在TencentOS上部署排行榜服务器...${NC}"

# 1. 更新系统
echo -e "${YELLOW}1. 更新系统...${NC}"
sudo yum update -y
sudo yum upgrade -y

# 2. 安装Node.js 16
echo -e "${YELLOW}2. 安装Node.js 16...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_16.x | sudo bash -
sudo yum install -y nodejs

# 3. 安装Git
echo -e "${YELLOW}3. 安装Git...${NC}"
sudo yum install -y git

# 4. 安装PM2
echo -e "${YELLOW}4. 安装PM2...${NC}"
sudo npm install -g pm2

# 5. 安装MongoDB
echo -e "${YELLOW}5. 安装MongoDB...${NC}"
# 创建MongoDB仓库
sudo tee /etc/yum.repos.d/mongodb-org-4.4.repo << EOF
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
EOF

# 安装MongoDB
sudo yum install -y mongodb-org-4.4.18 mongodb-org-server-4.4.18 mongodb-org-shell-4.4.18

# 6. 启动MongoDB服务
echo -e "${YELLOW}6. 启动MongoDB服务...${NC}"
sudo systemctl start mongod
sudo systemctl enable mongod

# 7. 创建项目目录
echo -e "${YELLOW}7. 创建项目目录...${NC}"
sudo mkdir -p /opt/rank-server
sudo chown -R $USER:$USER /opt/rank-server

# 8. 复制项目文件
echo -e "${YELLOW}8. 复制项目文件...${NC}"
cp -r . /opt/rank-server/

# 9. 安装项目依赖
echo -e "${YELLOW}9. 安装项目依赖...${NC}"
cd /opt/rank-server
npm install

# 10. 创建环境变量文件
echo -e "${YELLOW}10. 创建环境变量文件...${NC}"
cat > .env << EOF
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://localhost:27017/rank-server

# 日志级别
LOG_LEVEL=info
EOF

# 11. 启动服务器
echo -e "${YELLOW}11. 启动服务器...${NC}"
pm2 start src/app.js --name "rank-server"

# 12. 配置PM2开机自启
echo -e "${YELLOW}12. 配置PM2开机自启...${NC}"
pm2 startup
sudo env PATH=$PATH:/usr/bin /usr/lib/node_modules/pm2/bin/pm2 startup systemd -u $USER --hp /home/$USER
pm2 save

# 13. 初始化排行榜配置
echo -e "${YELLOW}13. 初始化排行榜配置...${NC}"
sleep 5 # 等待服务启动
curl -X POST http://localhost:3000/v2/rank/api/report/initconfig \
  -H "Content-Type: application/json" \
  -d '{"appid": "wxf67531bdf3d328af"}'

# 14. 显示部署结果
echo -e "${GREEN}部署完成！${NC}"
echo -e "${GREEN}排行榜服务器已成功部署在腾讯云上！${NC}"
echo -e "${YELLOW}服务状态：${NC}"
pm2 status

echo -e "${YELLOW}访问地址：${NC}"
echo -e "http://$(curl -s ifconfig.me):3000/v2/rank/api/report/"
echo -e "http://$(curl -s ifconfig.me):3000/health"

echo -e "${YELLOW}查看日志：${NC}"
echo -e "pm2 logs rank-server"

echo -e "${YELLOW}重启服务：${NC}"
echo -e "pm2 restart rank-server"

echo -e "${GREEN}部署脚本执行完成！${NC}"