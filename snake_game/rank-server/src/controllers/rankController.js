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
    
    if (!appid || !rankid || !openid) {
      return res.status(400).json({ code: 400, message: 'Missing required parameters' });
    }

    const now = new Date();
    const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;

    const query = { appid, rankid, openid };
    
    if (rankid === 'rank_day') {
      query.date = todayDate;
    }

    const existing = await RankData.findOne(query);
    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.playername = playername || existing.playername;
        existing.portrait = portrait || existing.portrait;
        existing.updated_at = new Date();
        await existing.save();
      }
    } else {
      await RankData.create({
        appid,
        rankid,
        openid,
        score,
        playername,
        portrait,
        date: rankid === 'rank_day' ? todayDate : 'total',
      });
    }

    res.json({ code: 0, message: 'Score reported successfully' });
  } catch (error) {
    console.error('上报分数错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.getRankData = async (req, res) => {
  try {
    const { appid, rankid, openid, range_from = 0, range_to = 99 } = req.body;
    
    const query = { appid, rankid };
    
    if (rankid === 'rank_day') {
      const now = new Date();
      const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
      query.date = todayDate;
    } else {
      query.date = 'total';
    }
    
    const ranklist = await RankData.find(query)
      .sort({ score: -1 })
      .skip(range_from)
      .limit(range_to - range_from + 1)
      .lean();
    
    const ranklistWithRank = ranklist.map((item, index) => ({
      ...item,
      rank: range_from + index + 1,
    }));

    let self = null;
    if (openid && openid.trim() !== '') {
      const selfQuery = { appid, rankid, openid };
      
      if (rankid === 'rank_day') {
        const now = new Date();
        const todayDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
        selfQuery.date = todayDate;
      } else {
        selfQuery.date = 'total';
      }
      
      const selfData = await RankData.findOne(selfQuery).lean();
      if (selfData) {
        const allData = await RankData.find(query).sort({ score: -1 }).lean();
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
  } catch (error) {
    console.error('获取排行榜数据错误:', error);
    res.status(500).json({ code: 500, message: 'Internal server error' });
  }
};

exports.initDefaultConfig = async (req, res) => {
  try {
    const { appid } = req.body;
    
    const existing = await RankConfig.findOne({ appid });
    if (existing) {
      return res.json({ code: 0, message: 'Config already exists', data: existing });
    }

    const defaultConfig = await RankConfig.create({
      appid,
      ranks: [
        { rankid: 'rank_total', rankname: '总排行榜' },
        { rankid: 'rank_day', rankname: '日排行榜' },
      ],
    });

    res.json({ code: 0, message: 'Default config created', data: defaultConfig });
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
