import { _decorator, Node, Vec3, Vec2, Input, Slider, Label, UITransform, Size } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { SdkPkgConfig } from "../../start-scene/scripts/SdkConfig";
import { sdkhttp } from "../../start-scene/scripts/SdkHttp";
import { APEResId, APADCusEvent, APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APAdPopPanel } from "./APAdPopPanel";
import { APCommonPanel } from "./APCommonPanel";
import { APDebugPanel } from "./APDebugPanel";
import { APFeedbackPanel } from "./APFeedbackPanel";
import { APGamePanel } from "./APGamePanel";
import { APMenuPanel } from "./APMenuPanel";

const { ccclass, property } = _decorator;

@ccclass("APSettingPanel")
export class APSettingPanel extends BasePanel {
    @property(Node)
    panelUI = null;

    originPos = new Vec3(0, -53, 0);
    originUISize = new Vec2(603, 800);
    menuPos = new Vec3(0, 65, 0);
    menuUISize = new Vec2(603, 600);
    debugTimer = 5;
    isPayPower = false;
    btnSound: any;
    btnMusic: any;
    btnVibration: any;
    copyOpenId: any;
    debugArea: any;
    cameraSlider: any;
    labOpenId: any;
    lbaOpenIdTxt: any;
    btnRestart: any;
    btnBack: any;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APSettingPanel;
    }

    init() {
        var t = this;
        this.btnSound = smtools.click(this.node, "btnSound", this.onClickAudio, this);
        this.btnMusic = smtools.click(this.node, "btnMusic", this.onClickMusic, this);
        this.btnVibration = smtools.click(this.node, "btnVibration", this.onClickShake, this);
        this.copyOpenId = smtools.click(
            this.node,
            "copyOpenId",
            function () {
                window.SmSdk.sdkImp.copyTxt(window.SmSdk.savedOpenid);
            },
            this
        );
        smtools.click(this.node, "btn_feedback", function () {
            window.sm.ui.open(APFeedbackPanel);
        });
        this.copyOpenId.active = false;
        smtools.click(
            this.node,
            "btnClose",
            () => {
                var n;
                super.close.call(t),
                    null == (n = window.sm.ui.panel(APMenuPanel)) || n.refreshCircle(),
                    window.sm.ui.panel(APGamePanel) && window.sm.ui.panel(APGamePanel).node.active && window.sm.ui.close(APCommonPanel);
            },
            this
        ),
            this.onUpdateUI(),
            (this.debugArea = smtools.find(this.node, "debugArea")),
            this.debugArea.on(Input.EventType.TOUCH_START, this.onDebugOn, this),
            (this.cameraSlider = smtools.find(this.node, "cameraZoom", Slider)),
            this.cameraSlider.node.on("slide", this.onSlider, this),
            (this.labOpenId = smtools.find(this.node, "labOpenId")),
            this.labOpenId &&
                ((this.lbaOpenIdTxt = this.labOpenId.getComponent(Label)), smtools.click(this.node, "labOpenId", function () {}, this)),
            (this.labOpenId.active = false),
            this.lbaOpenIdTxt && (this.lbaOpenIdTxt.string = window.SmSdk.savedOpenid),
            (this.btnRestart = smtools.click(
                this.node,
                "btnRestart",
                function () {
                    var e;
                    (APGameConfig.powerSysOn && !t.tryToBegin()) || null == (e = window.btl_ap.ctrl.curStageItem) || e.onRestart();
                },
                this
            )),
            (this.btnBack = smtools.click(
                this.node,
                "btnMenu",
                function () {
                    window.btl_ap.ctrl.backToMenu(function () {
                        t.close();
                    });
                },
                this
            ));
        var n,
            i = Math.max(0.5, Math.min(5, window.gm_ap.player.sensitivity || 1));
        (n = i <= 1 ? ((i - 0.5) / 0.5) * 0.5 : 0.5 + ((i - 1) / 4) * 0.5), (this.cameraSlider.progress = n);
    }
    onShow() {
        var e;
        null == (e = window.sm.ui.panel(APMenuPanel)) || e.refreshCircle(),
            window.sm.ui.open(APCommonPanel),
            APGameConfig.isMenuPanelOpen
                ? ((this.panelUI.position = this.menuPos),
                  this.panelUI.getComponent(UITransform).setContentSize(new Size(this.menuUISize.x, this.menuUISize.y)),
                  (this.btnBack.active = false),
                  (this.btnRestart.active = false))
                : ((this.panelUI.position = this.originPos),
                  this.panelUI.getComponent(UITransform).setContentSize(new Size(this.originUISize.x, this.originUISize.y)),
                  (this.btnBack.active = true),
                  (this.btnRestart.active = true)),
            window.SmSdk.secondPagePolicy(),
            (this.isPayPower = false);
    }
    onDebugOn() {
        var e = this;
        if (window.SmSdk.sdkImp.openDebug)
            window.sm.ui.open(APDebugPanel).then(function () {
                (e.copyOpenId.active = true), (e.labOpenId.active = true);
            });
        else {
            var t,
                n = null == (t = window.ccWxSdk) ? void 0 : t.CheckFreeAd();
            window.sm.log.debug("### CheckFreeAd ### ", n),
                n
                    ? window.sm.ui.open(APAdPopPanel).then(function () {})
                    : sdkhttp.requestv4(
                          "https://api.sm0.fun/v2/ucheck/" + SdkPkgConfig.gameid + "/" + window.SmSdk.savedOpenid,
                          function (t) {
                              console.log("### 获取远程回调服务成功 ### "),
                                  (e.copyOpenId.active = true),
                                  (e.labOpenId.active = true),
                                  window.sm.log.debug("### data ### ", t),
                                  1 == t && window.sm.ui.open(APDebugPanel).then(function () {});
                          }
                      );
        }
    }
    onClickShake() {
        window.SmSdk.isVibrate ? (window.SmSdk.isVibrate = false) : (window.SmSdk.isVibrate = true), this.onUpdateUI();
    }
    onClickAudio() {
        1 == window.gm.account.soundVolume ? (window.gm.account.soundVolume = 0) : (window.gm.account.soundVolume = 1), this.onUpdateUI();
    }
    onClickMusic() {
        1 == window.gm.account.musicVolume ? (window.gm.account.musicVolume = 0) : (window.gm.account.musicVolume = 1),
            window.sm.audio.setMusicVolume(window.gm.account.musicVolume),
            this.onUpdateUI();
    }
    onUpdateUI() {
        1 == window.gm.account.soundVolume
            ? ((this.btnSound.children[0].active = true), (this.btnSound.children[1].active = false))
            : ((this.btnSound.children[1].active = true), (this.btnSound.children[0].active = false)),
            window.SmSdk.isVibrate
                ? ((this.btnVibration.children[0].active = true), (this.btnVibration.children[1].active = false))
                : ((this.btnVibration.children[1].active = true), (this.btnVibration.children[0].active = false)),
            1 == window.gm.account.musicVolume
                ? ((this.btnMusic.children[0].active = true), (this.btnMusic.children[1].active = false))
                : ((this.btnMusic.children[1].active = true), (this.btnMusic.children[0].active = false));
    }
    tryToBegin(e?) {
        if (APGameConfig.powerSysOn)
            return (
                !!this.isPayPower ||
                (window.gm_ap.player.itemCount(APEResId.Power) <= 0
                    ? (window.sm.ui.open(APAdPopPanel).then(function (t) {
                          t.setUI(APADCusEvent.AD_AddPower), e && e();
                      }),
                      false)
                    : ((this.isPayPower = true), window.gm_ap.player.decItem(APEResId.Power, 1), true))
            );
    }
    onSlider() {
        var e,
            t = this.cameraSlider.progress;
        (e = t <= 0.5 ? 0.5 + 2 * t * 0.5 : 1 + 2 * (t - 0.5) * 4), (window.gm_ap.player.sensitivity = e);
    }
}
