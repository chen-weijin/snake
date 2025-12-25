import { _decorator, Label, tween, Vec3 } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { GiftType } from "../../start-scene/scripts/BaseSdk";
import { sdkEventManager, SdkInnerEvent } from "../../start-scene/scripts/SdkEventManager";
import { APADCusEvent, APEResId, APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APAdPopPanel } from "./APAdPopPanel";
import { APCommonPanel } from "./APCommonPanel";

const { ccclass } = _decorator;
@ccclass("APRevivePanel")
export class APRevivePanel extends BasePanel {
    reviveType = "hp";
    isPayPower = false;
    panelBg: any;
    reviveContent: any;
    restartContent: any;
    btnRevive: any;
    btnNo: any;
    btnRestart: any;
    btnMenu: any;
    icon_hp: any;
    icon_time: any;
    lbl_count: any;

    get layer() {
        return window.sm.ui.layer_top;
    }

    get panelId() {
        return APPanelId.APRevivePanel;
    }

    init() {
        var e = this;
        (this.panelBg = smtools.find(this.node, "panelBg")),
            (this.reviveContent = smtools.find(this.node, "reviveContent")),
            (this.restartContent = smtools.find(this.node, "restartContent")),
            (this.btnRevive = smtools.click(this.node, "btnRevive", this.onBtnRevive, this)),
            (this.btnNo = smtools.click(this.node, "btnNo", this.swtichContent, this)),
            (this.btnRestart = smtools.click(this.node, "btnRestart", this.onRestart, this)),
            smtools.click(this.node, "btnClose", this.swtichContent, this),
            (this.btnMenu = smtools.click(this.node, "btnMenu", function () {
                window.btl_ap.ctrl.backToMenu(function () {
                    e.close();
                });
            })),
            (this.icon_hp = smtools.find(this.node, "heart_on")),
            (this.icon_time = smtools.find(this.node, "clock")),
            (this.lbl_count = smtools.find(this.node, "lbl_count", Label)),
            smtools.click(this.node, "btn_share", function () {
                window.SmSdk.sdkImp.shareAppMessage(
                    function () {
                        0 == window.SmSdk.sdkImp.getCurGiftPro(GiftType.share) && window.SmSdk.sdkImp.setGiftPro(GiftType.share, 1);
                    },
                    function () {}
                );
            });
    }
    onShow() {
        window.sm.ui.open(APCommonPanel),
            (this.reviveContent.active = true),
            (this.restartContent.active = false),
            window.SmSdk.gameResultPolicy(),
            (this.isPayPower = false);
    }
    onClose() {
        window.sm.ui.close(APCommonPanel);
    }
    swtichContent() {
        var e = this;
        tween(this.panelBg)
            .to(
                0.25,
                {
                    scale: new Vec3(0.1, 0.1, 0.1),
                },
                {
                    easing: "linear",
                }
            )
            .call(function () {
                (e.reviveContent.active = !e.reviveContent.active), (e.restartContent.active = !e.restartContent.active);
            })
            .to(
                0.25,
                {
                    scale: new Vec3(1, 1, 1),
                },
                {
                    easing: "linear",
                }
            )
            .start();
    }
    onBtnRevive() {
        var e = this;
        window.sm.ui.close(APCommonPanel);
        var t = "hp" === this.reviveType ? APADCusEvent.AD_ReviveHp : APADCusEvent.AD_ReviveTime;
        window.SmSdk.rewardVideo(t).then(function () {
            window.btl_ap.ctrl.curStageItem.onRevive(e.reviveType), e.close();
        });
    }
    onRestart() {
        (APGameConfig.powerSysOn && !this.tryToBegin()) ||
            (window.sm.ui.close(APCommonPanel),
            window.btl_ap.ctrl.curStageItem.onRestart(),
            this.close(),
            console.log("### shibai"),
            sdkEventManager.emit(SdkInnerEvent.FailLevel));
    }
    setInfo(e) {
        (this.reviveType = e),
            (this.icon_hp.active = "hp" === e),
            (this.icon_time.active = "time" === e),
            (this.lbl_count.string = "hp" === e ? "+" + APGameConfig.reviveHp : "+120");
    }
    tryToBegin() {
        if (APGameConfig.powerSysOn)
            return (
                !!this.isPayPower ||
                (window.gm_ap.player.itemCount(APEResId.Power) <= 0
                    ? (window.sm.ui.open(APAdPopPanel).then(function (e) {
                          return e.setUI(APADCusEvent.AD_AddPower);
                      }),
                      false)
                    : ((this.isPayPower = true), window.gm_ap.player.decItem(APEResId.Power, 1), true))
            );
    }
}
