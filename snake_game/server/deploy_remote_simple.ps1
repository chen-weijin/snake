# 新服务器远程部署脚本（简化版）
# 使用方法：在PowerShell中执行 .\deploy_remote_simple.ps1

# 服务器信息
$SERVER_IP = "106.53.198.49"
$SERVER_USER = "root"
$KEY_FILE = "C:\amufen.pem"

Write-Host "开始远程部署新服务器..." -ForegroundColor Green

# 1. 清理远程服务器
Write-Host "1. 清理远程服务器..." -ForegroundColor Yellow
ssh -i $KEY_FILE "$SERVER_USER@$SERVER_IP" "rm -rf /root/server && mkdir -p /root/server"

# 2. 上传项目文件
Write-Host "2. 上传项目文件..." -ForegroundColor Yellow
$files = @(
    "app.js",
    "package.json",
    "rank/config.js",
    "rank/src/controllers/rankController.js",
    "rank/src/models/RankConfig.js",
    "rank/src/models/RankData.js",
    "rank/src/routes/rank.js",
    "rank/src/utils/dailyRankReset.js",
    "rank/src/utils/validator.js",
    "user/src/controllers/userController.js",
    "user/src/models/User.js",
    "user/src/routes/user.js"
)

foreach ($file in $files) {
    $remotePath = "/root/server/$file"
    Write-Host "上传 $file -> $remotePath"
    scp -i $KEY_FILE "$file" "$SERVER_USER@$SERVER_IP:$remotePath"
}

# 3. 部署服务
Write-Host "3. 部署服务..." -ForegroundColor Yellow
ssh -i $KEY_FILE "$SERVER_USER@$SERVER_IP" @"
cd /root/server && npm install && npm install -g pm2 && cat > .env << 'EOF'
PORT=3000
MONGODB_URI=mongodb://43.139.6.101:27017/rank-server
LOG_LEVEL=info
EOF
pm2 stop rank-server 2>/dev/null || true
pm2 delete rank-server 2>/dev/null || true
pm2 stop server 2>/dev/null || true
pm2 delete server 2>/dev/null || true
pm2 start app.js --name "server" && pm2 startup && pm2 save && sleep 5 && curl -X POST http://localhost:3000/v2/rank/api/initconfig -H "Content-Type: application/json" -d '{"appid": "wxf67531bdf3d328af"}' && pm2 status
"@

# 4. 显示结果
Write-Host "4. 部署完成！" -ForegroundColor Green
Write-Host "新服务器已成功部署到 106.53.198.49" -ForegroundColor Green
Write-Host "您可以通过以下地址访问：" -ForegroundColor Yellow
Write-Host "http://106.53.198.49:3000/health"
Write-Host "http://106.53.198.49:3000/v2/rank/api/"
Write-Host "http://106.53.198.49:3000/v2/userdata/"