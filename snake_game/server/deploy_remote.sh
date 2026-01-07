#!/bin/bash

# 新服务器远程部署脚本
# 使用方法：在本地执行 bash deploy_remote.sh

# 服务器信息
SERVER_IP="106.53.198.49"
SERVER_USER="root"
KEY_FILE="C:\\amufen.pem"

# 本地项目目录
LOCAL_DIR="."

# 远程项目目录
REMOTE_DIR="/root/server"

echo "开始远程部署新服务器..."

# 1. 检查本地项目文件
echo "1. 检查本地项目文件..."
if [ ! -f "app.js" ]; then
    echo "错误：找不到 app.js 文件，请确保在正确的目录执行此脚本"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "错误：找不到 package.json 文件，请确保在正确的目录执行此脚本"
    exit 1
fi

# 2. 连接远程服务器并执行部署
echo "2. 连接远程服务器并执行部署..."

# 使用 SSH 执行远程命令
ssh -i "$KEY_FILE" "$SERVER_USER@$SERVER_IP" << 'EOF'
    # 颜色定义
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m' # No Color

    echo -e "${GREEN}开始部署新服务器...${NC}"

    # 1. 停止并删除旧服务
    echo -e "${YELLOW}1. 停止并删除旧服务...${NC}"
    pm2 stop rank-server 2>/dev/null || true
    pm2 delete rank-server 2>/dev/null || true
    pm2 stop server 2>/dev/null || true
    pm2 delete server 2>/dev/null || true

    # 2. 删除旧目录
    echo -e "${YELLOW}2. 删除旧目录...${NC}"
    rm -rf /root/rank-server 2>/dev/null || true
    rm -rf /root/server 2>/dev/null || true

    # 3. 创建新目录
    echo -e "${YELLOW}3. 创建新目录...${NC}"
    mkdir -p /root/server

    echo -e "${GREEN}远程准备工作完成，等待文件传输...${NC}"
EOF

# 3. 上传项目文件
echo "3. 上传项目文件..."
scp -i "$KEY_FILE" -r "$LOCAL_DIR"/* "$SERVER_USER@$SERVER_IP:$REMOTE_DIR/"

# 4. 再次连接远程服务器并完成部署
echo "4. 完成远程部署..."

ssh -i "$KEY_FILE" "$SERVER_USER@$SERVER_IP" << 'EOF'
    # 颜色定义
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    NC='\033[0m' # No Color

    # 4. 安装依赖
    echo -e "${YELLOW}4. 安装依赖...${NC}"
    cd /root/server
    npm install

    # 5. 创建环境变量文件
    echo -e "${YELLOW}5. 创建环境变量文件...${NC}"
    cat > .env << EOFENV
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://43.139.6.101:27017/rank-server

# 日志级别
LOG_LEVEL=info
EOFENV

    # 6. 安装 PM2
    echo -e "${YELLOW}6. 安装 PM2...${NC}"
    npm install -g pm2

    # 7. 启动新服务
    echo -e "${YELLOW}7. 启动新服务...${NC}"
    pm2 start app.js --name "server"

    # 8. 配置 PM2 开机自启
    echo -e "${YELLOW}8. 配置 PM2 开机自启...${NC}"
    pm2 startup
    pm2 save

    # 9. 初始化排行榜配置
    echo -e "${YELLOW}9. 初始化排行榜配置...${NC}"
    sleep 5
    curl -X POST http://localhost:3000/v2/rank/api/initconfig \
      -H "Content-Type: application/json" \
      -d '{"appid": "wxf67531bdf3d328af"}'

    # 10. 显示部署结果
    echo -e "${GREEN}部署完成！${NC}"
    echo -e "${GREEN}新服务器已成功部署到 106.53.198.49！${NC}"
    echo -e "${YELLOW}服务状态：${NC}"
    pm2 status

    echo -e "${YELLOW}访问地址：${NC}"
    echo -e "http://106.53.198.49:3000/health"
    echo -e "http://106.53.198.49:3000/v2/rank/api/"
    echo -e "http://106.53.198.49:3000/v2/userdata/"

    echo -e "${YELLOW}查看日志：${NC}"
    echo -e "pm2 logs server"

    echo -e "${YELLOW}重启服务：${NC}"
    echo -e "pm2 restart server"

    echo -e "${GREEN}远程部署脚本执行完成！${NC}"
EOF

echo "部署完成！新服务器已成功部署到 106.53.198.49"
echo "您可以通过以下地址访问："
echo "http://106.53.198.49:3000/health"
echo "http://106.53.198.49:3000/v2/rank/api/"
echo "http://106.53.198.49:3000/v2/userdata/"