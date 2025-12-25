import { _decorator, instantiate, Component } from "cc";
import Loading from "../../start-scene/scripts/Loading";
import { smtime } from "../../start-scene/scripts/SmTime";
import { SdkGameConfig } from "../../start-scene/scripts/SdkConfig";
import { sdkEventManager, SdkInnerEvent } from "../../start-scene/scripts/SdkEventManager";
import { YinLisdk } from "../../start-scene/scripts/YinLisdk";
import { APEGuideStep, APCusEvent } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APStageItem } from "./APStageItem";
import { APCommonPanel } from "./APCommonPanel";
import { APGamePanel } from "./APGamePanel";
import { APMenuPanel } from "./APMenuPanel";

const { ccclass, property } = _decorator;

@ccclass("ArrowsPuzzleeCtrl")
export class ArrowsPuzzleeCtrl extends Component {
    @property(APStageItem)
    curStageItem = null;

    firstInGame = true;

    static instance = null;

    start() {
        ArrowsPuzzleeCtrl.instance || (ArrowsPuzzleeCtrl.instance = this),
            window.gm_ap.skin.onManagerInit(),
            window.gm_ap.level.onManagerInit(),
            window.gm_ap.player.onManagerInit(),
            window.gm_ap.mat.onManagerInit(),
            window.gm_ap.level.getCurShiWanData();
    }
    init() {
        ArrowsPuzzleeCtrl.instance || (ArrowsPuzzleeCtrl.instance = this),
            window.gm_ap.player.curGuideStep !== APEGuideStep.End &&
                0 === window.gm_ap.level.levelIdx &&
                (window.gm_ap.player.curGuideStep = APEGuideStep.ClickGuide1),
            window.sm.ui.open(APCommonPanel),
            APGameConfig.isShiWan
                ? ((APGameConfig.powerSysOn = false), window.btl_ap.ctrl.loadStage())
                : 0 != window.gm_ap.level.levelIdx
                ? window.sm.ui.open(APMenuPanel).then(function () {
                      Loading.instance.hideLoadingPanel();
                  })
                : window.btl_ap.ctrl.loadStage(),
            window.sm.audio.playMusic("Saint_Valentine_Mix_C48kbps"),
            sdkEventManager.on(SdkInnerEvent.OnRewardADSuccess, this.onCusEvent, this),
            sdkEventManager.on(
                SdkInnerEvent.OnRewardADSuccessSdk,
                function (e, t) {
                    console.log("### 当前关卡数：gm_ap.level.levelIdx + 1：", window.gm_ap.level.levelIdx + 1),
                        console.log("### videoSrc：", e),
                        YinLisdk.AdWatchFinish_gm_ap(e, window.gm_ap.level.levelIdx + 1);
                },
                this
            ),
            sdkEventManager.on(
                SdkInnerEvent.OnRewardADStartSdk,
                function (e) {
                    console.log("### 当前关卡数：gm_ap.level.levelIdx + 1：", window.gm_ap.level.levelIdx + 1),
                        console.log("### videoSrc：", e),
                        YinLisdk.AdWatchClick_gm_ap(e, window.gm_ap.level.levelIdx + 1);
                },
                this
            ),
            sdkEventManager.on(
                SdkInnerEvent.NewUserEnterGame,
                function () {
                    YinLisdk.NewUserEnterGame_gm_ap();
                },
                this
            ),
            sdkEventManager.on(
                SdkInnerEvent.UserEnterLevel,
                function () {
                    YinLisdk.EnterLevel_gm_ap(window.gm_ap.level.levelIdx + 1);
                },
                this
            ),
            sdkEventManager.on(
                SdkInnerEvent.FinishLevel,
                function () {
                    YinLisdk.FinishLevel_gm_ap(window.gm_ap.level.levelIdx + 1),
                        (window.gm_ap.level.levelIdx + 1) % 3 != 0 ||
                            SdkGameConfig.hasShownRecommend ||
                            (console.log("### show FinishLevel_gm_ap"), window.SmSdk.sdkImp.showRecommend());
                },
                this
            ),
            sdkEventManager.on(
                SdkInnerEvent.FailLevel,
                function () {
                    YinLisdk.FailLevel_gm_ap(window.gm_ap.level.levelIdx + 1);
                },
                this
            );
    }
    onCusEvent() {
        window.SmSdk.stat.cusEvent(APCusEvent.LevelAdCount + (window.gm_ap.level.levelIdx + 1).toString().padStart(4, "0"));
    }
    loadStage() {
        var e = this;
        null == this.curStageItem
            ? window.sm.res.loadPrefab("prefab/APStageItem").then(function (t) {
                  window.sm.ui.close(APMenuPanel), window.sm.ui.close(APCommonPanel);
                  var n = instantiate(t);
                  n.parent = window.btl.map.itemHolder;
                  var i,
                      o = n.getComponent(APStageItem);
                  o.init(),
                      (e.curStageItem = o),
                      APGameConfig.powerSysOn &&
                          0 == window.gm.account.powerStartResumeTime &&
                          ((window.gm.account.powerStartResumeTime = smtime.now()),
                          null == (i = window.sm.ui.panel(APCommonPanel)) || i.calResumePower());
              })
            : ((this.curStageItem.node.active = true),
              this.curStageItem.init(),
              window.sm.ui.close(APMenuPanel),
              window.sm.ui.close(APCommonPanel));
    }
    backToMenu(e?) {
        var t = this;

        window.sm.ui.open(APMenuPanel).then(function (n) {
            (t.curStageItem.node.active = false), t.curStageItem.clear(), e && e(), window.sm.ui.close(APGamePanel);
        }),
            window.sm.ui.open(APCommonPanel);
    }
}
