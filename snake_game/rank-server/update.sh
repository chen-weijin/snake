#!/bin/bash

# 腾讯云排行榜服务器更新部署脚本
# 使用方法：bash update.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始更新腾讯云排行榜服务器...${NC}"

# 检查是否提供了服务器IP
if [ -z "$1" ]; then
    echo -e "${RED}错误：请提供服务器IP地址${NC}"
    echo -e "${YELLOW}使用方法：bash update.sh <服务器IP> [SSH密钥路径]${NC}"
    echo -e "${YELLOW}示例：bash update.sh 43.139.6.101 ~/.ssh/rank-server-key.pem${NC}"
    exit 1
fi

SERVER_IP=$1
SSH_KEY=${2:-""}

# 构建SSH命令
if [ -n "$SSH_KEY" ]; then
    SSH_CMD="ssh -i $SSH_KEY ubuntu@$SERVER_IP"
    SCP_CMD="scp -i $SSH_KEY"
else
    SSH_CMD="ssh ubuntu@$SERVER_IP"
    SCP_CMD="scp"
fi

echo -e "${YELLOW}服务器IP: $SERVER_IP${NC}"
echo -e "${YELLOW}开始上传文件...${NC}"

# 1. 上传修改后的文件
echo -e "${YELLOW}1. 上传修改后的文件...${NC}"

# 上传 src 目录
$SCP_CMD -r src ubuntu@$SERVER_IP:/opt/rank-server/

# 上传 public 目录
$SCP_CMD -r public ubuntu@$SERVER_IP:/opt/rank-server/

# 上传 package.json
$SCP_CMD package.json ubuntu@$SERVER_IP:/opt/rank-server/

echo -e "${GREEN}文件上传完成${NC}"

# 2. 在服务器上执行更新操作
echo -e "${YELLOW}2. 在服务器上执行更新操作...${NC}"

$SSH_CMD << 'ENDSSH'
cd /opt/rank-server

# 安装新的依赖
echo "安装新的依赖..."
npm install

# 重启服务
echo "重启排行榜服务器..."
pm2 restart rank-server

# 等待服务启动
sleep 3

# 检查服务状态
echo "检查服务状态..."
pm2 status

echo "更新完成！"
ENDSSH

echo -e "${GREEN}更新部署完成！${NC}"
echo -e "${YELLOW}查看日志：${NC}"
echo -e "$SSH_CMD 'pm2 logs rank-server --lines 50'"

echo -e "${YELLOW}验证服务：${NC}"
echo -e "curl http://$SERVER_IP:3000/health"

echo -e "${GREEN}更新脚本执行完成！${NC}"
