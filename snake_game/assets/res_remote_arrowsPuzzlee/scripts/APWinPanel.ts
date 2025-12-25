import { _decorator, UIOpacity, ParticleSystem, tween } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APEResId, APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APCommonPanel } from "./APCommonPanel";

const { ccclass } = _decorator;
@ccclass("APWinPanel")
export class APWinPanel extends BasePanel {
    rootNode: any;
    btnShare: any;
    btnNext: any;
    rewardPower: any;
    winTips: any;
    winTipsOpacity: any;
    winEffect1: any;
    winEffect2: any;
    get layer() {
        return window.sm.ui.layer_top;
    }

    get panelId() {
        return APPanelId.APWinPanel;
    }

    init() {
        smtools.click(this.node, "btnClose", this.close, this),
            (this.rootNode = smtools.find(this.node, "panel")),
            (this.rootNode.active = false),
            (this.btnShare = smtools.click(this.node, "btnShare", this.onShare, this)),
            (this.btnNext = smtools.click(this.node, "btnNext", this.onBtnNext, this)),
            (this.rewardPower = smtools.find(this.node, "rewardPower")),
            (this.rewardPower.active = APGameConfig.powerSysOn),
            (this.winTips = smtools.find(this.node, "winTips")),
            (this.winTipsOpacity = smtools.find(this.node, "winTips", UIOpacity)),
            (this.winEffect1 = smtools.find(this.node, "winEffect1", ParticleSystem)),
            (this.winEffect2 = smtools.find(this.node, "winEffect2", ParticleSystem)),
            (this.btnShare.active = !APGameConfig.isShiWan);
    }
    showThis() {
        (window.btl_ap.ctrl.firstInGame = true),
            (this.rootNode.active = true),
            window.sm.ui.open(APCommonPanel),
            window.SmSdk.gameResultPolicy(),
            APGameConfig.powerSysOn && window.gm_ap.player.addItem(APEResId.Power, 1);
    }
    onClose() {
        window.sm.ui.close(APCommonPanel), (this.rootNode.active = false);
    }
    winTipsAni() {
        var e = this;
        this.winEffect1.play(),
            this.winEffect2.play(),
            (this.winTips.active = true),
            (this.winTipsOpacity.opacity = 0),
            tween(this.winTipsOpacity)
                .to(1, {
                    opacity: 250,
                })
                .call(function () {
                    e.winTips.active = false;
                })
                .start();
    }
    onShare() {
        window.SmSdk.sdkImp.shareAppMessage(
            function () {},
            function () {}
        );
    }
    onBtnNext() {
        window.btl_ap.ctrl.curStageItem.onRestart(), this.close();
    }
}
