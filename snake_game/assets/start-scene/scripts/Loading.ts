import { _decorator, game, sys, view, ResolutionPolicy, Sprite, Label, find, Component } from "cc";
import SmSdk from "./SmSdk";
import { YinLisdk } from "./YinLisdk";
import { SdkGameConfig } from "./SdkConfig";
import { sdktools } from "./SdkTools";
import { smtime } from "./SmTime";
import smtools from "./SmTools";
import { MapManager } from "./MapManager";
import TableManager from "./TableManager";

const { ccclass } = _decorator;
@ccclass("Loading")
export default class Loading extends Component {
    static instance;

    isDestory = false;
    isWaitLoading = false;
    loadTime = 0;
    loadProgress;
    lbl_loading;
    logo;
    onLoad() {
        SmSdk;
        var e = this;
        game.frameRate = 59;

        if ("DESKTOP_BROWSER" == sys.platform) {
            view.setResolutionPolicy(ResolutionPolicy.EXACT_FIT);
        } else if ("MOBILE_BROWSER" == sys.platform) {
            view.setResolutionPolicy(ResolutionPolicy.FIXED_WIDTH);
        }

        this.loadTime = smtime.nowms();
        Loading.instance = this;
        this.loadProgress = smtools.find(this.node, "loadingBar", Sprite);
        this.lbl_loading = smtools.find(this.node, "lbl_loading", Label);
        this.logo = smtools.find(this.node, "logo", Sprite);

        console.log(`smile--- window.sm---> `, window.sm);

        window.sm.baseInit(function () {
            window.sm.init();
            console.log(`smile---window.SmSdk---> `, window.SmSdk);
            window.SmSdk.stat.loginStart();
            window.gm.account.guideSm(50502);
            console.log("*********开始加载计时");
            e._loadAssetBundles();
            0 == window.gm.account.firstPlayTime && (window.gm.account.firstPlayTime = smtime.nowms());
            YinLisdk.Loading_gm_ap();
            "" != SdkGameConfig.mainLogoUrl &&
                window.sm.res.loadRemoteSprite(SdkGameConfig.mainLogoUrl).then(function (t) {
                    e.logo.spriteFrame = t;
                });

            if (SdkGameConfig.ruanzhuInfo) {
                var t = sdktools.find(e.node, "ruanzhuInfo", Label);
                SdkGameConfig.ruanzhuInfo && t && (t.string = SdkGameConfig.ruanzhuInfo);
            }
        });
    }
    setPro(e) {
        this.isDestory || ((this.loadProgress.fillRange = e), (this.lbl_loading.string = (100 * e).toFixed(1) + "%"));
    }
    _loadAssetBundles() {
        var e = this;
        window.SmSdk.loadAssetBundles(
            function () {
                e.setPro(0.35);
                e._loadTable();
            },
            function (t) {
                e.setPro(0.25 + 0.1 * t);
            }
        );
    }
    _loadTable() {
        window.sm.event.on(TableManager.DataLoadedEvent, this.onTableLoad, this);
        TableManager.instance().loadData();
    }
    onTableLoad(e, t) {
        this.setPro((e / t) * 0.2 + 0.3),
            e >= t &&
                (window.sm.event.off(TableManager.DataLoadedEvent, this.onTableLoad, this),
                this.onLoadDone(),
                window.SmSdk.stat.loginSuccess());
    }
    onLoadDone() {
        window.gm.account.playTimes++;
        window.SmSdk.onGameLoadDone();
        smtools.find(find("game_controller"), "mapManager").getComponent(MapManager).init();
        window.btl.ctrl.init();
        window.SmSdk.hasReadme ? window.btl.ctrl.enterMiniGame("arrowsPuzzlee", "res_remote_arrowsPuzzlee") : window.SmSdk.showReadme();
    }
    hideLoadingPanel() {
        console.log("hide"),
            this.isDestory ||
                (window.gm.account.guideSm(50503),
                (this.isDestory = true),
                (this.node.active = false),
                this.node.destroy(),
                console.log("Destory"));
    }
}
