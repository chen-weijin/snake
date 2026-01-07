const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// 用户相关路由
router.get('/getUserData', userController.getUserData);
router.post('/setUserData', userController.setUserData);
router.post('/code2openid', userController.code2openid);

// 兼容客户端请求的路由
router.post('/getUserData', userController.getUserData);
router.get('/setUserData', userController.setUserData);

module.exports = router;