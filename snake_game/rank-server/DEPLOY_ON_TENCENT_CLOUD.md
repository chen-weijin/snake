# 腾讯云部署排行榜服务器详细指南

## 一、准备工作

### 1. 腾讯云账号
- 注册并登录腾讯云控制台：https://console.cloud.tencent.com/
- 完成实名认证

### 2. 配置本地环境
- 安装 SSH 客户端（如 PuTTY、Windows Terminal 或 macOS Terminal）
- 准备一个可用的域名（可选）

## 二、创建腾讯云 CVM 实例

### 1. 登录腾讯云控制台
- 访问 https://console.cloud.tencent.com/
- 点击顶部导航栏的「云产品」
- 选择「计算」-「云服务器 CVM」

### 2. 新建 CVM 实例

#### 2.1 选择地域和可用区
- **地域**：建议选择靠近目标用户的地域，如「华南地区（广州）」
- **可用区**：选择默认可用区即可

#### 2.2 选择实例规格
- 点击「实例规格」下的「自定义配置」
- **实例系列**：选择「标准型 S5」或「SA2」
- **实例规格**：建议选择至少 2核4G 配置，如「S5.MEDIUM4」（2核4G）
- 点击「下一步：镜像」

#### 2.3 选择镜像
- **镜像类型**：选择「公共镜像」
- **系统镜像**：选择「Ubuntu 20.04 LTS 64位」
- 点击「下一步：存储和网络」

#### 2.4 配置存储和网络

**存储配置**：
- **系统盘**：选择「SSD云硬盘」，大小设置为 50GB
- 暂时不添加数据盘

**网络配置**：
- **网络**：选择默认 VPC
- **子网**：选择默认子网
- **公网IP**：选择「分配公网IP」
- **带宽计费模式**：选择「按使用流量」
- **带宽上限**：设置为 10Mbps（可根据实际需求调整）

点击「下一步：安全组和密钥」

#### 2.5 配置安全组
- 选择「新建安全组」
- 安全组名称：输入「rank-server-sg」
- 描述：输入「排行榜服务器安全组」
- **入站规则**：
  - 点击「添加规则」
  - 端口：22，协议：TCP，来源：0.0.0.0/0（SSH访问）
  - 端口：3000，协议：TCP，来源：0.0.0.0/0（应用访问）
  - 端口：27017，协议：TCP，来源：127.0.0.1/32（MongoDB本地访问）

**登录方式**：
- 选择「密钥登录」
- 点击「新建密钥对」
- 密钥对名称：输入「rank-server-key」
- 点击「确定」下载私钥文件（请妥善保存，后续登录需要）

点击「下一步：系统配置」

#### 2.6 系统配置
- **实例名称**：输入「rank-server」
- **登录密码**：可留空（使用密钥登录）
- **确认密码**：可留空
- **项目**：选择默认项目
- **标签**：可根据需要添加

点击「下一步：分组设置」

#### 2.7 分组设置
- 可根据需要添加到项目组

点击「下一步：确认配置」

#### 2.8 确认配置
- 检查所有配置是否正确
- 选择购买数量：1台
- 购买时长：根据实际需求选择
- 点击「立即购买」
- 完成支付

### 3. 查看 CVM 实例
- 支付成功后，返回 CVM 控制台
- 等待实例创建完成（约1-2分钟）
- 记录实例的「公网IP」，后续登录需要

## 三、连接 CVM 实例

### 1. 使用 SSH 连接（Linux/macOS）

1. 打开终端
2. 设置私钥文件权限：
   ```bash
   chmod 400 /path/to/rank-server-key.pem
   ```
3. 连接到服务器：
   ```bash
   ssh -i /path/to/rank-server-key.pem ubuntu@您的公网IP
   ```

### 2. 使用 PuTTY 连接（Windows）

