const express = require('express');
const CfgController = require('../controllers/cfgController');

const router = express.Router();

// 配置路由
router.get('/:gameid/:version/sdk', CfgController.getSdkConfig);
router.get('/:gameid/:version/sdk_shield', CfgController.getShieldConfig);

module.exports = router;