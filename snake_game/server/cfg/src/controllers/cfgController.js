const config = require('../../../rank/config');

// 配置数据模型
class ConfigData {
  constructor() {
    // 默认配置数据
    this.defaultConfigs = {
      // 游戏配置
      isShowDebugLog: false,
      isSkipVideo: false,
      isStandardScreen: false,
      isOpenAdConfirm: false,
      golbalEvent: true,
      isHoldBanner: true,
      isLoadDoneBox: false,
      boxTrapVideo: false,
      boxCloseAd: false,
      levelStartVideo: false,
      levelStartBox: false,
      levelEndBox: false,
      levelEndNext: false,
      closePanelIntertitalAd: false,
      appResumeVideo: false,
      unlockGridAd: false,
      openPanelVideoAd: false,
      openPanelIntertitalAd: false,
      isHideAdIcon: false,
      isLoopInterstital: true,
      isLoopVideo: false,
      natCloseTrapPer: 0,
      cfgShield: false,
      isShield: false,
      cfgShieldArea: [],
      isOpenStatConsole: false,
      statDayCount: 3,
      adid_banner: "",
      adid_video: "adunit-87f6b3ccc52bddcb",
      adid_interstital: "",
      adid_nBanner: [
        "j28nxxv6t0",
        "s38vy6sizi",
        "t2fmeauu4p",
        "k57yt5tq9p",
        "l80u8ehgn1",
        "r8ecjt1lbl",
        "d5ify3zc38",
        "b2dsb4puuj",
        "k4532vhxse",
        "l2o539nqsm",
      ],
      adid_nInterstital: [
        "g5ovx3fpvj",
        "o7814xpvww",
        "q45hjfe8w9",
        "y6dmw2x8bz",
        "u8l6d4phq4",
        "p88q3y1b5z",
        "t9bhv8pvn6",
        "z6988nm7ce",
        "v8wcpdjqsl",
        "t484mnp2gt",
      ],
      reportHwActivePer: 100,
      natBannerInt: 10,
      interstitalInt: 16,
      videoInt: 30,
      interstitalMask: true,
      interstitalNativeButton: true,
      isLoopAddDesktop: true,
      TaskTime1: 0,
      Effect1: 0,
      LogoUrl: "",
      ruanzhuInfo: "深圳市大源长流科技有限公司 软著号：2025SR1349568",
      mainLogoUrl: "",
      rankRemoteURL: "http://106.53.198.49:3000/v2/rank/api/",
      wxOpenIdUrl: "http://106.53.198.49:3000/v2/rank/api/code2openid",
      wxSubRequestUrl: "https://www.deniulor.com/addJob/",
      isLoadRemoteLevelTable: false,
      remoteLevelChose: 1,
      remoteLevelTableUrl1: "",
      remoteLevelTableUrl2: "",
      remoteLevelTableUrl3: "",
      remoteLevelTableUrl4: "",
      basename: "用户",
      isOpenRemoteData: false,
      remoteDataSaveInterval: 300,
      LoadRemoteDataUrl: "http://106.53.198.49:3000/v2/userdata/getUserData",
      SyncRemoteDataUrl: "http://106.53.198.49:3000/v2/userdata/setUserData",
      isOpenRank: true,
      isOpenCircle: true,
      offlineContentID: ["CONTENT593359106"],
      phycialReContentID: [""],
      importEventContentID: [""],
      firstInterstTime: 0,
      loopInterstTime: 0,
      ccfirstInterstTime: 0,
      ccloopInterstTime: 0,
      AdTimeDel: false,
      abTestValueArr: [],
      abBlankValue: 1,
      abRemoteTagId: "",
      shareImage: [
        "https://mmocgame.qpic.cn/wechatgame/Lbw9FIK6OysJDRVZTK8zKYZ1oficv2wGUOk5ibcowwN43lWpYxaUIibPdN5sTxaGaX3/0",
        "https://mmocgame.qpic.cn/wechatgame/byApU4e7zouQxjHb73LTic9yRFDwuB8GCS3XeNcXGGBkibibvbKiawtATaot7RPngJqib/0",
      ],
      shareTitle: ["已老实，速来帮我！！", "能过第二关我就服你！！"],
      gameName: "",
      gameIcon: "",
      isShowInterst: false,
      gameResultPopInterst: false,
      isShowBanner: true,
      loopShowInsertInterval: 0,
      loopReward: 0,
      interval: 70,
      hasShownRecommend: false,
    };
  }

  // 获取配置
  getConfig(gameid, version, type = 'sdk') {
    // 这里可以根据需要从数据库或文件系统加载配置
    // 目前返回默认配置
    const config = { ...this.defaultConfigs };
    
    // 如果是屏蔽配置，添加屏蔽相关的配置
    if (type === 'sdk_shield') {
      config.isShield = true;
      // 可以添加更多屏蔽相关的配置
    }
    
    return config;
  }
}

// 创建配置实例
const configData = new ConfigData();

// 配置控制器
class CfgController {
  // 获取SDK配置
  static getSdkConfig(req, res) {
    try {
      const { gameid, version } = req.params;
      const config = configData.getConfig(gameid, version, 'sdk');
      res.json(config);
    } catch (error) {
      console.error('Error getting SDK config:', error);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    }
  }

  // 获取屏蔽配置
  static getShieldConfig(req, res) {
    try {
      const { gameid, version } = req.params;
      const config = configData.getConfig(gameid, version, 'sdk_shield');
      res.json(config);
    } catch (error) {
      console.error('Error getting shield config:', error);
      res.status(500).json({ code: 500, message: 'Internal server error' });
    }
  }
}

module.exports = CfgController;