1. 下载并安装 PuTTY：https://www.putty.org/
2. 下载 PuTTYgen：用于转换私钥格式
3. 使用 PuTTYgen 将 .pem 文件转换为 .ppk 文件
4. 打开 PuTTY
5. 在「Session」中输入：
   - Host Name：ubuntu@您的公网IP
   - Port：22
   - Connection type：SSH
6. 在「Connection」-「SSH」-「Auth」中选择转换后的 .ppk 文件
7. 点击「Open」连接

### 3. 首次登录
- 登录成功后，会看到 Ubuntu 欢迎信息
- 运行以下命令更新系统：
  ```bash
  sudo apt update && sudo apt upgrade -y
  ```

## 四、部署排行榜服务器

### 1. 上传部署脚本

使用 SCP 命令上传部署脚本和项目文件：

```bash
# 从本地复制到服务器
scp -i /path/to/rank-server-key.pem -r /local/path/to/rank-server/* ubuntu@您的公网IP:/home/ubuntu/
```

### 2. 运行部署脚本

```bash
# 进入项目目录
cd /home/ubuntu/

# 给部署脚本添加执行权限
chmod +x deploy.sh

# 运行部署脚本
bash deploy.sh
```

### 3. 部署脚本执行过程

部署脚本会自动完成以下操作：
1. 更新系统
2. 安装 Node.js 16
3. 安装 MongoDB 5.0
4. 启动并配置 MongoDB 自启
5. 安装 Git
6. 安装 PM2 进程管理器
7. 创建项目目录
8. 复制项目文件
9. 安装项目依赖
10. 创建环境变量文件
11. 启动排行榜服务器
12. 配置 PM2 开机自启
13. 初始化排行榜配置

### 4. 验证部署结果

部署完成后，脚本会显示：
- 服务状态
- 访问地址
- 查看日志和重启服务的命令

## 五、手动部署步骤（可选）

如果您希望手动部署，可以按照以下步骤执行：

### 1. 更新系统
```bash
sudo apt update && sudo apt upgrade -y
```

### 2. 安装 Node.js
```bash
curl -fsSL https://deb.nodesource.com/setup_16.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 3. 安装 MongoDB
```bash
wget -qO - https://www.mongodb.org/static/pgp/server-5.0.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/5.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-5.0.list
sudo apt update
sudo apt install -y mongodb-org
```

### 4. 启动 MongoDB
```bash
sudo systemctl start mongod
sudo systemctl enable mongod
```

### 5. 安装 PM2
```bash
sudo npm install -g pm2
```

### 6. 安装项目依赖
```bash
cd /home/ubuntu/rank-server
sudo npm install
```

### 7. 创建环境变量
```bash
cat > .env << EOF
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rank-server
LOG_LEVEL=info
EOF
```

### 8. 启动服务
```bash
pm2 start src/app.js --name "rank-server"
pm2 startup
pm2 save
```

### 9. 初始化排行榜配置
```bash
curl -X POST http://localhost:3000/v2/rank/api/report/initconfig \
  -H "Content-Type: application/json" \
  -d '{"appid": "wxf67531bdf3d328af"}'
