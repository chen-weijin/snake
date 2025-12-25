import { sys, assetManager, game } from "cc";
import { SdkConfig, SdkPkgConfig, SdkGameConfig } from "./SdkConfig";
import { YinLisdk } from "./YinLisdk";
import { AdConfirmPanel } from "./AdConfirmPanel";
import { sdkEventManager, SdkInnerEvent } from "./SdkEventManager";
import { SdkStorage } from "./SdkStorage";
import { sdkutils } from "./Utils";

export function RegSmSdk(e) {
    console.log("### RegSmSdk ###");
    var t = new e();
    if (sys.platform == sys.Platform.WECHAT_GAME || sys.platform == sys.Platform.BYTEDANCE_MINI_GAME || "default" == t.name) {
        window.SmSdk.sdkImp = t;
    }
}

export enum GiftType {
    share = 1,
    circle = 2,
    table = 3,
    fromApp = 4,
}

export class BaseSdk {
    isShield = true;
    appid = SdkPkgConfig.appid;
    openDebug = true;
    wxScene = 0;
    bundleLoadIdx = 0;
    bundleArr = ["main", "resources", "res_remote1"];
    lastRewardClick = 0;
    RewardInterval = 2000;
    isSdkNewDay = false;
    isFromSidebar = false;
    isSidebarExist = false;

    get sdk() {
        return null;
    }
    openid: any;

    get hasReadme() {
        return true;
    }

    get platformLastPlayTime() {
        return sys.localStorage.getItem("platformLastPlayTime", 0);
    }

    set platformLastPlayTime(e) {
        sys.localStorage.setItem("platformLastPlayTime", e);
    }

    get sharePro() {
        return SdkStorage.getSdk("sharePro", 0);
    }

    set sharePro(e) {
        SdkStorage.saveSdk("sharePro", e);
        sdkEventManager.emit(SdkInnerEvent.OnRefreshLoginState);
    }

    get circlePro() {
        return SdkStorage.getSdk("circlePro", 0);
    }

    set circlePro(e) {
        SdkStorage.saveSdk("circlePro", e);
        sdkEventManager.emit(SdkInnerEvent.OnRefreshLoginState);
    }

    get collectPro() {
        return SdkStorage.getSdk("collectPro", 0);
    }

    set collectPro(e) {
        SdkStorage.saveSdk("collectPro", e);
        sdkEventManager.emit(SdkInnerEvent.OnRefreshLoginState);
    }

    get giftPro() {
        return SdkStorage.getSdk("giftPro", 0);
    }

    set giftPro(e) {
        SdkStorage.saveSdk("giftPro", e);
        sdkEventManager.emit(SdkInnerEvent.OnRefreshLoginState);
    }

    get tablePro() {
        return SdkStorage.getSdk("tablePro", 0);
    }

    set tablePro(e) {
        SdkStorage.saveSdk("tablePro", e);
        sdkEventManager.emit(SdkInnerEvent.OnRefreshLoginState);
    }

    get usePro() {
        return SdkStorage.getSdk("usePro", 0);
    }

    set usePro(e) {
        SdkStorage.saveSdk("usePro", e);
    }

    init() {
        this.initSdk(), (this.isSdkNewDay = sdkutils.isNewDay(this.platformLastPlayTime));
    }
    initSdk() {}
    loadAssetBundles(e, t) {
        var n = this;
        if (!this.bundleArr || this.bundleArr.length <= 0) return e();

        let func = function () {
            var o = n.bundleArr[n.bundleLoadIdx];
            console.log("加载bundle[" + o + "]"),
                assetManager.loadBundle(o, function (r, a) {
                    if (a)
                        console.log("bundle[" + o + "]完成", a),
                            (n.bundleLoadIdx += 1),
                            t(n.bundleLoadIdx / n.bundleArr.length),
                            n.bundleLoadIdx >= n.bundleArr.length ? e() : func();
                    else {
                        console.log("bundle[" + o + "]加载报错", r);
                        var s = o.substring(o.lastIndexOf("/"));
                        n.showToast("游戏资源集[" + s + "]加载失败, 请重启游戏。");
                    }
                });
        };

        func();
    }
    loadGameConfig(e) {
        var t = this;
        SdkConfig.loadGameConfig(SdkPkgConfig.gameid, SdkPkgConfig.version, function (n) {
            (SdkConfig.remodeConfigData = n),
                SdkConfig.merge(SdkGameConfig, n),
                SdkConfig.print(SdkGameConfig),
                sdkEventManager.emit(SdkInnerEvent.OnRemoteConfigLoadDone, n),
                t.initGameConfig(),
                e();
        });
    }
    showLogin() {}
    showBoxAd() {}
    onGameConfigLoadDone(e) {
        e();
    }
    initGameConfig() {}
    beforeGameLoad(e) {
        e();
    }
    getPlayerId(e) {
        e(void 0);
    }
    loadRemoteData(e) {
        SdkStorage.loadRemoteData(this.openid, this.appid, e);
    }
    showToast(e) {
        var t;
        null == (t = this.sdk) ||
            t.showToast({
                title: e,
                icon: "none",
                image: "",
                mask: false,
                duration: 2e3,
            });
    }
    shake(e = 50) {
        if (window.SmSdk.isVibrate)
            if (e >= 100) {
                var t;
                null == (t = this.sdk) || t.vibrateLong();
            } else {
                var n;
                null == (n = this.sdk) || n.vibrateShort();
            }
    }
    installShortcut() {
        return Promise.resolve();
    }
    smRewardVideo(e: any, i: number = 0): Promise<void> {
        const o = this;
        return SdkGameConfig.isSkipVideo
            ? Promise.resolve()
            : new Promise(function (r, a) {
                  if (SdkGameConfig.isOpenAdConfirm) {
                      window.SmSdk.sdkPanel.showPanel(AdConfirmPanel).then(function (s) {
                          s.setCallBack(async function () {
                              try {
                                  await o.executeRewardVideo(e, i);
                                  r();
                              } catch (error) {
                                  a();
                              }
                          });
                      });
                  } else {
                      o.executeRewardVideo(e, i).then(r).catch(a);
                  }
              });
    }

