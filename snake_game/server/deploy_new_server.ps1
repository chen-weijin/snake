# 新服务器部署脚本（PowerShell版本）
# 使用方法：.\deploy_new_server.ps1

Write-Host "开始部署新服务器..." -ForegroundColor Green

# 1. 检查Node.js版本
Write-Host "1. 检查Node.js版本..." -ForegroundColor Yellow
node -v
npm -v

# 2. 安装PM2（如果未安装）
Write-Host "2. 安装PM2..." -ForegroundColor Yellow
npm install -g pm2

# 3. 创建项目目录
Write-Host "3. 创建项目目录..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "C:\opt\server" -Force | Out-Null

# 4. 复制项目文件
Write-Host "4. 复制项目文件..." -ForegroundColor Yellow
Copy-Item -Path "*" -Destination "C:\opt\server\" -Recurse -Force

# 5. 安装项目依赖
Write-Host "5. 安装项目依赖..." -ForegroundColor Yellow
Set-Location "C:\opt\server"
npm install

# 6. 创建环境变量文件
Write-Host "6. 创建环境变量文件..." -ForegroundColor Yellow
@"
# 服务器端口
PORT=3000

# MongoDB 连接字符串
MONGODB_URI=mongodb://43.139.6.101:27017/rank-server

# 日志级别
LOG_LEVEL=info
"@ | Out-File -FilePath ".env" -Force

# 7. 停止旧服务（如果存在）
Write-Host "7. 停止旧服务..." -ForegroundColor Yellow
pm2 stop rank-server 2>$null
pm2 delete rank-server 2>$null

# 8. 启动新服务器
Write-Host "8. 启动新服务器..." -ForegroundColor Yellow
pm2 start app.js --name "server"

# 9. 配置PM2开机自启
Write-Host "9. 配置PM2开机自启..." -ForegroundColor Yellow
pm2 startup
pm2 save

# 10. 初始化排行榜配置
Write-Host "10. 初始化排行榜配置..." -ForegroundColor Yellow
Start-Sleep -Seconds 5 # 等待服务启动
try {
    Invoke-RestMethod -Uri "http://localhost:3000/v2/rank/api/initconfig" -Method POST -ContentType "application/json" -Body '{"appid": "wxf67531bdf3d328af"}'
} catch {
    Write-Host "初始化配置时出错: $($_.Exception.Message)" -ForegroundColor Red
}

# 11. 显示部署结果
Write-Host "部署完成！" -ForegroundColor Green
Write-Host "新服务器已成功部署！" -ForegroundColor Green
Write-Host "服务状态：" -ForegroundColor Yellow
pm2 status

Write-Host "访问地址：" -ForegroundColor Yellow
$ip = (Invoke-RestMethod -Uri "http://ifconfig.me/ip").Trim()
Write-Host "http://$ip`:3000/health"
Write-Host "http://$ip`:3000/v2/rank/api/"
Write-Host "http://$ip`:3000/v2/userdata/"

Write-Host "查看日志：" -ForegroundColor Yellow
Write-Host "pm2 logs server"

Write-Host "重启服务：" -ForegroundColor Yellow
Write-Host "pm2 restart server"

Write-Host "部署脚本执行完成！" -ForegroundColor Green