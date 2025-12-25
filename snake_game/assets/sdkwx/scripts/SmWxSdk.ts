import { _decorator, sys, game, UITransform, Vec3, Vec2, view, v2 } from "cc";
import { smtime } from "../../start-scene/scripts/SmTime";
import { RegSmSdk, BaseSdk } from "../../start-scene/scripts/BaseSdk";
import { SdkPkgConfig, SdkGameConfig } from "../../start-scene/scripts/SdkConfig";
import { sdkEventManager, SdkInnerEvent } from "../../start-scene/scripts/SdkEventManager";
import { sdkutils } from "../../start-scene/scripts/Utils";
import { YinLisdk } from "../../start-scene/scripts/YinLisdk";

const { ccclass } = _decorator;
@ccclass("SmWxSdk")
export class SmWxSdk extends BaseSdk {
    adWatchNum = 0;
    _videoNum = 1;
    _shareTemplates = [];
    formShareReturnTime = smtime.now();
    cilckshareTime = 0;
    getPlayerInfoCallback = null;
    recommendPageManager: any;
    _videoSrc: any;
    _videoInstance: any;
    _videoFailedCB: any;
    _videoSuccessCB: any;
    wxGameClubButton: any;
    _shareAppMessageSuccesCB: any;
    _shareAppMessageFailCB: any;
    wxAuthorizeBtn: any;

    get name() {
        return "wx";
    }

    get sdk() {
        return window.wx;
    }

    get active() {
        return sys.platform == sys.Platform.WECHAT_GAME;
    }

    get hasReadme() {
        return true;
    }

    initSdk() {
        var e,
            t = this;
        (this.openDebug = false),
            window.wx.getLaunchOptionsSync(function (e) {
                console.log("### 冷启动 ###"), (t.wxScene = e.scene), console.log("### wxScene1 ###", t.wxScene);
            }),
            window.wx.onShow(function (e) {
                console.log("### 热启动 ###"), (t.wxScene = e.scene), console.log("### wxScene2 ###", t.wxScene), t.checkPro();
            }),
            window.wx.showShareMenu({
                withShareTicket: true,
                menus: ["shareAppMessage", "shareTimeline"],
            }),
            window.wx.onShareAppMessage(function () {
                window.sm.log.debug("用户点击了分享按钮");
                var e = Math.floor(Math.random() * t._shareTemplates.length),
                    n = t._shareTemplates[e];
                return (
                    console.log("### randomIndex:", e),
                    console.log("### selectedTemplate:", n),
                    {
                        title: n.title,
                        imageUrl: n.imageUrl,
                    }
                );
            }),
            (this.appid = SdkPkgConfig.appid);
        var n = null == (e = window.wx.getLaunchOptionsSync()) || null == (e = e.query) ? void 0 : e.adlink;
        console.log("监测链接参数2: " + n), n && null != n && null != n && n.length > 0 && (window.SmSdk.adLink = n), this.loadRecommend();
    }
    loadRecommend() {
        if (!window.wx.createPageManager) throw "当前基础库版本暂不支持。";
        (this.recommendPageManager = window.wx.createPageManager()),
            this.recommendPageManager.load({
                openlink: "TWFRCqV5WeM2AkMXhKwJ03MhfPOieJfAsvXKUbWvQFQtLyyA5etMPabBehga950uzfZcH3Vi3QeEh41xRGEVFw",
            });
    }
    async showRecommend() {
        console.log("### wx showRecommend ###");
        var t0 = this.recommendPageManager;
        if (!t0) {
            await this.loadRecommend();
        }
        return await this.recommendPageManager.show();
    }

