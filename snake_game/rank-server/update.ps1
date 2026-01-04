# PowerShell 部署脚本 - 更新远端服务器
# 使用方法：.\update.ps1 -ServerIP "43.139.6.101" -KeyPath "C:\path\to\key.pem"

param(
    [Parameter(Mandatory=$false)]
    [string]$ServerIP = "43.139.6.101",
    
    [Parameter(Mandatory=$false)]
    [string]$KeyPath = "C:\amufen.pem",
    
    [Parameter(Mandatory=$false)]
    [string]$ServerUser = "root"
)

Write-Host "开始更新腾讯云排行榜服务器..." -ForegroundColor Green
Write-Host "服务器IP: $ServerIP" -ForegroundColor Yellow

# 检查是否安装了 pscp 和 plink (PuTTY 工具)
$pscpPath = Get-Command pscp -ErrorAction SilentlyContinue
$plinkPath = Get-Command plink -ErrorAction SilentlyContinue

if (-not $pscpPath -or -not $plinkPath) {
    Write-Host "错误：未找到 PuTTY 工具 (pscp 和 plink)" -ForegroundColor Red
    Write-Host "请从 https://www.putty.org/ 下载并安装 PuTTY" -ForegroundColor Yellow
    exit 1
}

# 构建 SCP 命令
if ($KeyPath -and (Test-Path $KeyPath)) {
    $scpBase = "pscp -i `"$KeyPath`""
    $sshBase = "plink -i `"$KeyPath`" -batch"
} else {
    $scpBase = "pscp"
    $sshBase = "plink -batch"
}

$serverUser = "$ServerUser@$ServerIP"

Write-Host "开始上传文件..." -ForegroundColor Yellow

# 1. 上传 src 目录
Write-Host "上传 src 目录..." -ForegroundColor Cyan
& $scpBase -r "src" $serverUser":/opt/rank-server/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "上传 src 目录失败" -ForegroundColor Red
    exit 1
}

# 2. 上传 public 目录
Write-Host "上传 public 目录..." -ForegroundColor Cyan
& $scpBase -r "public" $serverUser":/opt/rank-server/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "上传 public 目录失败" -ForegroundColor Red
    exit 1
}

# 3. 上传 package.json
Write-Host "上传 package.json..." -ForegroundColor Cyan
& $scpBase "package.json" $serverUser":/opt/rank-server/"
if ($LASTEXITCODE -ne 0) {
    Write-Host "上传 package.json 失败" -ForegroundColor Red
    exit 1
}

Write-Host "文件上传完成" -ForegroundColor Green

# 4. 在服务器上执行更新操作
Write-Host "在服务器上执行更新操作..." -ForegroundColor Yellow

$commands = @"
cd /opt/rank-server
echo "安装新的依赖..."
npm install
echo "重启排行榜服务器..."
pm2 restart rank-server
sleep 3
echo "检查服务状态..."
pm2 status
echo "更新完成！
"@

& $sshBase $serverUser $commands

if ($LASTEXITCODE -eq 0) {
    Write-Host "更新部署完成！" -ForegroundColor Green
    Write-Host "`n验证服务：" -ForegroundColor Yellow
    Write-Host "curl http://$ServerIP/health"
    Write-Host "`n查看日志：" -ForegroundColor Yellow
    Write-Host "plink -batch ubuntu@$ServerIP 'pm2 logs rank-server --lines 50'"
} else {
    Write-Host "更新失败，请检查错误信息" -ForegroundColor Red
    exit 1
}
