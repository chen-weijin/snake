# 游戏排行榜服务器

这是一个基于Node.js和MongoDB的游戏排行榜服务器，用于处理游戏客户端的排行榜数据上报和查询。

## 功能特性

- 支持多游戏、多排行榜类型
- 灵活的排行榜配置
- 支持分数上报和排行榜查询
- 完整的请求验证和错误处理
- 支持环境变量配置

## 技术栈

- Node.js 14+
- Express 4.x
- MongoDB 4.x
- Mongoose 8.x

## 项目结构

```
rank-server/
├── src/
│   ├── app.js          # 主应用入口
│   ├── routes/         # API路由
│   │   └── rank.js     # 排行榜相关路由
│   ├── models/         # 数据模型
│   │   ├── RankConfig.js
│   │   └── RankData.js
│   ├── controllers/    # 控制器
│   │   └── rankController.js
│   └── utils/          # 工具函数
│       └── validator.js
├── config.js           # 配置文件
├── package.json
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 配置数据库

确保MongoDB服务已启动，并在`config.js`中配置正确的MongoDB连接字符串。

### 3. 启动服务器

```bash
npm start
```

或使用开发模式：

```bash
npm run dev
```

服务器将在端口3000上启动，可通过环境变量`PORT`修改。

## API接口

### 1. 获取排行榜配置

- **URL**: `/v2/rank/api/report/rankconfig`
- **方法**: `GET`
- **参数**:
  - `appid`: 游戏ID

- **响应示例**:
```json
[
  {
    "rankid": "rank_total",
    "name": "总排行榜",
    "order": "desc",
    "min_score": 0
  }
]
```

### 2. 上报排行榜分数

- **URL**: `/v2/rank/api/report/rankreport`
- **方法**: `POST`
- **参数**:
  ```json
  {
    "appid": "游戏ID",
    "rankid": "排行榜ID",
    "openid": "玩家OpenID",
    "score": 100,
    "playername": "玩家名称",
    "portrait": "玩家头像URL",
    "ext": "扩展数据（JSON字符串）"
  }
  ```

- **响应示例**:
```json
{"code": 0, "message": "success"}
```

### 3. 获取排行榜数据

- **URL**: `/v2/rank/api/report/rankdata`
- **方法**: `POST`
- **参数**:
  ```json
  {
    "appid": "游戏ID",
    "rankid": "排行榜ID",
    "openid": "玩家OpenID（可选，用于获取自身排名）",
    "range_from": 0,
    "range_to": 100
  }
  ```

- **响应示例**:
```json
{
  "ranklist": [
    {
      "rank": 1,
      "openid": "玩家1OpenID",
      "playername": "玩家1",
      "portrait": "头像URL",
      "score": 1000
    }
  ],
  "self": {
    "rank": 10,
    "openid": "当前玩家OpenID",
    "playername": "当前玩家",
    "portrait": "当前玩家头像URL",
    "score": 500
  }
}
```

### 4. 初始化默认配置

- **URL**: `/v2/rank/api/report/initconfig`
- **方法**: `POST`
- **参数**:
  ```json
  {
    "appid": "游戏ID"
  }
  ```

- **响应示例**:
```json
{"code": 0, "message": "Default configs initialized successfully"}
```

## 环境变量

| 变量名 | 描述 | 默认值 |
|--------|------|--------|
| PORT | 服务器端口 | 3000 |
| MONGODB_URI | MongoDB连接字符串 | mongodb://localhost:27017/rank-server |
| LOG_LEVEL | 日志级别 | info |

## 部署

### Docker部署

（待实现）

### 云服务器部署

1. 安装Node.js和MongoDB
2. 克隆代码到服务器
3. 安装依赖
4. 配置环境变量
5. 启动服务器

## 客户端集成

### 配置客户端

在游戏客户端中配置排行榜服务器URL：

```javascript
// 例如在Cocos Creator项目中
const rankRemoteURL = "http://your-server-ip:3000/v2/rank/api/report/";
```

### 初始化配置

首次使用前，调用`initconfig`接口初始化游戏的排行榜配置。

## 开发指南

### 添加新功能

1. 在`models`目录下创建数据模型
2. 在`controllers`目录下实现业务逻辑
3. 在`routes`目录下注册路由
4. 在`utils`目录下添加工具函数

### 测试

使用Postman或其他API测试工具测试API接口。

## 许可证

ISC
