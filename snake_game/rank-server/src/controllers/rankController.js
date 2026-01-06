const RankData = require('../models/RankData');
const RankConfig = require('../models/RankConfig');

exports.getRankConfig = async (req, res) => {
  try {
    const { appid } = req.query;
    const configs = await RankConfig.find({ appid });
    res.json({ code: 0, data: configs });
  } catch (error) {
    console.error('获取排行榜配置错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.reportRank = async (req, res) => {
  try {
    const { appid, rankid, openid, score, playername, portrait } = req.body;
    
    console.log('=== reportRank 开始 ===');
    console.log('接收到的参数:', { appid, rankid, openid, score, playername, portrait });
    
    if (!appid || !rankid || !openid) {
      console.log('缺少必需参数');
      return res.status(400).json({ code: 400, message: 'Missing required parameters' });
    }

    // 检查排行榜配置是否存在
    const config = await RankConfig.findOne({ appid, rankid });
    console.log('找到排行榜配置:', config ? '是' : '否');
    
    if (!config) {
      console.log('排行榜配置不存在');
      return res.status(400).json({ code: 400, message: 'Rank config not found' });
    }

    const now = new Date();
    const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    
    console.log('当前日期:', todayDate);

    // 首先按精确条件查询
    const exactQuery = { appid, rankid, openid };
    if (rankid === 'rank_day') {
      exactQuery.date = todayDate;
    } else {
      exactQuery.date = 'total';
    }
    
    console.log('精确查询条件:', exactQuery);

    let existing = await RankData.findOne(exactQuery);
    console.log('找到精确匹配记录:', existing ? '是' : '否');
    
    // 如果没有找到，检查是否存在相同appid、rankid、openid但date不同的记录（尤其是date为null的情况）
    if (!existing) {
      const generalQuery = { appid, rankid, openid };
      console.log('通用查询条件:', generalQuery);
      
      const generalExisting = await RankData.findOne(generalQuery);
      console.log('找到通用匹配记录:', generalExisting ? '是' : '否');
      
      existing = generalExisting;
    }
    
    if (existing) {
      console.log('现有记录分数:', existing.score, '新分数:', score);
      if (score > existing.score) {
        console.log('更新现有记录');
        existing.score = score;
        existing.playername = playername || existing.playername;
        existing.portrait = portrait || existing.portrait;
        existing.date = rankid === 'rank_day' ? todayDate : 'total';
        existing.updated_at = new Date();
        await existing.save();
        console.log('更新成功');
      } else {
        console.log('新分数不高于现有分数，不更新');
      }
    } else {
      console.log('创建新记录');
      const newData = await RankData.create({
        appid,
        rankid,
        openid,
        score,
        playername,
        portrait,
        date: rankid === 'rank_day' ? todayDate : 'total',
      });
      console.log('创建成功，新记录ID:', newData._id);
    }

    console.log('=== reportRank 完成 ===');
    res.json({ code: 0, message: 'Score reported successfully' });
  } catch (error) {
    console.error('上报分数错误:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.getRankData = async (req, res) => {
  try {
    const { appid, rankid, openid, range_from = 0, range_to = 99 } = req.body;
    
    console.log('=== getRankData 开始 ===');
    console.log('接收到的参数:', { appid, rankid, openid, range_from, range_to });
    
    // 首先按精确条件查询
    const exactQuery = { appid, rankid };
    
    if (rankid === 'rank_day') {
      const now = new Date();
      const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      exactQuery.date = todayDate;
      console.log('日榜查询，日期:', todayDate);
    } else {
      exactQuery.date = 'total';
      console.log('总榜查询');
    }
    
    console.log('精确查询条件:', exactQuery);
    console.log('执行MongoDB精确查询:', JSON.stringify(exactQuery, null, 2));
    
    let ranklist = await RankData.find(exactQuery)
      .sort({ score: -1 })
      .skip(range_from)
      .limit(range_to - range_from + 1)
      .lean();
    
    console.log('精确查询结果数量:', ranklist.length);
    
    // 如果精确查询没有结果，尝试查询所有相同appid和rankid的记录（包括date为null或其他值的情况）
    if (ranklist.length === 0) {
      const generalQuery = { appid, rankid };
      console.log('精确查询无结果，尝试通用查询条件:', generalQuery);
      console.log('执行MongoDB通用查询:', JSON.stringify(generalQuery, null, 2));
      
      ranklist = await RankData.find(generalQuery)
        .sort({ score: -1 })
        .skip(range_from)
        .limit(range_to - range_from + 1)
        .lean();
      
      console.log('通用查询结果数量:', ranklist.length);
    }
    
    console.log('最终查询结果完整数据:', JSON.stringify(ranklist, null, 2));
    if (ranklist.length > 0) {
      console.log('前3条记录:', ranklist.slice(0, 3).map(item => ({ openid: item.openid, score: item.score, date: item.date })));
    }
    
    const ranklistWithRank = ranklist.map((item, index) => ({
      ...item,
      rank: range_from + index + 1,
    }));

    let self = null;
    if (openid && openid.trim() !== '') {
      // 首先按精确条件查询用户数据
      const exactSelfQuery = { appid, rankid, openid };
      
      if (rankid === 'rank_day') {
        const now = new Date();
        const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        exactSelfQuery.date = todayDate;
      } else {
        exactSelfQuery.date = 'total';
      }
      
      let selfData = await RankData.findOne(exactSelfQuery).lean();
      
      // 如果精确查询没有结果，尝试查询所有相同appid、rankid、openid的记录（包括date为null或其他值的情况）
      if (!selfData) {
        const generalSelfQuery = { appid, rankid, openid };
        console.log('用户精确查询无结果，尝试通用查询条件:', generalSelfQuery);
        selfData = await RankData.findOne(generalSelfQuery).lean();
      }
      
      if (selfData) {
        // 查询所有相关记录以计算排名
        const allQuery = { appid, rankid };
        const allData = await RankData.find(allQuery).sort({ score: -1 }).lean();
        const selfIndex = allData.findIndex(item => item.openid === openid);
        if (selfIndex !== -1) {
          self = {
            ...selfData,
            rank: selfIndex + 1,
          };
        }
      }
    }

    res.json({ 
      code: 0, 
      data: {
        ranklist: ranklistWithRank,
        self: self
      }
    });
    console.log('=== getRankData 完成 ===');
  } catch (error) {
    console.error('获取排行榜数据错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.initDefaultConfig = async (req, res) => {
  try {
    const { appid } = req.body;
    
    const configs = [];
    
    // 创建总榜配置
    const totalConfig = await RankConfig.findOneAndUpdate(
      { appid, rankid: 'rank_total' },
      {
        appid,
        rankid: 'rank_total',
        name: '总排行榜',
        order: 'desc',
        min_score: 0,
        max_count: 100,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    configs.push(totalConfig);
    
    // 创建日榜配置
    const dayConfig = await RankConfig.findOneAndUpdate(
      { appid, rankid: 'rank_day' },
      {
        appid,
        rankid: 'rank_day',
        name: '日排行榜',
        order: 'desc',
        min_score: 0,
        max_count: 100,
        updated_at: new Date()
      },
      { upsert: true, new: true }
    );
    configs.push(dayConfig);

    res.json({ code: 0, message: 'Default config created', data: configs });
  } catch (error) {
    console.error('初始化配置错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.resetRankData = async (req, res) => {
  try {
    const { appid, rankid, date } = req.body;
    
    if (!appid) {
      return res.status(400).json({ code: 400, message: 'Missing required parameter: appid' });
    }

    const query = { appid };
    if (rankid) {
      query.rankid = rankid;
    }
    if (date) {
      query.date = date;
    }

    const result = await RankData.deleteMany(query);
    
    res.json({ 
      code: 0, 
      message: `Successfully deleted ${result.deletedCount} rank records`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    console.error('重置排行榜数据错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.code2openid = async (req, res) => {
  try {
    const { code, appid } = req.body;
    
    console.log('=== code2openid 开始 ===');
    console.log('接收到的参数:', { code, appid });
    
    if (!code) {
      console.log('缺少code参数');
      return res.status(400).json({ code: 400, message: 'Missing required parameter: code' });
    }
    
    // 生成模拟的openid（基于code的哈希值）
    const crypto = require('crypto');
    const openid = 'wx_' + crypto.createHash('md5').update(code + Date.now()).digest('hex').substring(0, 20);
    
    console.log('生成的openid:', openid);
    
    // 模拟微信接口返回格式
    const response = {
      code: 0,
      data: {
        data: {
          openid: openid
        }
      }
    };
    
    console.log('返回结果:', response);
    console.log('=== code2openid 完成 ===');
    
    res.json(response);
  } catch (error) {
    console.error('code2openid 错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};
