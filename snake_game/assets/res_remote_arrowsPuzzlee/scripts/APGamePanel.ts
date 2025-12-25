import { _decorator, tween, instantiate, Label, Slider, UIOpacity } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { TaskManager } from "../../start-scene/scripts/TaskManager";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APEResId, APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APCommonPanel } from "./APCommonPanel";
import { APGuidePanel } from "./APGuidePanel";
import { APMenuPanel } from "./APMenuPanel";
import { APSettingPanel } from "./APSettingPanel";

const { ccclass } = _decorator;
@ccclass("APGamePanel")
export class APGamePanel extends BasePanel {
    hpNodes_on = [];
    isInit = false;
    countdownTime = 0;
    hpContainer: any;
    btnRetry: any;
    lbl_level: any;
    countdownNode: any;
    lbl_countdown: any;
    btnSetting: any;
    zoomSlider: any;
    moveError: any;
    topBg: any;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APGamePanel;
    }

    init() {
        this.initPanel();
    }

    async initPanel() {
        var t = this;
        const i = await window.sm.res.loadPrefab("uiPrefab/gamebottom");
        const o = await window.sm.res.loadPrefab("uiPrefab/gametop");
        const a = await window.sm.res.loadPrefab("uiPrefab/gameitem");

        instantiate(i).setParent(this.node),
            instantiate(o).setParent(this.node),
            (this.hpContainer = smtools.find(this.node, "hpContainer")),
            this.hpContainer.children.forEach(function (e) {
                t.hpNodes_on.push(e.children[1]);
            }),
            (this.btnRetry = smtools.click(
                this.node,
                "btnRetry",
                function () {
                    window.btl_ap.ctrl.curStageItem.onRestart();
                },
                this
            )),
            (this.lbl_level = smtools.find(this.node, "lbl_level", Label)),
            (this.countdownNode = smtools.find(this.node, "countdownNode")),
            (this.lbl_countdown = smtools.find(this.node, "lbl_countDown", Label)),
            (this.countdownNode.active = false),
            (this.btnSetting = smtools.click(this.node, "btnSetting", this.openSettingPanel, this)),
            (this.zoomSlider = smtools.find(this.node, "zoom", Slider)),
            this.zoomSlider.node.on("slide", this.onSlider, this),
            (this.moveError = smtools.find(this.node, "moveError", UIOpacity)),
            (this.topBg = smtools.find(this.node, "topBg")),
            (this.isInit = true),
            (this.btnSetting.active = !APGameConfig.isShiWan),
            this.refreshUI_level();
    }

    onShow() {
        var e,
            t = this;
        this.isInit
            ? (null == (e = window.sm.ui.panel(APMenuPanel)) || e.refreshCircle(),
              (this.zoomSlider.node.active = window.gm_ap.level.levelIdx > 0),
              this.refreshUI_zoomSlider(window.btl_ap.ctrl.curStageItem.stageCamera.camera.orthoHeight),
              window.SmSdk.giveSidebarReward(function () {
                  window.gm_ap.player.addItem(APEResId.Power, 3);
              }))
            : TaskManager.addNormalTimeTask(function () {
                  t.onShow();
              }, 0.1);
    }
    onClose() {
        var e;
        null == (e = window.sm.ui.panel(APMenuPanel)) || e.refreshCircle();
    }
    refreshUI_level() {
        var e = this;
        if (this.isInit) {
            if (((this.lbl_level.string = "关卡" + window.gm_ap.level.getLevelNum().toString()), APGameConfig.isShiWan)) {
                var t = window.gm_ap.level.getCurShiWanData();
                this.hpContainer.active = t.limitHeart;
            }
        } else
            TaskManager.addNormalTimeTask(function () {
                e.refreshUI_level();
            }, 0.1);
    }
    refreshUI_hp(e) {
        var t = this;
        if (this.isInit) {
            if ((console.log("refreshUI_hp"), !(this.hpNodes_on.length <= 0)))
                for (var n = 0; n < this.hpNodes_on.length; n++) this.hpNodes_on[n].active = n < e;
        } else
            TaskManager.addNormalTimeTask(function () {
                t.refreshUI_hp(e);
            }, 0.1);
    }
    startCountdown(e) {
        if (APGameConfig.gameCountDownOn && 0 != window.gm_ap.level.levelIdx) {
            this.stopCountdown(), APGameConfig.isShiWan || (this.countdownNode.active = true);
            var t = Date.now();
            (this.countdownTime = t + 1e3 * e), this.updateCountdown(), this.schedule(this.updateCountdown, 1);
        }
    }
    updateCountdown() {
        if (!APGameConfig.isShiWan) {
            var e = Date.now(),
                t = this.countdownTime - e;
            if (t <= 0)
                return (
                    (this.lbl_countdown.string = "0m0s"),
                    this.unschedule(this.updateCountdown),
                    void window.btl_ap.ctrl.curStageItem.onLose("time")
                );
            var n = Math.floor(t / 1e3) % 60,
                i = Math.floor(t / 6e4);
            this.lbl_countdown.string = i + "m" + n + "s";
        }
    }
    stopCountdown() {
        this.unschedule(this.updateCountdown), (this.countdownNode.active = false);
    }
    close() {
        this.stopCountdown(), super.close.call(this);
    }
    onSlider() {
        var e,
            t,
            n = window.btl_ap.ctrl.curStageItem.stageCamera.minOrthoHeight,
            i = n + (window.btl_ap.ctrl.curStageItem.stageCamera.maxOrthoHeight - n) * (1 - this.zoomSlider.progress);
        (window.btl_ap.ctrl.curStageItem.stageCamera.camera.orthoHeight = i),
            null != (e = window.sm.ui.panel(APGuidePanel)) &&
                e.zoomGuideIng &&
                (null == (t = window.sm.ui.panel(APGuidePanel)) || t.setZoomGuide(false, true));
    }
    changeSlider(e) {
        (this.zoomSlider.progress += e),
            (this.zoomSlider.progress = Math.max(0, this.zoomSlider.progress)),
            (this.zoomSlider.progress = Math.min(1, this.zoomSlider.progress)),
            this.onSlider();
    }
    refreshUI_zoomSlider(e) {
        var t = this;
        if (this.isInit) {
            var n = window.btl_ap.ctrl.curStageItem.stageCamera.minOrthoHeight,
                i = window.btl_ap.ctrl.curStageItem.stageCamera.maxOrthoHeight,
                o = (i - e) / (i - n);
            this.zoomSlider.progress = Math.max(0, Math.min(1, o));
        } else
            TaskManager.addNormalTimeTask(function () {
                t.refreshUI_zoomSlider(e);
            }, 0.1);
    }
    moveErrorAni() {
        (this.moveError.node.active = true),
            tween(this.moveError)
                .to(0.5, {
                    opacity: 150,
                })
                .to(0.5, {
                    opacity: 0,
                })
                .union()
                .start();
    }
    openSettingPanel() {
        window.sm.ui.open(APSettingPanel), window.sm.ui.open(APCommonPanel);
    }
}
