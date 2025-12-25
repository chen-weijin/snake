import { assetManager, Prefab, instantiate } from "cc";
import { YinLisdk } from "./YinLisdk";
import { SmSdkPanel } from "./SmSdkPanel";
import { ChannelEnum } from "./PlatConst";
import { RankManager } from "./RankManager";
import { SdkPkgConfig, SdkGameConfig, SdkConfig } from "./SdkConfig";
import { sdkEventManager, SdkInnerEvent } from "./SdkEventManager";
import { SdkStorage } from "./SdkStorage";
import { Statistics } from "./Statistics";
import { SysTaskManager } from "./SysTaskManager";
import { sdkutils } from "./Utils";

export default class SmSdk {
    sdkBundleName = "";
    getReward = null;
    stat: Statistics;
    sdkImp: any;
    rankManager: RankManager;
    sdkPanel: SmSdkPanel;

    get uma() {
        var e = window;
        if (!e || !e.wx) return undefined;
        return e.wx.uma;
    }

    get isAgreeReadme() {
        return SdkStorage.getSdk("isAgreeReadme", true);
    }
    set isAgreeReadme(e) {
        SdkStorage.saveSdk("isAgreeReadme", e);
    }

    get isVibrate() {
        return SdkStorage.getSdk("isVibrate", true);
    }
    set isVibrate(e) {
        SdkStorage.saveSdk("isVibrate", e);
    }

    get hasReadme() {
        return SdkStorage.getSdk("hasReadme", true);
    }
    set hasReadme(e) {
        SdkStorage.saveSdk("hasReadme", e);
    }

    get savedOpenid() {
        return SdkStorage.getSdk("savedOpenid", "");
    }
    set savedOpenid(e) {
        SdkStorage.saveSdk("savedOpenid", e);
    }

    get savedPlayerName() {
        return SdkStorage.getSdk("savedPlayerName", "");
    }
    set savedPlayerName(e) {
        SdkStorage.saveSdk("savedPlayerName", e);
    }

    get mode1StageConut() {
        return SdkStorage.getSdk("mode1StageConut", "");
    }
    set mode1StageConut(e) {
        SdkStorage.saveSdk("mode1StageConut", e);
    }

    get mode2StageConut() {
        return SdkStorage.getSdk("mode2StageConut", "");
    }
    set mode2StageConut(e) {
        SdkStorage.saveSdk("mode2StageConut", e);
    }

    get savedPortrait() {
        return SdkStorage.getSdk("savedPortrait", "");
    }
    set savedPortrait(e) {
        SdkStorage.saveSdk("savedPortrait", e);
    }

    get isFeedExist() {
        return SdkStorage.getSdk("isFeedExist", true);
    }
    set isFeedExist(e) {
        SdkStorage.saveSdk("isFeedExist", e);
    }

    get isFeedSubscribe() {
        return SdkStorage.getSdk("isFeedSubscribe", true);
    }
    set isFeedSubscribe(e) {
        SdkStorage.saveSdk("isFeedSubscribe", e);
    }

    get isFromfeed() {
        return SdkStorage.getSdk("isFromfeed", true);
    }
    set isFromfeed(e) {
        SdkStorage.saveSdk("isFromfeed", e);
    }

    get isFromSidebar() {
        return SdkStorage.getSdk("isFromSidebar", true);
    }
    set isFromSidebar(e) {
        SdkStorage.saveSdk("isFromSidebar", e);
    }

    get scene() {
        return SdkStorage.getSdk("scene", "");
    }
    set scene(e) {
        SdkStorage.saveSdk("scene", e);
    }

    get feed_game_scene() {
        return SdkStorage.getSdk("feed_game_scene", "");
    }
    set feed_game_scene(e) {
        SdkStorage.saveSdk("feed_game_scene", e);
    }

    get isSidebarExist() {
        return SdkStorage.getSdk("isSidebarExist", false);
    }
    set isSidebarExist(e) {
        SdkStorage.saveSdk("isSidebarExist", e);
    }

    get adLink() {
        return SdkStorage.getSdk("adLink", "");
    }
    set adLink(e) {
        SdkStorage.saveSdk("adLink", e);
    }

