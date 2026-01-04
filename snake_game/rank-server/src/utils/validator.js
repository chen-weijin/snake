// 请求验证工具函数

// 验证排行榜配置请求
exports.validateRankConfigRequest = (req, res, next) => {
  const { appid } = req.query;
  
  if (!appid || typeof appid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid appid parameter' });
  }
  
  next();
};

// 验证排行榜上报请求
exports.validateRankReportRequest = (req, res, next) => {
  const { appid, rankid, openid, score, playername } = req.body;
  
  if (!appid || typeof appid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid appid parameter' });
  }
  
  if (!rankid || typeof rankid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid rankid parameter' });
  }
  
  if (!openid || typeof openid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid openid parameter' });
  }
  
  if (typeof score !== 'number' || isNaN(score)) {
    return res.status(400).json({ code: 400, message: 'Invalid score parameter' });
  }
  
  if (!playername || typeof playername !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid playername parameter' });
  }
  
  next();
};

// 验证排行榜数据请求
exports.validateRankDataRequest = (req, res, next) => {
  const { appid, rankid } = req.body;
  const { range_from, range_to } = req.body;
  
  if (!appid || typeof appid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid appid parameter' });
  }
  
  if (!rankid || typeof rankid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid rankid parameter' });
  }
  
  // 验证范围参数
  if (range_from !== undefined && (typeof range_from !== 'number' || isNaN(range_from) || range_from < 0)) {
    return res.status(400).json({ code: 400, message: 'Invalid range_from parameter' });
  }
  
  if (range_to !== undefined && (typeof range_to !== 'number' || isNaN(range_to) || range_to < 0)) {
    return res.status(400).json({ code: 400, message: 'Invalid range_to parameter' });
  }
  
  if (range_from !== undefined && range_to !== undefined && range_from > range_to) {
    return res.status(400).json({ code: 400, message: 'range_from must be less than or equal to range_to' });
  }
  
  next();
};

// 验证初始化配置请求
exports.validateInitConfigRequest = (req, res, next) => {
  const { appid } = req.body;
  
  if (!appid || typeof appid !== 'string') {
    return res.status(400).json({ code: 400, message: 'Invalid appid parameter' });
  }
  
  next();
};