const User = require('../models/User');

exports.getUserData = async (req, res) => {
  try {
    const { openid, appid } = req.query;
    
    console.log('=== getUserData 开始 ===');
    console.log('接收到的参数:', { openid, appid });
    
    if (!openid || !appid) {
      console.log('缺少必需参数');
      return res.status(400).json({ code: 400, message: 'Missing required parameters: openid and appid' });
    }
    
    // 查询用户数据
    const user = await User.findOne({ openid, appid });
    
    if (user) {
      console.log('找到用户数据:', user);
      res.json({ 
        code: 0, 
        data: {
          openid: user.openid,
          user_data: user.user_data || {}
        }
      });
    } else {
      console.log('用户不存在');
      res.json({ 
        code: 0, 
        data: {
          openid: openid,
          user_data: {}
        }
      });
    }
    
    console.log('=== getUserData 完成 ===');
  } catch (error) {
    console.error('获取用户数据错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.setUserData = async (req, res) => {
  try {
    const { openid, appid, user_data } = req.body;
    
    console.log('=== setUserData 开始 ===');
    console.log('接收到的参数:', { openid, appid });
    console.log('接收到的user_data:', user_data);
    
    if (!openid || !appid || !user_data) {
      console.log('缺少必需参数');
      return res.status(400).json({ code: 400, message: 'Missing required parameters: openid, appid, and user_data' });
    }
    
    // 查找或创建用户
    const user = await User.findOneAndUpdate(
      { openid, appid },
      { 
        user_data,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('保存成功:', user);
    
    res.json({ 
      code: 0, 
      message: 'User data saved successfully',
      data: {
        openid: user.openid,
        user_data: user.user_data
      }
    });
    
    console.log('=== setUserData 完成 ===');
  } catch (error) {
    console.error('保存用户数据错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.code2openid = async (req, res) => {
  try {
    const { code, appid } = req.body;
    
    console.log('=== code2openid 开始 ===');
    console.log('接收到的参数:', { code, appid });
    
    if (!code || !appid) {
      console.log('缺少必需参数');
      return res.status(400).json({ code: 400, message: 'Missing required parameters: code and appid' });
    }
    
    // 检查是否已存在相同code的用户
    let user = await User.findOne({ code, appid });
    
    if (user) {
      console.log('找到现有用户:', user.openid);
      res.json({ 
        code: 0, 
        data: {
          data: {
            openid: user.openid
          }
        }
      });
    } else {
      // 生成新的openid
      const crypto = require('crypto');
      const openid = 'wx_' + crypto.createHash('md5').update(code + Date.now()).digest('hex').substring(0, 20);
      
      console.log('生成的openid:', openid);
      
      // 创建新用户
      user = await User.create({
        openid,
        code,
        appid,
        user_data: {}
      });
      
      console.log('创建新用户成功');
      
      res.json({ 
        code: 0, 
        data: {
          data: {
            openid: openid
          }
        }
      });
    }
    
    console.log('=== code2openid 完成 ===');
  } catch (error) {
    console.error('code2openid 错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};