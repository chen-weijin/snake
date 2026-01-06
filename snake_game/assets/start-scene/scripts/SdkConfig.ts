export class SdkPkgConfig {
    static gameid = "wxf67531bdf3d328af";
    static projectName = "箭了又箭";
    static appid = "wxd06d9fdec79dd7e7";
    static version = "1.0.6";
    static RuanzhuBody = "长沙市云酷网络科技有限公司";
    static RuanzhuCode = "2025SA0034520";
    static RuanzhuBottom = 200;
    static Channel = "weixin";
    static UseGravityEngine = true;
}

export class SdkGameConfig {
    static isShowDebugLog = false;
    static isSkipVideo = false;
    static isStandardScreen = false;
    static isOpenAdConfirm = false;
    static golbalEvent = true;
    static isHoldBanner = true;
    static isLoadDoneBox = false;
    static boxTrapVideo = false;
    static boxCloseAd = false;
    static levelStartVideo = false;
    static levelStartBox = false;
    static levelEndBox = false;
    static levelEndNext = false;
    static closePanelIntertitalAd = false;
    static appResumeVideo = false;
    static unlockGridAd = false;
    static openPanelVideoAd = false;
    static openPanelIntertitalAd = false;
    static isHideAdIcon = false;
    static isLoopInterstital = true;
    static isLoopVideo = false;
    static natCloseTrapPer = 0;
    static cfgShield = false;
    static isShield = false;
    static cfgShieldArea = [];
    static isOpenStatConsole = false;
    static statDayCount = 3;
    static adid_banner = "";
    static adid_video = "adunit-87f6b3ccc52bddcb";
    static adid_interstital = "";
    static adid_nBanner = [
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
    ];
    static adid_nInterstital = [
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
    ];
    static reportHwActivePer = 100;
    static natBannerInt = 10;
    static interstitalInt = 16;
    static videoInt = 30;
    static interstitalMask = true;
    static interstitalNativeButton = true;
    static isLoopAddDesktop = true;
    static TaskTime1 = 0;
    static Effect1 = 0;
    static LogoUrl = "";
    static ruanzhuInfo = "深圳市大源长流科技有限公司 软著号：2025SR1349568";
    static mainLogoUrl = "";
    static rankRemoteURL = "http://106.53.198.49:3000/v2/rank/api/";
    static wxOpenIdUrl = "http://106.53.198.49:3000/v2/rank/api/code2openid";
    static wxSubRequestUrl = "https://www.deniulor.com/addJob/";
    static isLoadRemoteLevelTable = false;
    static remoteLevelChose = 1;
    static remoteLevelTableUrl1 = "";
    static remoteLevelTableUrl2 = "";
    static remoteLevelTableUrl3 = "";
    static remoteLevelTableUrl4 = "";
    static basename = "用户";
    static isOpenRemoteData = false;
    static remoteDataSaveInterval = 300;
    static LoadRemoteDataUrl = "https://dc.sm0.fun/v2/userdata/getUserData";
    static SyncRemoteDataUrl = "https://dc.sm0.fun/v2/userdata/setUserData";
    static isOpenRank = true;
    static isOpenCircle = true;
    static offlineContentID = ["CONTENT593359106"];
    static phycialReContentID = [""];
    static importEventContentID = [""];
    static firstInterstTime = 0;
    static loopInterstTime = 0;
    static ccfirstInterstTime = 0;
    static ccloopInterstTime = 0;
    static AdTimeDel = false;
    static abTestValueArr = [];
    static abBlankValue = 1;
    static abRemoteTagId = "";
    static shareImage = [
        "https://mmocgame.qpic.cn/wechatgame/Lbw9FIK6OysJDRVZTK8zKYZ1oficv2wGUOk5ibcowwN43lWpYxaUIibPdN5sTxaGaX3/0",
        "https://mmocgame.qpic.cn/wechatgame/byApU4e7zouQxjHb73LTic9yRFDwuB8GCS3XeNcXGGBkibibvbKiawtATaot7RPngJqib/0",
    ];
    static shareTitle = ["已老实，速来帮我！！", "能过第二关我就服你！！"];
    static gameName = "";
    static gameIcon = "";
    static isShowInterst = false;
    static gameResultPopInterst = false;
    static isShowBanner = true;
    static loopShowInsertInterval = 0;
    static loopReward = 0;
    static interval = 70;
    static hasShownRecommend = false;
}

export class SdkConfig {
    static IpQueryURL = "https://cdwaterbear.cn/ip/queryex";
    static remodeConfigData = null;
    static gameid;
    static version;

    static get ConfigUrlBase() {
        return "https://api.sm0.fun/v2/cfg/" + this.gameid + "/" + this.version + "/";
    }

    static get ConfigUrlSdk() {
        return this.ConfigUrlBase + "sdk";
    }

    static get ConfigUrlShield() {
        return this.ConfigUrlBase + "sdk_shield";
    }

    static loadGameConfig(e, t, n) {
        var i = this;
        (this.gameid = e),
            (this.version = t),
            this.loadConfig$(this.ConfigUrlSdk, function (e) {
                i.checkConfigShield(function (t) {
                    (e.isShield = t),
                        console.debug("######### sheild status:", e.isShield),
                        e.isShield
                            ? i.loadConfig$(i.ConfigUrlShield, function (t) {
                                  i.merge(e, t), n(e);
                              })
                            : n(e);
                });
            });
    }
    static loadConfig$(e, t) {
        this.request(
            e + "?tagID=" + window.SmSdk.localTagId,
            function (n) {
                console.debug("### sdk cfg ### 读取远程配置:", e), t(n);
            },
            function (n) {
                console.error("### sdk cfg ### 获取配置出现异常", e, n), t({});
            }
        );
    }
    static checkConfigShield(e) {
        if (!SdkGameConfig.cfgShield) return e(false);

        this.request(
            this.IpQueryURL + "?t=" + Date.now() / 1e3,
            function (t) {
                if (t.code != 0) return e(true);

                const o = JSON.stringify(t);

                for (let s of SdkGameConfig.cfgShieldArea) {
                    if (o.includes(s)) return e(true);
                }

                return e(false);
            },
            function () {
                e(true);
            }
        );
    }

    static request(e, t, n) {
        var i = new XMLHttpRequest();
        (i.responseType = "text"),
            (i.onload = function () {
                var o = {};
                try {
                    (o = JSON.parse(i.response)), console.log("### smsdk ### 请求成功:", e, i.response);
                } catch (e) {
                    return void n(e);
                }
                t(o);
            }),
            (i.onerror = function (t) {
                console.log(e + "请求失败", i.status, t), n(t);
            }),
            i.open("GET", e, true),
            i.send();
    }
    static merge(e, t) {
        var n = Object.getOwnPropertyNames(e),
            i = Object.getOwnPropertyNames(t);
        SdkGameConfig.isShowDebugLog && (console.log("ppppppppp", n), console.log("oooooooo", i));
        for (var o = 0; o < n.length; ++o) {
            var a = n[o];
            "length" != a && "name" != a && (i.indexOf(a) < 0 || (e[a] = t[a]));
        }
    }
    static print(e) {
        console.log("### sdk cfg ### ================== Config Begin ==================");
        for (var t = Object.getOwnPropertyNames(e), n = 0; n < t.length; ++n) {
            var i = t[n];
            "length" != i && "name" != i && "function" != typeof e[i] && console.log("### sdk cfg ###\t\t", i + ":", e[i]);
        }
        console.log("### sdk cfg ### ==================  Config End  ==================");
    }
}
