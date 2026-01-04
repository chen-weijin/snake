#!/bin/bash

# 深度修复MongoDB启动问题脚本
# 使用方法：bash deep_fix_mongodb.sh

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}开始深度修复MongoDB启动问题...${NC}"

# 1. 检查MongoDB二进制文件
echo -e "${YELLOW}1. 检查MongoDB二进制文件...${NC}"

MONGOD_PATH=$(which mongod 2>/dev/null || echo "NOT_FOUND")
MONGO_PATH=$(which mongo 2>/dev/null || echo "NOT_FOUND")

if [ "$MONGOD_PATH" == "NOT_FOUND" ]; then
    echo -e "${RED}✗ mongod二进制文件不存在！${NC}"
    echo -e "${YELLOW}尝试重新安装MongoDB...${NC}"
    # 重新安装MongoDB
    sudo yum reinstall -y mongodb-org-mongod mongodb-org-shell
    # 再次检查
    MONGOD_PATH=$(which mongod 2>/dev/null || echo "NOT_FOUND")
    if [ "$MONGOD_PATH" == "NOT_FOUND" ]; then
        echo -e "${RED}✗ 重新安装失败，手动检查MongoDB安装！${NC}"
        exit 1
    fi
fi

echo -e "${GREEN}✓ mongod路径: $MONGOD_PATH${NC}"
echo -e "${GREEN}✓ mongo路径: $MONGO_PATH${NC}"

# 2. 检查二进制文件权限
echo -e "${YELLOW}2. 检查二进制文件权限...${NC}"
ls -la $MONGOD_PATH
sudo chmod +x $MONGOD_PATH
echo -e "${GREEN}✓ mongod执行权限已设置${NC}"

if [ "$MONGO_PATH" != "NOT_FOUND" ]; then
    sudo chmod +x $MONGO_PATH
    echo -e "${GREEN}✓ mongo执行权限已设置${NC}"
fi

# 3. 检查配置文件
echo -e "${YELLOW}3. 检查配置文件...${NC}"

if [ ! -f /etc/mongod.conf ]; then
    echo -e "${YELLOW}✗ 配置文件不存在，重新创建...${NC}"
    # 重新创建配置文件
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
  timeZoneInfo: /usr/share/zoneinfo
EOF
    echo -e "${GREEN}✓ 配置文件已重新创建${NC}"
else
    echo -e "${GREEN}✓ 配置文件存在${NC}"
    cat /etc/mongod.conf
fi

# 4. 检查数据和日志目录
echo -e "${YELLOW}4. 检查数据和日志目录...${NC}"

# 创建数据目录
sudo mkdir -p /var/lib/mongodb
sudo chown -R mongodb:mongodb /var/lib/mongodb
sudo chmod 755 /var/lib/mongodb

# 创建日志目录
sudo mkdir -p /var/log/mongodb
sudo chown -R mongodb:mongodb /var/log/mongodb
sudo chmod 755 /var/log/mongodb

echo -e "${GREEN}✓ 数据目录: /var/lib/mongodb${NC}"
ls -la /var/lib/mongodb
echo -e "${GREEN}✓ 日志目录: /var/log/mongodb${NC}"
ls -la /var/log/mongodb

# 5. 检查mongodb用户
echo -e "${YELLOW}5. 检查mongodb用户...${NC}"

if id -u mongodb > /dev/null 2>&1; then
    echo -e "${GREEN}✓ mongodb用户已存在${NC}"
    id mongodb
else
    echo -e "${YELLOW}✗ mongodb用户不存在，创建中...${NC}"
    sudo groupadd -r mongodb
    sudo useradd -r -g mongodb -d /var/lib/mongodb -s /bin/bash mongodb
    echo -e "${GREEN}✓ mongodb用户创建成功${NC}"
    id mongodb
fi

# 6. 检查SELinux状态（如果启用）
echo -e "${YELLOW}6. 检查SELinux状态...${NC}"

