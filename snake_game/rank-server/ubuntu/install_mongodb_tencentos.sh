#!/bin/bash

# 一键部署MongoDB脚本
# 支持Ubuntu 20.04+、CentOS 7+ 和 TencentOS Server
# 使用方法：bash install_mongodb_tencentos.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始部署MongoDB...${NC}"

# 1. 检测Linux发行版
echo -e "${YELLOW}1. 检测Linux发行版...${NC}"

if [ -f /etc/os-release ]; then
    # 读取发行版信息
    . /etc/os-release
    OS=$NAME
    VERSION=$VERSION_ID
else
    echo -e "${RED}无法检测Linux发行版${NC}"
    exit 1
fi

echo -e "${GREEN}检测到系统: $OS $VERSION${NC}"

# 2. 清理现有MongoDB
echo -e "${YELLOW}2. 清理现有MongoDB...${NC}"

# 检查是否为TencentOS Server
IS_TENCENTOS=false
if [[ "$OS" == *"TencentOS"* ]]; then
    IS_TENCENTOS=true
    echo -e "${GREEN}识别到TencentOS Server，使用yum安装方式${NC}"
fi

if [[ "$OS" == *"Ubuntu"* || "$OS" == *"Debian"* ]]; then
    # Ubuntu/Debian清理
    sudo apt purge -y mongodb-org* 2>/dev/null || true
    sudo apt remove -y mongodb* 2>/dev/null || true
    sudo apt autoremove -y
    sudo apt autoclean -y
elif [[ "$OS" == *"CentOS"* || "$OS" == *"Red Hat"* || "$OS" == *"Amazon Linux"* || "$IS_TENCENTOS" == true ]]; then
    # CentOS/RedHat/TencentOS清理
    sudo yum remove -y mongodb-org* 2>/dev/null || true
    sudo yum remove -y mongodb* 2>/dev/null || true
    sudo yum autoremove -y
fi

# 删除数据和日志目录
sudo rm -rf /var/lib/mongodb 2>/dev/null || true
sudo rm -rf /var/log/mongodb 2>/dev/null || true
sudo rm -rf /etc/mongod.conf 2>/dev/null || true
sudo rm -rf /etc/mongodb.conf 2>/dev/null || true

# 3. 安装MongoDB
echo -e "${YELLOW}3. 安装MongoDB...${NC}"

if [[ "$OS" == *"Ubuntu"* || "$OS" == *"Debian"* ]]; then
    # Ubuntu/Debian安装
    echo -e "${GREEN}使用Ubuntu/Debian安装方式${NC}"
    
    # 添加MongoDB官方仓库
    wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
    echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
    
    # 更新包列表
    sudo apt update
    
    # 安装MongoDB
    sudo apt install -y mongodb-org
    
elif [[ "$OS" == *"CentOS"* || "$OS" == *"Red Hat"* || "$OS" == *"Amazon Linux"* || "$IS_TENCENTOS" == true ]]; then
    # CentOS/RedHat/TencentOS安装
    echo -e "${GREEN}使用TencentOS/CentOS安装方式${NC}"
    
    # 创建MongoDB仓库文件
    sudo tee /etc/yum.repos.d/mongodb-org-5.0.repo << EOF
[mongodb-org-5.0]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/5.0/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-5.0.asc
EOF
    
    # 安装MongoDB
    sudo yum install -y mongodb-org
    
else
    echo -e "${RED}不支持的操作系统: $OS${NC}"
    exit 1
fi

# 4. 创建必要的目录
echo -e "${YELLOW}4. 创建必要的目录...${NC}"
sudo mkdir -p /var/lib/mongodb
sudo mkdir -p /var/log/mongodb

# 5. 设置目录权限
echo -e "${YELLOW}5. 设置目录权限...${NC}"
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chmod 755 /var/lib/mongodb
sudo chmod 755 /var/log/mongodb

# 6. 创建MongoDB配置文件
echo -e "${YELLOW}6. 创建MongoDB配置文件...${NC}"

sudo tee /etc/mongod.conf << EOF
# mongod.conf

# for documentation of all options, see:
#   http://docs.mongodb.org/manual/reference/configuration-options/

# Where and how to store data.
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
#  engine:
#  wiredTiger:

# where to write logging data.
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log

# network interfaces
net:
  port: 27017
  bindIp: 127.0.0.1  # Listen to local interface only, comment to listen on all interfaces.

# how the process runs
processManagement:
  timeZoneInfo: /usr/share/zoneinfo

#security:

#operationProfiling:

#replication:

#sharding:

## Enterprise-Only Options:

#auditLog:

#snmp:
EOF

# 7. 创建或更新systemd服务文件
echo -e "${YELLOW}7. 配置systemd服务...${NC}"

sudo tee /etc/systemd/system/mongod.service << EOF
[Unit]
Description=MongoDB Database Server
Documentation=https://docs.mongodb.org/manual
After=network.target

[Service]
User=mongodb
Group=mongodb
ExecStart=/usr/bin/mongod --quiet --config /etc/mongod.conf
Restart=always

[Install]
WantedBy=multi-user.target
EOF

# 8. 启动MongoDB服务
echo -e "${YELLOW}8. 启动MongoDB服务...${NC}"

# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动MongoDB
sudo systemctl start mongod

# 设置开机自启
sudo systemctl enable mongod

# 9. 验证MongoDB安装
echo -e "${YELLOW}9. 验证MongoDB安装...${NC}"

# 等待服务启动
sleep 5

# 检查服务状态
if sudo systemctl status mongod | grep -q "active (running)"; then
    echo -e "${GREEN}✓ MongoDB服务已成功启动${NC}"
else
    echo -e "${RED}✗ MongoDB服务启动失败${NC}"
    sudo systemctl status mongod
    exit 1
fi

# 检查MongoDB版本
if command -v mongo > /dev/null 2>&1; then
    MONGO_VERSION=$(mongo --version | head -1)
    echo -e "${GREEN}✓ MongoDB客户端版本: $MONGO_VERSION${NC}"
else
    echo -e "${RED}✗ MongoDB客户端未安装成功${NC}"
    exit 1
fi

if command -v mongod > /dev/null 2>&1; then
    MONGOD_VERSION=$(mongod --version | head -1)
    echo -e "${GREEN}✓ MongoDB服务端版本: $MONGOD_VERSION${NC}"
else
    echo -e "${RED}✗ MongoDB服务端未安装成功${NC}"
    exit 1
fi

# 测试连接
echo -e "${YELLOW}10. 测试MongoDB连接...${NC}"

if mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB连接测试成功${NC}"
else
    echo -e "${RED}✗ MongoDB连接测试失败${NC}"
    exit 1
fi

# 11. 显示部署结果
echo -e "${GREEN}MongoDB部署完成！${NC}"
echo -e "${YELLOW}服务状态:${NC}"
sudo systemctl status mongod --no-pager
echo -e ""
echo -e "${YELLOW}常用命令:${NC}"
echo -e "${GREEN}启动MongoDB:${NC} sudo systemctl start mongod"
echo -e "${GREEN}停止MongoDB:${NC} sudo systemctl stop mongod"
echo -e "${GREEN}重启MongoDB:${NC} sudo systemctl restart mongod"
echo -e "${GREEN}查看状态:${NC} sudo systemctl status mongod"
echo -e "${GREEN}进入MongoDB:${NC} mongo"
echo -e "${GREEN}查看日志:${NC} sudo tail -f /var/log/mongodb/mongod.log"
echo -e ""
echo -e "${GREEN}MongoDB已成功部署并运行在端口27017上！${NC}"