    async executeRewardVideo(t, i) {
        var o, r, a;
        try {
            o = new Date().getTime();
            if (o < this.lastRewardClick + this.RewardInterval) {
                window.sm.ui.tip("广告加急准备中...");
                throw new Error("广告冷却中");
            }
            this.lastRewardClick = o;
            null == YinLisdk || YinLisdk.stat("adShow", "adPosition", t);
            game.pause();
            await this.rewardVideo(t);
            null == YinLisdk || YinLisdk.stat("adShowEnd", "adPosition", t);
            null == (r = window.sm) || r.audio.resumeMusic();
            game.resume();
            this.lastRewardClick = 0;
            window.SmSdk.stat.cusEvent("ad_count");
            window.SmSdk.stat.cusEvent(t);
            sdkEventManager.emit(SdkInnerEvent.OnRewardADSuccess);
        } catch (e) {
            game.resume();
            null == (a = window.sm) || a.audio.resumeMusic();
            throw e;
        }
    }

    rewardVideo(e) {
        console.log("### sdk ### 展示视频");
        return Promise.resolve();
    }
    showIntertitalAd() {}
    showSidebar() {}
    showBannerAd() {}
    hideBannerAd() {}
    showPortal() {}
    loadNative(e, t) {}
    exitGame() {}
    storageSet(e, t) {
        return sys.localStorage.setItem(e, t);
    }
    storageGet(e) {
        return sys.localStorage.getItem(e);
    }
    storageDel(e) {
        return sys.localStorage.removeItem(e);
    }
    createGameClubButton(e, t, n) {}
    destroyGameClubButton() {}
    createUserInfoButton(e) {}
    destroyUserInfoButton() {}
    getPlayerInfo(e) {}
    shareAppMessage(e, t) {
        var n;
        console.log("### this.sdk ###:", this.sdk),
            null == (n = this.sdk) ||
                n.shareAppMessage({
                    success: e,
                    fail: t,
                });
    }
    isFormCollect() {
        return false;
    }
    isformDesktop() {
        return false;
    }
    openBusinessView(e) {}
    copyTxt(e) {}
    addShortcut(e, t) {}
    addCommonUse(e, t) {}
    showRecommend() {}
    initPro() {
        this.isSdkNewDay &&
            (this.setGiftPro(GiftType.share, 0),
            this.setGiftPro(GiftType.circle, 0),
            this.setGiftPro(GiftType.fromApp, 0),
            this.setGiftPro(GiftType.table, 0)),
            window.SmSdk.sdkImp.isFormCollect() && 0 == this.getCurGiftPro(GiftType.fromApp) && this.setGiftPro(GiftType.fromApp, 1),
            window.SmSdk.sdkImp.isformDesktop() && 0 == this.getCurGiftPro(GiftType.table) && this.setGiftPro(GiftType.table, 1);
    }
    checkPro() {
        window.SmSdk.sdkImp.isFormCollect() && 0 == this.getCurGiftPro(GiftType.fromApp) && this.setGiftPro(GiftType.fromApp, 1),
            window.SmSdk.sdkImp.isformDesktop() && 0 == this.getCurGiftPro(GiftType.table) && this.setGiftPro(GiftType.table, 1);
    }
    getCurGiftPro(e) {
        return e == GiftType.share
            ? this.sharePro
            : e == GiftType.circle
            ? this.circlePro
            : e == GiftType.table
            ? this.tablePro
            : e == GiftType.fromApp
            ? this.collectPro
            : void 0;
    }
    setGiftPro(e, t) {
        e == GiftType.share && (this.sharePro = t),
            e == GiftType.circle && (this.circlePro = t),
            e == GiftType.table && (this.tablePro = t),
            e == GiftType.fromApp && (this.collectPro = t);
    }
}