if command -v sestatus > /dev/null 2>&1; then
    SELINUX_STATUS=$(sestatus | grep "SELinux status" | awk '{print $3}')
    echo -e "SELinux状态: $SELINUX_STATUS"
    
    if [ "$SELINUX_STATUS" == "enabled" ]; then
        echo -e "${YELLOW}SELinux已启用，检查上下文...${NC}"
        # 检查数据目录SELinux上下文
        DATA_CONTEXT=$(ls -Z /var/lib/mongodb | head -1 | awk '{print $1}')
        echo -e "数据目录上下文: $DATA_CONTEXT"
        
        # 检查日志目录SELinux上下文
        LOG_CONTEXT=$(ls -Z /var/log/mongodb | head -1 | awk '{print $1}')
        echo -e "日志目录上下文: $LOG_CONTEXT"
        
        # 设置正确的上下文
        sudo semanage fcontext -a -t mongod_var_lib_t '/var/lib/mongodb(/.*)?'
        sudo semanage fcontext -a -t mongod_log_t '/var/log/mongodb(/.*)?'
        sudo restorecon -Rv /var/lib/mongodb
        sudo restorecon -Rv /var/log/mongodb
        echo -e "${GREEN}✓ SELinux上下文已修复${NC}"
    fi
fi

# 7. 检查端口占用
echo -e "${YELLOW}7. 检查端口占用...${NC}"
PORT_STATUS=$(netstat -tuln | grep 27017 || echo "端口未占用")
echo -e "端口27017状态: $PORT_STATUS"

# 如果端口被占用，尝试杀死占用进程
if netstat -tuln | grep 27017 > /dev/null 2>&1; then
    echo -e "${YELLOW}端口27017被占用，尝试释放...${NC}"
    PID=$(lsof -i :27017 | grep LISTEN | awk '{print $2}')
    if [ -n "$PID" ]; then
        sudo kill -9 $PID
        echo -e "${GREEN}✓ 已杀死占用端口的进程 PID: $PID${NC}"
    fi
fi

# 8. 手动测试mongod启动
echo -e "${YELLOW}8. 手动测试mongod启动...${NC}"

# 先停止可能运行的服务
sudo systemctl stop mongod
sudo systemctl reset-failed mongod

# 手动启动mongod测试
echo -e "${YELLOW}手动运行mongod测试（5秒后停止）...${NC}"
sudo -u mongodb $MONGOD_PATH --config /etc/mongod.conf --fork
sleep 5

# 检查是否启动成功
if ps aux | grep mongod | grep -v grep > /dev/null 2>&1; then
    echo -e "${GREEN}✓ 手动启动成功！${NC}"
    # 停止手动启动的进程
    sudo -u mongodb $MONGOD_PATH --config /etc/mongod.conf --shutdown
    echo -e "${GREEN}✓ 已停止手动测试进程${NC}"
else
    echo -e "${RED}✗ 手动启动失败！${NC}"
    echo -e "${YELLOW}查看日志:${NC}"
    sudo cat /var/log/mongodb/mongod.log
    exit 1
fi

# 9. 修复systemd服务文件
echo -e "${YELLOW}9. 修复systemd服务文件...${NC}"

sudo tee /etc/systemd/system/mongod.service << EOF
[Unit]
Description=MongoDB Database Server
Documentation=https://docs.mongodb.org/manual
After=network.target

[Service]
User=mongodb
Group=mongodb
ExecStart=$MONGOD_PATH --quiet --config /etc/mongod.conf
Restart=always
RestartSec=5
LimitNOFILE=64000
LimitNPROC=64000
LimitMEMLOCK=infinity

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✓ systemd服务文件已更新${NC}"

# 10. 重新启动MongoDB服务
echo -e "${YELLOW}10. 重新启动MongoDB服务...${NC}"

# 重新加载systemd配置
sudo systemctl daemon-reload

# 启动服务
sudo systemctl start mongod

# 等待服务启动
sleep 10

# 检查服务状态
if sudo systemctl status mongod | grep -q "active (running)"; then
    echo -e "${GREEN}✓ MongoDB服务已成功启动${NC}"
    # 设置开机自启
    sudo systemctl enable mongod
    echo -e "${GREEN}✓ MongoDB服务已设置为开机自启${NC}"
else
    echo -e "${RED}✗ MongoDB服务启动失败${NC}"
    echo -e "${YELLOW}查看详细日志:${NC}"
    sudo journalctl -xeu mongod.service
    echo -e "${YELLOW}查看MongoDB日志:${NC}"
    sudo tail -n 50 /var/log/mongodb/mongod.log
    exit 1
fi

# 11. 验证MongoDB连接
echo -e "${YELLOW}11. 验证MongoDB连接...${NC}"

if mongo --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MongoDB连接测试成功${NC}"
    echo -e "${GREEN}MongoDB修复完成！${NC}"
else
    echo -e "${RED}✗ MongoDB连接测试失败${NC}"
    echo -e "${YELLOW}手动测试:${NC} mongo --eval \"db.adminCommand('ping')\""
    exit 1
fi