```

## 六、验证服务

### 1. 健康检查
```bash
curl http://您的公网IP:3000/health
```

预期返回：
```json
{"status":"ok","message":"Server is running"}
```

### 2. 获取排行榜配置
```bash
curl http://您的公网IP:3000/v2/rank/api/report/rankconfig?appid=wxf67531bdf3d328af
```

预期返回：
```json
[
  {
    "_id":"658f1234567890abcdef1234",
    "appid":"wxf67531bdf3d328af",
    "rankid":"rank_total",
    "name":"总排行榜",
    "order":"desc",
    "min_score":0,
    "max_count":100,
    "created_at":"2025-12-29T08:00:00.000Z",
    "updated_at":"2025-12-29T08:00:00.000Z"
  },
  {
    "_id":"658f1234567890abcdef5678",
    "appid":"wxf67531bdf3d328af",
    "rankid":"rank_day",
    "name":"日排行榜",
    "order":"desc",
    "min_score":0,
    "max_count":100,
    "created_at":"2025-12-29T08:00:00.000Z",
    "updated_at":"2025-12-29T08:00:00.000Z"
  }
]
```

## 七、配置域名（可选）

### 1. 购买域名

- 登录腾讯云控制台
- 点击「云产品」-「域名与网站」-「域名注册」
- 搜索并购买一个合适的域名

### 2. 域名解析

- 登录腾讯云控制台
- 点击「云产品」-「域名与网站」-「云解析 DNS」
- 选择您购买的域名，点击「解析」
- 点击「添加记录」
  - **记录类型**：A
  - **主机记录**：@（或 www，根据需求选择）
  - **记录值**：输入您的 CVM 公网 IP
  - **TTL**：600
  - 点击「保存」

### 3. 配置 Nginx 反向代理（可选）

#### 3.1 安装 Nginx
```bash
sudo apt install -y nginx
```

#### 3.2 创建 Nginx 配置文件
```bash
sudo nano /etc/nginx/conf.d/rank-server.conf
```

#### 3.3 配置反向代理
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### 3.4 启动 Nginx
```bash
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 4. 配置 HTTPS（可选）

#### 4.1 安装 Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 4.2 申请 SSL 证书
```bash
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

#### 4.3 验证 HTTPS 配置
```bash
curl https://your-domain.com/health
```

## 八、客户端配置

在游戏客户端中更新排行榜服务器 URL：

1. 打开游戏项目
2. 找到配置文件（通常是 `SdkConfig.ts` 或类似文件）
3. 更新 `rankRemoteURL` 配置：

```typescript
// 原始配置
// static rankRemoteURL = "https://api.sm0.fun/v2/rank/api/report/";

// 新配置（使用公网 IP）
static rankRemoteURL = "http://您的公网IP:3000/v2/rank/api/report/";

// 或使用域名（推荐）
static rankRemoteURL = "http://your-domain.com/v2/rank/api/report/";
```

## 九、监控与维护

### 1. 查看服务状态
```bash
# 查看 PM2 状态
pm2 status

# 查看排行榜服务器日志
pm2 logs rank-server

# 实时查看日志
pm2 logs rank-server --follow
```

### 2. 服务管理
```bash
# 重启服务
pm2 restart rank-server

# 停止服务
pm2 stop rank-server

# 启动服务
pm2 start rank-server

# 删除服务
pm2 delete rank-server
```

### 3. MongoDB 管理
```bash
# 查看 MongoDB 状态
sudo systemctl status mongod

# 重启 MongoDB
sudo systemctl restart mongod

# 进入 MongoDB 命令行
mongo

# 备份数据库
mongodump --db rank-server --out /path/to/backup/$(date +%Y%m%d)

# 恢复数据库
mongorestore --db rank-server /path/to/backup/20251229/rank-server
```

### 4. 系统监控
```bash
# 查看系统资源使用情况
top

# 查看磁盘使用情况
df -h

# 查看内存使用情况
free -h
```

## 十、安全配置

### 1. 配置 MongoDB 认证

#### 1.1 创建管理员用户
```bash
# 进入 MongoDB
mongo

# 切换到 admin 数据库
use admin

# 创建管理员用户
db.createUser({
  user: "admin",
  pwd: "您的密码",
  roles: [{ role: "root", db: "admin" }]
})

# 退出 MongoDB
quit()
```

#### 1.2 启用认证
```bash
# 编辑 MongoDB 配置文件
sudo nano /etc/mongod.conf

# 在 security 部分添加以下内容
security:
  authorization: enabled

# 重启 MongoDB
sudo systemctl restart mongod
```

#### 1.3 更新连接字符串
```bash
# 编辑环境变量文件
nano /opt/rank-server/.env

# 更新 MongoDB 连接字符串
MONGODB_URI=mongodb://admin:您的密码@localhost:27017/rank-server?authSource=admin

# 重启服务
pm2 restart rank-server
```

### 2. 配置防火墙

```bash
# 查看 UFW 状态
sudo ufw status

