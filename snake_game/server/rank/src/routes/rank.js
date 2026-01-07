const express = require('express');
const router = express.Router();
const rankController = require('../controllers/rankController');
const validator = require('../utils/validator');

// 排行榜相关路由
router.get('/rankconfig', validator.validateRankConfigRequest, rankController.getRankConfig);
router.post('/rankconfig', validator.validateRankConfigRequest, rankController.getRankConfig);
router.post('/rankreport', validator.validateRankReportRequest, rankController.reportRank);
router.post('/rankdata', validator.validateRankDataRequest, rankController.getRankData);
router.post('/initconfig', validator.validateInitConfigRequest, rankController.initDefaultConfig);
router.post('/reset', rankController.resetRankData);

// 排行榜相关路由（带 /report/ 前缀，用于兼容客户端请求）
router.get('/report/rankconfig', validator.validateRankConfigRequest, rankController.getRankConfig);
router.post('/report/rankconfig', validator.validateRankConfigRequest, rankController.getRankConfig);
router.post('/report/rankreport', validator.validateRankReportRequest, rankController.reportRank);
router.post('/report/rankdata', validator.validateRankDataRequest, rankController.getRankData);
router.post('/report/initconfig', validator.validateInitConfigRequest, rankController.initDefaultConfig);
router.post('/report/reset', rankController.resetRankData);

// code2openid 接口
router.post('/code2openid', rankController.code2openid);
router.post('/report/code2openid', rankController.code2openid);

module.exports = router;