    get localTagId() {
        return SdkStorage.getSdk("localTagId", "");
    }
    set localTagId(e) {
        SdkStorage.saveSdk("localTagId", e);
    }

    get fetchedSideReward() {
        return SdkStorage.getSdk("fetchedSideReward", false);
    }
    set fetchedSideReward(e) {
        SdkStorage.saveSdk("fetchedSideReward", e);
    }

    get statLastPlayTime() {
        return SdkStorage.getSdk("lastPlayTime", 0);
    }
    set statLastPlayTime(e) {
        SdkStorage.saveSdk("lastPlayTime", e);
    }

    get activeDay() {
        return SdkStorage.getSdk("activeDay", 0);
    }
    set activeDay(e) {
        SdkStorage.saveSdk("activeDay", e);
    }

    get activeTime() {
        return SdkStorage.getSdk("activeTime", 0);
    }
    set activeTime(e) {
        SdkStorage.saveSdk("activeTime", e);
    }

    init(e) {
        var t = this;
        console.log("### SmSdk init###"),
            (this.stat = new Statistics()),
            (this.sdkBundleName = ""),
            console.log("### SdkPkgConfig.Channel ###", SdkPkgConfig.Channel),
            SdkPkgConfig.Channel == ChannelEnum.Weixin
                ? (this.sdkBundleName = "sdkwx")
                : SdkPkgConfig.Channel == ChannelEnum.Toutiao
                ? (this.sdkBundleName = "sdktt")
                : SdkPkgConfig.Channel == ChannelEnum.Kuaishou && (this.sdkBundleName = "sdkks"),
            console.log("### sdkBundleName ###", this.sdkBundleName),
            "" != this.sdkBundleName
                ? assetManager.loadBundle(this.sdkBundleName, function (n, i) {
                      n ? console.log("### smsdk ### load smsdk bundle " + t.sdkBundleName, n) : (t.sdkImp.init(), e && e());
                  })
                : (this.sdkImp.init(), e && e()),
            SdkPkgConfig.UseGravityEngine && assetManager.loadBundle("gravityengine", function (e, t) {}),
            this.autoRecordTime(),
            sdkutils.isNewDay(this.statLastPlayTime) &&
                (this.activeDay++,
                sdkEventManager.emit(SdkInnerEvent.ActiveDays, this.activeDay),
                null == YinLisdk || YinLisdk.avtive_days_gm_ap(this.activeDay)),
            (this.statLastPlayTime = new Date().getTime());
    }
    load(e) {
        var t = this;
        window.SmSdk.initConfig(
            {
                pkgCfg: {},
                gameCfg: {},
            },
            function () {
                console.log("====this.sdkImp", t.sdkImp.name),
                    t.sdkImp.onGameConfigLoadDone(function () {
                        t.stat.init(),
                            (window.SmSdk.localTagId = SdkGameConfig.abRemoteTagId),
                            t.sdkImp.loadRemoteData(function () {
                                SdkGameConfig.isOpenRank && ((t.rankManager = new RankManager()), t.rankManager.init()),
                                    window.SmSdk.initPanel(function () {
                                        window.SmSdk.beforeGameLoad(function () {
                                            return e();
                                        }),
                                            sdkEventManager.emit(SdkInnerEvent.OnPanelUILoadDone);
                                    });
                            });
                    });
            }
        );
    }
    initConfig(e, t) {
        SdkConfig.merge(SdkPkgConfig, e.pkgCfg),
            SdkConfig.print(SdkPkgConfig),
            (this.sdkImp.appid = SdkPkgConfig.appid),
            this.sdkImp.loadGameConfig(function () {
                sdkEventManager.emit(SdkInnerEvent.OnSdkLoadDone), t();
            });
    }
    initPanel(e) {
        var t = this;
        (this.sdkPanel = new SmSdkPanel()),
            assetManager.loadBundle("smsdk", function (n, i) {
                n ? console.log("### smsdk ### load smsdk bundle", n) : t.sdkPanel.initRoot(e);
            });
    }
    loadAssetBundles(e, t) {
        this.sdkImp.loadAssetBundles(e, t);
    }
    beforeGameLoad(e) {
        e();
    }
    onGameLoadDone() {
        console.log("### smsdk ### onGameLoadDone"), sdkEventManager.emit(SdkInnerEvent.OnGameLoadDone);
    }
    exitGame() {
        this.sdkImp.exitGame();
    }
    delAccount() {
        sdkEventManager.emit(SdkInnerEvent.DeleteAccount);
    }
    showReadme() {}
    showRuanzhu() {}
    showBoxAd() {
        this.sdkImp.showBoxAd();
    }
    showLogin() {
        this.sdkImp.showLogin();
    }
    showReturn(e) {
        assetManager.getBundle("smsdk").load("ui/SdkReturnHolder", Prefab, function (t, n) {
            t ? console.error("### 展示快捷方式初始化失败", t) : ((instantiate(n).parent = e), console.log("### showReturn ###"));
        });
    }
    addShortcut() {
        this.sdkImp.addShortcut(
            function () {},
            function () {}
        );
    }
    addCommonUse() {
        this.sdkImp.addCommonUse(
            function () {},
            function () {}
        );
    }
    giveSidebarReward(e) {
        this.getReward = e;
    }
    secondPagePolicy() {
        SdkGameConfig.isShowInterst && window.SmSdk.showIntertitalAd();
    }
    gameResultPolicy() {
        SdkGameConfig.gameResultPopInterst && window.SmSdk.showIntertitalAd();
    }
    rewardVideo(e = "statisticsID") {
        return this.sdkImp.smRewardVideo(e);
    }
    rewardVideoByAdConfirm(e = "statisticsID") {
        return this.sdkImp.executeRewardVideo(e);
    }
    showIntertitalAd() {
        console.log("### smsdk ### showIntertitalAd"), this.sdkImp.showIntertitalAd();
    }
    showBannerAd() {
        this.sdkImp.showBannerAd();
    }
    hideBannerAd() {
        this.sdkImp.hideBannerAd();
    }
    loadNative(e, t) {
        this.sdkImp.loadNative(e, t);
    }
    autoRecordTime() {
        var e = this;
        SysTaskManager.addTimeTask(function () {
            window.SmSdk.stat.cusEvent("stayall"),
                (e.activeTime += 5),
                e.autoRecordTime(),
                sdkEventManager.emit(SdkInnerEvent.ActiveHours, e.activeTime),
                null == YinLisdk || YinLisdk.active_hours_gm_ap(e.activeTime);
        }, 5);
    }
    task(e, t) {
        setTimeout(function () {
            try {
                e();
            } catch (e) {
                console.error("### smsdk ### task err", e);
            }
        }, 1e3 * t);
    }
    schedule(e, t, n) {
        n || (n = t),
            setTimeout(function () {
                try {
                    e();
                } catch (e) {
                    console.error("### smsdk ### schedule err", e);
                }
                setInterval(function () {
                    try {
                        e();
                    } catch (e) {
                        console.error("### smsdk ### task err", e);
                    }
                }, 1e3 * t);
            }, 1e3 * n);
    }
    createGameClubButton(e, t, n?) {
        this.sdkImp.createGameClubButton(e, t, n);
    }
    destroyGameClubButton() {
        this.sdkImp.destroyGameClubButton();
    }
    getPlayerInfo(e) {
        var t = this;
        window.sm.log.debug("进入获取玩家信息函数!"),
            this.savedPlayerName && this.savedPlayerName.length > 0 && this.savedPortrait && this.savedPortrait.length > 0
                ? (window.sm.log.debug("1更新玩家头像, 昵称数据:", this.savedPlayerName, this.savedPortrait),
                  e(this.savedPlayerName, this.savedPortrait))
                : (window.sm.log.debug("开始更新玩家信息"),
                  window.SmSdk.sdkImp.getPlayerInfo(function (n) {
                      (t.savedPlayerName = n.playername),
                          (t.savedPortrait = n.portrait),
                          window.sm.log.debug("2更新玩家头像, 昵称数据:", t.savedPlayerName, t.savedPortrait),
                          e(t.savedPlayerName, t.savedPortrait);
                  }));
    }
}

window.SmSdk = new SmSdk();
