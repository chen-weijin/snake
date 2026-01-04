# 更新部署说明

## 快速部署指南

### 方法一：使用更新脚本（推荐）

1. **更新 package.json 依赖**
   ```bash
   cd d:/projectAI/snake/snake_game/rank-server
   npm install
   ```

2. **运行更新脚本**
   ```bash
   # 使用 SSH 密钥
   bash update.sh 43.139.6.101 ~/.ssh/rank-server-key.pem
   
   # 或不使用密钥（如果已配置免密登录）
   bash update.sh 43.139.6.101
   ```

### 方法二：手动部署

1. **上传修改后的文件到服务器**
   ```bash
   # 上传 src 目录
   scp -i ~/.ssh/rank-server-key.pem -r src ubuntu@43.139.6.101:/opt/rank-server/
   
   # 上传 public 目录
   scp -i ~/.ssh/rank-server-key.pem -r public ubuntu@43.139.6.101:/opt/rank-server/
   
   # 上传 package.json
   scp -i ~/.ssh/rank-server-key.pem package.json ubuntu@43.139.6.101:/opt/rank-server/
   ```

2. **SSH 连接到服务器**
   ```bash
   ssh -i ~/.ssh/rank-server-key.pem ubuntu@43.139.6.101
   ```

3. **在服务器上执行以下操作**
   ```bash
   # 进入项目目录
   cd /opt/rank-server
   
   # 安装新的依赖（node-cron）
   npm install
   
   # 重启服务
   pm2 restart rank-server
   
   # 查看服务状态
   pm2 status
   
   # 查看日志
   pm2 logs rank-server --lines 50
   ```

## 验证部署

1. **检查服务健康状态**
   ```bash
   curl http://43.139.6.101:3000/health
   ```

2. **检查日榜自动重置功能**
   ```bash
   # 查看服务日志，确认日榜重置任务已启动
   ssh -i ~/.ssh/rank-server-key.pem ubuntu@43.139.6.101 'pm2 logs rank-server --lines 100'
   ```

   应该能看到类似这样的日志：
   ```
   日榜自动重置任务已启动，每天凌晨00:00执行
   ```

## 新增功能说明

### 1. 日榜自动重置
- 每天 00:00 自动重置日榜数据
- 删除前一天的日榜记录
- 保留总榜数据不受影响

### 2. 排行榜类型分离
- **总榜 (rank_total)**: 历史排行榜，数据永久保存
- **日榜 (rank_day)**: 每日排行榜，每天 00:00 重置

### 3. 可视化工具更新
- 支持选择排行榜类型（总榜/日榜）
- 分别上报和查询不同类型的排行榜数据

## 修改的文件列表

1. **服务器端文件**:
   - `src/models/RankData.js` - 添加 date 字段
   - `src/controllers/rankController.js` - 更新排行榜逻辑
   - `src/utils/dailyRankReset.js` - 新增日榜重置工具
   - `src/app.js` - 集成日榜重置功能
   - `package.json` - 添加 node-cron 依赖

2. **可视化工具文件**:
   - `public/index.html` - 添加排行榜类型选择
   - `public/script.js` - 更新上报和查询逻辑

3. **客户端文件**:
   - `assets/res_remote_arrowsPuzzlee/scripts/APRankSelectBtn.ts` - 适配新的排行榜ID

## 常见问题

### Q: 更新后服务无法启动？
A: 检查日志：
```bash
ssh -i ~/.ssh/rank-server-key.pem ubuntu@43.139.6.101 'pm2 logs rank-server --lines 100'
```

### Q: 日榜没有自动重置？
A: 检查 cron 任务是否启动，查看日志中是否有"日榜自动重置任务已启动"的提示。

### Q: 如何手动触发日榜重置？
A: 需要在服务器上手动调用重置函数，或者等待每天 00:00 自动执行。

## 回滚操作

如果更新后出现问题，可以回滚到之前的版本：

```bash
# SSH 连接到服务器
ssh -i ~/.ssh/rank-server-key.pem ubuntu@43.139.6.101

# 停止服务
pm2 stop rank-server

# 恢复之前的文件（如果有备份）
# cd /opt/rank-server
# git checkout <previous-commit>

# 重启服务
pm2 start rank-server
```

## 联系支持

如果遇到问题，请查看：
1. 服务日志：`pm2 logs rank-server`
2. MongoDB 日志：`sudo tail -f /var/log/mongodb/mongod.log`
3. 系统日志：`journalctl -xe`