    initGameConfig() {}
    loadPackag(e, t) {
        (e = "usr_" + e), console.log("### smsdk ### load", e);
        var n = 0;

        let func1 = function () {
            window.wx.loadSubpackage({
                subpackage: e,
                success: function (n) {
                    console.log("### smsdk ### load", "分包[" + e + "]加载完毕", n), t();
                },
                fail: function (t) {
                    console.error("分包[" + e + "]失败", t),
                        (n += 1) <= 3 ? func1() : console.error("### smsdk ### load", "分包[" + e + "]加载失败", t);
                },
            });
        };

        func1();
    }
    beforeGameLoad(e) {
        this.gameLogin(
            function () {},
            function () {
                window.SmSdk.showLogin();
            }
        ),
            e();
    }
    onGameConfigLoadDone(e) {
        this.getPlayerId(e), this.initShareTemplates();
    }
    reportActive(e) {
        if (!(sdkutils.rand(100) > SdkGameConfig.reportHwActivePer || localStorage.getItem("sm_sdk_reported"))) {
            var t = window.wx.getLaunchOptionsSync();
            if (t.query && JSON.parse(t.query).callback) {
                var n = JSON.stringify(t);
                console.log("### smsdk ### launch", n),
                    sdkutils.post(
                        "https://api.sm0.fun/zt/hw/v1/conversion",
                        {
                            appId: this.appid,
                            openId: e,
                            activeData: n,
                        },
                        function () {
                            localStorage.setItem("sm_sdk_reported", "1");
                        }
                    );
            }
        }
    }
    gameLogin(e, t) {}
    OnGameLoadDone() {
        var e = this;
        SdkGameConfig.isLoopAddDesktop &&
            window.SmSdk.schedule(
                function () {
                    return e.checkAndAddDesktop();
                },
                300,
                30
            );
    }
    DeleteAccount() {
        sys.localStorage.clear(), this.exitGame();
    }
    checkAndAddDesktop() {}
    rewardVideo(e) {
        var self = this;
        return (
            (this._videoSrc = e),
            window.SmSdk.stat.rewardStart(this._videoSrc),
            sdkEventManager.emit(SdkInnerEvent.OnRewardADStart),
            console.log("adid_video:", SdkGameConfig.adid_video),
            sdkEventManager.emit(SdkInnerEvent.OnRewardADStartSdk, this._videoSrc, this.adWatchNum, this._videoNum),
            this.adWatchNum++,
            null == ge ||
                ge.adShowEvent("reward", SdkGameConfig.adid_video, {
                    custom_param: "点击视频广告上报",
                }),
            this._videoInstance ||
                ((this._videoInstance = this.sdk.createRewardedVideoAd({
                    adUnitId: SdkGameConfig.adid_video,
                    multiton: false,
                })),
                this._videoInstance.onLoad(function () {
                    window.sm.log.error("#### 2激励广告 展示开始");
                    try {
                        window.SmSdk.stat.rewardLoad(self._videoSrc);
                    } catch (e) {
                        window.sm.log.error("#### 2E 激励广告 展示开始" + JSON.stringify(e)), self._videoFailedCB(e);
                    }
                }),
                this._videoInstance.onError(function (e) {
                    game.resume(),
                        self.showToast("暂时没有视频了，请稍后再试"),
                        window.sm.log.error("#### 3E videoAd.onError,errMsg" + JSON.stringify(e)),
                        self._videoFailedCB(e);
                }),
                this._videoInstance.onClose(function (e) {
                    if ((game.resume(), (e && e.isEnded) || void 0 === e)) {
                        window.SmSdk.stat.rewardSuccess(self._videoSrc), self._videoSuccessCB();
                        var n = self._videoSrc.toString();
                        sdkEventManager.emit(SdkInnerEvent.OnRewardADSuccessSdk, n, self._videoNum), self._videoNum++;
                    } else window.sm.log.error("#### 3E1 播放中途退出，不下发游戏奖励"), self._videoFailedCB("播放中途退出，不下发游戏奖励");
                })),
            new Promise<void>(function (e, n) {
                (self._videoSuccessCB = e),
                    (self._videoFailedCB = n),
                    game.pause(),
                    self._videoInstance.show().catch(function () {
                        self._videoInstance
                            .load()
                            .then(function () {
                                return self._videoInstance.show();
                            })
                            .catch(function (e) {
                                game.resume(), console.log("激励视频 广告显示失败");
                            });
                    });
            })
        );
    }
    showIntertitalAd() {}
    showBannerAd() {}
    hideBannerAd() {}
    exitGame() {}
    getPlayerId(e) {
        var t,
            n = this;
        if (
            (window.sm.log.debug("this.getPlayerId", this.appid),
            (this.openid = window.SmSdk.savedOpenid),
            window.sm.log.debug("wxopenid:", this.openid),
            this.openid && this.openid.length > 0)
        )
            return null == YinLisdk || YinLisdk.initialize(1, this.openid), null == (t = window.ccWxSdk) || t.initialize(this.openid), e();
        this.sdk.login({
            success: function (t) {
                window.sm.log.debug("############## 微信code:", JSON.stringify(t)),
                    t.code &&
                        n.sdk.request({
                            url: "https://api.sm0.fun/v2/code2openid",
                            data: {
                                code: t.code,
                                appid: n.appid,
                            },
                            header: {
                                "content-type": "application/json",
                            },
                            method: "POST",
                            success: function (t) {
                                var o;
                                window.sm.log.debug("############## 请求唯一ID成功", JSON.stringify(t)),
                                    0 == t.data.code &&
                                        (console.log("###res.data.data.data.openid:", t.data.data.data.openid),
                                        console.log("###res", t),
                                        (n.openid = t.data.data.data.openid),
                                        (window.SmSdk.savedOpenid = t.data.data.data.openid),
                                        null == YinLisdk || YinLisdk.initialize(1, n.openid),
                                        sdkEventManager.emit(SdkInnerEvent.NewUserEnterGame),
                                        null == (o = window.ccWxSdk) || o.initialize(n.openid),
                                        console.log("!!!###res", t.code),
                                        e());
                            },
                            fail: function (t) {
                                window.sm.log.debug("############## 请求唯一ID失败", t), e();
                            },
                        });
            },
        });
    }
    initShareTemplates() {
        window.sm.log.debug("SdkGameConfig.shareTitle:", SdkGameConfig.shareTitle),
            window.sm.log.debug("SdkGameConfig.shareImage:", SdkGameConfig.shareImage);
        for (var e = SdkGameConfig.shareTitle, t = SdkGameConfig.shareImage, n = Math.min(e.length, t.length), o = 0; o < n; o++)
            this._shareTemplates.push({
                title: e[o],
                imageUrl: t[o],
            });
    }
    createGameClubButton(e, t, n?) {
        var o = window.wx.getSystemInfoSync().windowWidth,
            i = window.wx.getSystemInfoSync().windowHeight,
            s = {
                type: "text",
                text: "",
                style: {
                    left: 0,
                    top: 0,
                    width: window.wx.getSystemInfoSync().windowWidth,
                    height: window.wx.getSystemInfoSync().windowHeight,
                    lineHeight: 0,
                    backgroundColor: "#00000000",
                    color: "#ffffffff",
                    textAlign: "center",
                    fontSize: 16,
                    borderRadius: 4,
                },
            },
            r = e.getComponent(UITransform),
            a = r.contentSize.width / o,
            c = r.contentSize.height / i,
            g = new Vec3();
        ((g = e.inverseTransformPoint(g, t.worldPosition)).x += r.contentSize.width / 2), (g.y = -(g.y - r.contentSize.height / 2));
        var h = t.getComponent(UITransform),
            m = h.contentSize.width * t.scale.x,
            f = h.contentSize.height * t.scale.y,
            p = new Vec2(g.x / a, g.y / c),
            w = m / a,
            S = f / c,
            v = new Vec2(p.x - w / 2, p.y - S / 2);
        return (
            (s.style.left = v.x),
            (s.style.top = v.y),
            (s.style.width = w),
            (s.style.height = S),
            (this.wxGameClubButton = window.wx.createGameClubButton(s)),
            this.wxGameClubButton.onTap(function (e) {
                n && n();
            }),
            this.wxGameClubButton
        );
    }
    destroyGameClubButton() {
        console.log("删除授权按钮"), this.wxGameClubButton && (this.wxGameClubButton.destroy(), (this.wxGameClubButton = null));
    }
    shareAppMessage(e, t) {
        var n = Math.floor(Math.random() * this._shareTemplates.length),
            o = this._shareTemplates[n];
        window.sm.log.debug("微信 分享"),
            (this._shareAppMessageSuccesCB = e),
            (this._shareAppMessageFailCB = t),
            (this.cilckshareTime = smtime.now()),
            window.wx.shareAppMessage({
                title: o.title,
                imageUrl: o.imageUrl,
            }),
            e && e();
    }
    isFormCollect() {
        return 1104 == this.wxScene;
    }
    isformDesktop() {
        return 1023 == this.wxScene;
    }
    openBusinessView(e) {
        window.wx.openBusinessView &&
            window.wx.openBusinessView({
                businessType: "servicecommentpage",
                success: function (e) {
                    console.log("成功拉起体验评价组件" + JSON.stringify(e));
                },
                fail: function (e) {
                    console.log(e);
                },
            });
    }
    request$(e, t, n, o) {
        var i = new XMLHttpRequest();
        (i.responseType = "text"),
            window.sm.log.debug("##服务器请求##开始##", e, t),
            (i.onload = function () {
                window.sm.log.debug("##服务器请求##成功##", e, t, i.response);
                try {
                    var s = JSON.parse(i.response);
                    0 == s.code ? n(s.message) : o && o(s.code, s.message);
                } catch (e) {
                    o && o(i.status, e);
                }
            }),
            (i.onerror = function () {
                window.sm.log.error("##服务器请求##失败##", i.status, i.response), o && o(i.status, i.response);
            }),
            (i.ontimeout = function (e) {
                window.sm.log.error("##服务器请求##超时##", i.status, i.response, e), o && o(i.status, i.response);
            }),
            i.open("POST", e, true),
            (i.timeout = 5e3),
            i.setRequestHeader("Content-Type", "application/json"),
            i.send(t),
            window.sm.log.debug("##服务器请求##等待##", e, t);
    }
    createUserInfoButton(e) {
        var t = this;
        window.sm.log.debug("createUserInfoButton", e.position.x, e.position.y);
        var n = {
            type: "text",
            text: "",
            style: {
                left: 0,
                top: 0,
                width: window.wx.getSystemInfoSync().screenWidth,
                height: window.wx.getSystemInfoSync().screenHeight,
                lineHeight: 0,
                backgroundColor: "#00000000",
                color: "#ffffff",
                textAlign: "center",
                fontSize: 16,
                borderRadius: 4,
            },
        };
        if (null != e) {
            var o = view.getVisibleSize(),
                i = window.wx.getSystemInfoSync(),
                s = i.windowWidth,
                r = i.windowHeight,
                a = v2(e.worldPosition.x, o.height - e.worldPosition.y);
            (n.style.left = (a.x / o.width) * s - 5),
                (n.style.top = (a.y / o.height) * r - 5),
                (n.style.width = 10 + (e.getComponent(UITransform).width / o.width) * s),
                (n.style.height = 10 + (e.getComponent(UITransform).height / o.height) * r);
        }
        return (
            window.sm.log.debug("info.style", n.style),
            (this.wxAuthorizeBtn = window.wx.createUserInfoButton(n)),
            this.wxAuthorizeBtn.onTap(function (e) {
                "getUserInfo:ok" === e.errMsg
                    ? (window.sm.log.debug("用户同意授权"),
                      t.destroyUserInfoButton(),
                      sdkEventManager.emit(SdkInnerEvent.OnAuthorize),
                      window.SmSdk.sdkImp.getPlayerInfo(t.getPlayerInfoCallback))
                    : window.sm.log.debug("用户拒绝授权");
            }),
            this.wxAuthorizeBtn
        );
    }
    destroyUserInfoButton() {
        console.log("删除授权按钮"), this.wxAuthorizeBtn && (this.wxAuthorizeBtn.destroy(), (this.wxAuthorizeBtn = null));
    }
    getPlayerInfo(e) {
        (this.getPlayerInfoCallback = e),
            window.wx.getSetting({
                success: function (t) {
                    window.sm.log.debug("wx.getSetting", t),
                        t.authSetting["scope.userInfo"]
                            ? window.wx.getUserInfo({
                                  success: function (t) {
                                      console.log(t.userInfo),
                                          t.userInfo.gender,
                                          t.userInfo.province,
                                          t.userInfo.city,
                                          t.userInfo.country,
                                          (window.SmSdk.savedPlayerName = t.userInfo.nickName),
                                          (window.SmSdk.savedPortrait = t.userInfo.avatarUrl),
                                          e({
                                              playername: t.userInfo.nickName,
                                              portrait: t.userInfo.avatarUrl,
                                          });
                                  },
                              })
                            : sdkEventManager.emit(SdkInnerEvent.OnGetPlayerInfo);
                },
            });
    }
    copyTxt(e) {
        var t = this;
        if ((window.sm.log.debug("### 复制文本 ###", e), !this.sdk || !this.sdk.setClipboardData))
            return window.sm.log.error("### 复制文本失败：SDK不可用 ###"), void window.sm.ui.tip("复制功能不可用");
        this.sdk.setClipboardData({
            data: e,
            success: function (e) {
                window.sm.log.debug("### 文本复制成功 ###"),
                    window.sm.ui.tip("复制成功"),
                    t.sdk.getClipboardData({
                        success: function (e) {
                            window.sm.log.debug("### 复制结果 ###：", e.data);
                        },
                        fail: function (e) {
                            window.sm.log.warn("### 复制结果失败 ###：", e.errMsg);
                        },
                    });
            },
            fail: function (e) {
                window.sm.log.error("### 复制文本失败 ###：", e.errMsg), window.sm.ui.tip("复制失败");
            },
        });
    }
}

RegSmSdk(SmWxSdk);
