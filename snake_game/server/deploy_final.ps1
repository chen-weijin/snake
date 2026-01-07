# 新服务器远程部署脚本（最终版）
# 使用方法：在PowerShell中执行 .\deploy_final.ps1

Write-Host "开始远程部署新服务器..." -ForegroundColor Green

# 1. 清理远程服务器并创建目录
Write-Host "1. 清理远程服务器并创建目录..." -ForegroundColor Yellow
ssh -i "C:\amufen.pem" root@106.53.198.49 "rm -rf /root/server && mkdir -p /root/server"

# 2. 上传关键文件
Write-Host "2. 上传关键文件..." -ForegroundColor Yellow

# 上传 app.js
scp -i "C:\amufen.pem" app.js root@106.53.198.49:/root/server/
Write-Host "上传 app.js 完成"

# 上传 package.json
scp -i "C:\amufen.pem" package.json root@106.53.198.49:/root/server/
Write-Host "上传 package.json 完成"

# 上传 rank 目录
scp -i "C:\amufen.pem" -r rank root@106.53.198.49:/root/server/
Write-Host "上传 rank 目录完成"

# 上传 user 目录
scp -i "C:\amufen.pem" -r user root@106.53.198.49:/root/server/
Write-Host "上传 user 目录完成"

# 3. 执行远程部署
Write-Host "3. 执行远程部署..." -ForegroundColor Yellow
ssh -i "C:\amufen.pem" root@106.53.198.49 @"
cd /root/server

# 安装依赖
npm install

# 安装 PM2
npm install -g pm2

# 创建环境变量文件
cat > .env << 'EOF'
PORT=3000
MONGODB_URI=mongodb://43.139.6.101:27017/rank-server
LOG_LEVEL=info
EOF

# 停止旧服务
pm2 stop rank-server 2>/dev/null
pm2 delete rank-server 2>/dev/null
pm2 stop server 2>/dev/null
pm2 delete server 2>/dev/null

# 启动新服务
pm2 start app.js --name "server"

# 配置开机自启
pm2 startup
pm2 save

# 等待服务启动
sleep 5

# 初始化排行榜配置
curl -X POST http://localhost:3000/v2/rank/api/initconfig \
  -H "Content-Type: application/json" \
  -d '{"appid": "wxf67531bdf3d328af"}'

# 显示服务状态
echo "=== 服务状态 ==="
pm2 status

echo "=== 部署完成 ==="
echo "新服务器已成功部署到 106.53.198.49"
echo "访问地址："
echo "http://106.53.198.49:3000/health"
echo "http://106.53.198.49:3000/v2/rank/api/"
echo "http://106.53.198.49:3000/v2/userdata/"
"@

# 4. 完成部署
Write-Host "4. 部署完成！" -ForegroundColor Green
Write-Host "新服务器已成功部署到 106.53.198.49" -ForegroundColor Green
Write-Host "您可以通过以下地址访问：" -ForegroundColor Yellow
Write-Host "http://106.53.198.49:3000/health"
Write-Host "http://106.53.198.49:3000/v2/rank/api/"
Write-Host "http://106.53.198.49:3000/v2/userdata/"