#!/bin/bash

# 修复MongoDB用户问题脚本
# 使用方法：bash fix_mongodb_user.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始修复MongoDB用户问题...${NC}"

# 1. 检查mongodb用户是否存在
echo -e "${YELLOW}1. 检查mongodb用户是否存在...${NC}"

if id -u mongodb > /dev/null 2>&1; then
    echo -e "${GREEN}✓ mongodb用户已存在${NC}"
else
    echo -e "${YELLOW}✗ mongodb用户不存在，创建中...${NC}"
    # 创建mongodb用户和组
    sudo groupadd -r mongodb
    sudo useradd -r -g mongodb -d /var/lib/mongodb -s /bin/false mongodb
    echo -e "${GREEN}✓ mongodb用户创建成功${NC}"
fi

# 2. 检查数据和日志目录权限
echo -e "${YELLOW}2. 检查数据和日志目录权限...${NC}"

# 创建目录（如果不存在）
sudo mkdir -p /var/lib/mongodb
sudo mkdir -p /var/log/mongodb

# 设置正确的权限
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chmod 755 /var/lib/mongodb
sudo chmod 755 /var/log/mongodb

echo -e "${GREEN}✓ 目录权限设置完成${NC}"

# 3. 检查MongoDB二进制文件权限
echo -e "${YELLOW}3. 检查MongoDB二进制文件权限...${NC}"

if [ -f /usr/bin/mongod ]; then
    sudo chmod +x /usr/bin/mongod
    echo -e "${GREEN}✓ /usr/bin/mongod 权限设置完成${NC}"
fi

if [ -f /usr/bin/mongo ]; then
    sudo chmod +x /usr/bin/mongo
    echo -e "${GREEN}✓ /usr/bin/mongo 权限设置完成${NC}"
fi

# 4. 重新启动MongoDB服务
echo -e "${YELLOW}4. 重新启动MongoDB服务...${NC}"

# 重新加载systemd配置
sudo systemctl daemon-reload

# 停止服务（如果正在运行）
sudo systemctl stop mongod

# 清除失败状态
sudo systemctl reset-failed mongod

# 启动服务
sudo systemctl start mongod

# 等待服务启动
sleep 5

# 检查服务状态
if sudo systemctl status mongod | grep -q "active (running)"; then
    echo -e "${GREEN}✓ MongoDB服务已成功启动${NC}"
    # 设置开机自启
    sudo systemctl enable mongod
    echo -e "${GREEN}✓ MongoDB服务已设置为开机自启${NC}"
else
    echo -e "${RED}✗ MongoDB服务启动失败${NC}"
    echo -e "${YELLOW}查看详细日志：${NC} sudo journalctl -xeu mongod.service"
    exit 1
fi

# 5. 验证MongoDB连接
echo -e "${YELLOW}5. 验证MongoDB连接...${NC}"

if mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB连接测试成功${NC}"
else
    echo -e "${RED}✗ MongoDB连接测试失败${NC}"
    echo -e "${YELLOW}手动测试：${NC} mongo --eval \"db.adminCommand('ping')\""
    exit 1
fi

echo -e "${GREEN}MongoDB用户问题修复完成！${NC}"