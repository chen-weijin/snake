#!/bin/bash

# TencentOS Server专用MongoDB安装脚本
# 使用方法：bash install_mongodb_tencentos_special.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始在TencentOS Server上安装MongoDB...${NC}"

# 1. 清理现有MongoDB
echo -e "${YELLOW}1. 清理现有MongoDB...${NC}"

# 清理所有MongoDB相关包和文件
sudo yum remove -y mongodb* 2>/dev/null || true
sudo yum remove -y mongodb-org* 2>/dev/null || true
sudo yum autoremove -y
sudo yum clean all

# 删除MongoDB相关文件
sudo rm -rf /var/lib/mongodb
sudo rm -rf /var/log/mongodb
sudo rm -rf /etc/mongod.conf
sudo rm -rf /etc/mongodb*
sudo rm -rf /etc/yum.repos.d/mongodb*
sudo rm -rf /usr/bin/mongo*
sudo rm -rf /usr/lib/systemd/system/mongod.service

# 2. 添加TencentOS兼容的MongoDB源
echo -e "${YELLOW}2. 添加MongoDB源...${NC}"

# 使用CentOS 7的MongoDB源，TencentOS通常兼容
sudo tee /etc/yum.repos.d/mongodb-org-4.4.repo << EOF
[mongodb-org-4.4]
name=MongoDB Repository
baseurl=https://repo.mongodb.org/yum/redhat/7/mongodb-org/4.4/x86_64/
gpgcheck=1
enabled=1
gpgkey=https://www.mongodb.org/static/pgp/server-4.4.asc
EOF

# 3. 安装MongoDB
echo -e "${YELLOW}3. 安装MongoDB...${NC}"

# 安装特定版本的MongoDB，避免版本兼容性问题
sudo yum install -y mongodb-org-4.4.18 mongodb-org-server-4.4.18 mongodb-org-shell-4.4.18 mongodb-org-mongos-4.4.18 mongodb-org-tools-4.4.18

# 4. 验证安装
echo -e "${YELLOW}4. 验证安装...${NC}"

MONGOD_PATH=$(which mongod 2>/dev/null || echo "NOT_FOUND")
MONGO_PATH=$(which mongo 2>/dev/null || echo "NOT_FOUND")

if [ "$MONGOD_PATH" == "NOT_FOUND" ]; then
    echo -e "${RED}✗ MongoDB安装失败！${NC}"
    echo -e "${YELLOW}尝试手动安装...${NC}"
    
    # 手动下载并安装MongoDB
    cd /tmp
    wget https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.4.18.tgz
    tar -zxvf mongodb-linux-x86_64-rhel70-4.4.18.tgz
    sudo cp -r mongodb-linux-x86_64-rhel70-4.4.18/bin/* /usr/bin/
    
    # 再次检查
    MONGOD_PATH=$(which mongod 2>/dev/null || echo "NOT_FOUND")
    if [ "$MONGOD_PATH" == "NOT_FOUND" ]; then
        echo -e "${RED}✗ 手动安装也失败了，请检查网络或手动下载安装！${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ mongod路径: $MONGOD_PATH${NC}"
echo -e "${GREEN}✓ mongo路径: $MONGO_PATH${NC}"

# 5. 创建必要的目录和用户
echo -e "${YELLOW}5. 创建目录和用户...${NC}"

# 创建mongodb用户和组
sudo groupadd -r mongodb 2>/dev/null || true
sudo useradd -r -g mongodb -d /var/lib/mongodb -s /bin/bash mongodb 2>/dev/null || true

# 创建数据和日志目录
sudo mkdir -p /var/lib/mongodb
sudo mkdir -p /var/log/mongodb

# 设置权限
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chmod 755 /var/lib/mongodb
sudo chmod 755 /var/log/mongodb

# 6. 创建配置文件
echo -e "${YELLOW}6. 创建配置文件...${NC}"

sudo tee /etc/mongod.conf << EOF
# mongod.conf
storage:
  dbPath: /var/lib/mongodb
  journal:
    enabled: true
systemLog:
  destination: file
  logAppend: true
  path: /var/log/mongodb/mongod.log
net:
  port: 27017
  bindIp: 127.0.0.1
processManagement:
  fork: true
  pidFilePath: /var/run/mongodb/mongod.pid
EOF

# 创建PID目录
sudo mkdir -p /var/run/mongodb
sudo chown -R mongodb:mongodb /var/run/mongodb

# 7. 创建systemd服务文件
echo -e "${YELLOW}7. 创建systemd服务文件...${NC}"

sudo tee /etc/systemd/system/mongod.service << EOF
[Unit]
Description=MongoDB Database Server
Documentation=https://docs.mongodb.org/manual
After=network.target

[Service]
User=mongodb
Group=mongodb
ExecStart=$MONGOD_PATH --config /etc/mongod.conf
ExecStop=$MONGOD_PATH --config /etc/mongod.conf --shutdown
Restart=always
RestartSec=5
PIDFile=/var/run/mongodb/mongod.pid
LimitNOFILE=64000
LimitNPROC=64000
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
EOF

# 8. 启动MongoDB服务
echo -e "${YELLOW}8. 启动MongoDB服务...${NC}"

# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start mongod

# 设置开机自启
sudo systemctl enable mongod

# 等待服务启动
sleep 5

# 9. 验证安装
echo -e "${YELLOW}9. 验证MongoDB安装...${NC}"

if sudo systemctl status mongod | grep -q "active (running)"; then
    echo -e "${GREEN}✓ MongoDB服务已成功启动${NC}"
else
    echo -e "${YELLOW}服务状态:${NC}"
    sudo systemctl status mongod
    echo -e "${YELLOW}查看日志:${NC}"
    sudo cat /var/log/mongodb/mongod.log
    exit 1
fi

# 测试连接
if mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB连接测试成功${NC}"
else
    echo -e "${YELLOW}手动测试连接:${NC}"
    mongo --eval "db.adminCommand('ping')"
    exit 1
fi

echo -e "${GREEN}MongoDB在TencentOS Server上安装成功！${NC}"
echo -e "${YELLOW}常用命令:${NC}"
echo -e "${GREEN}启动:${NC} sudo systemctl start mongod"
echo -e "${GREEN}停止:${NC} sudo systemctl stop mongod"
echo -e "${GREEN}重启:${NC} sudo systemctl restart mongod"
echo -e "${GREEN}状态:${NC} sudo systemctl status mongod"
echo -e "${GREEN}进入:${NC} mongo"
echo -e "${GREEN}日志:${NC} sudo tail -f /var/log/mongodb/mongod.log"