# 启用 UFW
sudo ufw enable

# 开放必要端口
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw allow 3000/tcp # 应用端口

# 查看 UFW 规则
sudo ufw status numbered
```

## 十一、常见问题排查

### 1. 服务无法启动

**问题现象**：`pm2 status` 显示服务状态为 `errored`

**解决方案**：
```bash
# 查看详细日志
pm2 logs rank-server --lines 100

# 检查 MongoDB 连接
sudo systemctl status mongod

# 检查端口占用情况
netstat -tuln | grep 3000

# 检查 Node.js 版本
node -v
```

### 2. API 无法访问

**问题现象**：客户端无法访问排行榜 API

**解决方案**：
```bash
# 检查安全组配置
# 登录腾讯云控制台，查看 CVM 实例的安全组规则，确保 3000 端口已开放

# 检查防火墙配置
sudo ufw status

# 检查服务是否正在运行
pm2 status

# 本地测试 API
curl http://localhost:3000/health
```

### 3. 数据库连接失败

**问题现象**：日志显示 `MongoDB connection error`

**解决方案**：
```bash
# 检查 MongoDB 服务状态
sudo systemctl status mongod

# 检查 MongoDB 日志
sudo cat /var/log/mongodb/mongod.log

# 检查连接字符串是否正确
cat /opt/rank-server/.env | grep MONGODB_URI
```

### 4. 端口被占用

**问题现象**：启动服务时显示 `Error: listen EADDRINUSE: address already in use :::3000`

**解决方案**：
```bash
# 查找占用 3000 端口的进程
lsof -i :3000

# 终止占用端口的进程
kill -9 <PID>

# 重启服务
pm2 restart rank-server
```

## 十二、性能优化

### 1. 使用腾讯云 MongoDB Atlas
- 考虑使用腾讯云提供的 MongoDB Atlas 服务，替代本地 MongoDB
- 提供更高的可靠性、可扩展性和安全性
- 支持自动备份和监控

### 2. 配置 CDN
- 对于静态资源，使用腾讯云 CDN 加速
- 减少服务器负载，提高访问速度

### 3. 使用负载均衡
- 当用户量增加时，考虑使用腾讯云负载均衡服务
- 支持水平扩展，提高系统可用性

### 4. 配置自动伸缩
- 根据业务需求，配置 CVM 自动伸缩组
- 根据 CPU 使用率或其他指标自动添加或减少实例

## 十三、附录

### 1. 腾讯云控制台常用链接

- [CVM 控制台](https://console.cloud.tencent.com/cvm)
- [云解析 DNS](https://console.cloud.tencent.com/cns)
- [SSL 证书](https://console.cloud.tencent.com/ssl)
- [云监控](https://console.cloud.tencent.com/monitor)

### 2. 相关命令汇总

```bash
# 系统更新
sudo apt update && sudo apt upgrade -y

# 服务管理
pm2 status
pm2 logs rank-server
pm2 restart rank-server

# MongoDB 管理
sudo systemctl status mongod
mongo
mongodump --db rank-server --out /path/to/backup

# 网络检查
curl http://localhost:3000/health
curl http://您的公网IP:3000/health
netstat -tuln
```

### 3. 安全组规则配置

| 端口 | 协议 | 来源 | 描述 |
|------|------|------|------|
| 22 | TCP | 0.0.0.0/0 | SSH 访问 |
| 80 | TCP | 0.0.0.0/0 | HTTP 访问 |
| 443 | TCP | 0.0.0.0/0 | HTTPS 访问 |
| 3000 | TCP | 0.0.0.0/0 | 排行榜服务器访问 |
| 27017 | TCP | 127.0.0.1/32 | MongoDB 本地访问 |

---

通过本指南，您已经成功在腾讯云上部署了游戏排行榜服务器。如果您遇到任何问题，请参考本文档的「常见问题排查」部分，或联系腾讯云技术支持。

祝您游戏运营顺利！