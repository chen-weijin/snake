import { _decorator, Label, Sprite } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { ChannelEnum } from "../../start-scene/scripts/PlatConst";
import { SdkPkgConfig, SdkGameConfig } from "../../start-scene/scripts/SdkConfig";
import { APEResId, APADCusEvent, APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APAdPopPanel } from "./APAdPopPanel";
import { APCommonPanel } from "./APCommonPanel";
import { APFreePanel } from "./APFreePanel";
import { APGamePanel } from "./APGamePanel";
import APRankPanel from "./APRankPanel";
import { APSettingPanel } from "./APSettingPanel";
import { APSkinPanel } from "./APSkinPanel";

const { ccclass } = _decorator;
@ccclass("APMenuPanel")
export class APMenuPanel extends BasePanel {
    isInfoCreate = false;
    isCircleCreate = false;
    isPayPower = false;
    btnPlay: any;
    lbl_level: any;
    btnSkin: any;
    btnSetting: any;
    btnFree: any;
    logo: any;
    btnRank: any;
    btnCircle: any;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APMenuPanel;
    }

    init() {
        var e = this;
        (this.btnPlay = smtools.click(this.node, "btnPlay", this.onPlay, this)),
            (this.lbl_level = smtools.find(this.node, "lbl_level", Label)),
            (this.btnSkin = smtools.click(this.node, "btnSkin", this.onSkin, this)),
            (this.btnSetting = smtools.click(this.node, "btnSetting", this.openSettingPanel, this)),
            (this.btnFree = smtools.click(
                this.node,
                "btnfree",
                function () {
                    return window.sm.ui.open(APFreePanel);
                },
                this
            )),
            (this.btnFree.active = SdkPkgConfig.Channel == ChannelEnum.Weixin),
            (this.logo = smtools.find(this.node, "logo", Sprite)),
            (this.btnRank = smtools.click(
                this.node,
                "btnRank",
                function () {
                    SdkPkgConfig.Channel == ChannelEnum.Weixin
                        ? "" != window.SmSdk.savedPlayerName &&
                          window.SmSdk.sdkImp.getPlayerInfo(function () {
                              var e, t;
                              null == (e = window.SmSdk.rankManager) || e.report("rank_total", window.gm_ap.level.levelIdx),
                                  null == (t = window.SmSdk.rankManager) || t.report("rank_day", window.gm_ap.level.dayLevel),
                                  window.sm.ui.open(APRankPanel).then(function (e) {
                                      e.generateUI();
                                  });
                          })
                        : (SdkPkgConfig.Channel == ChannelEnum.Toutiao || SdkPkgConfig.Channel == ChannelEnum.Kuaishou) &&
                          window.SmSdk.sdkImp.getPlayerInfo(function () {
                              var e, t;
                              null == (e = window.SmSdk.rankManager) || e.report("rank_total", window.gm_ap.level.levelIdx),
                                  null == (t = window.SmSdk.rankManager) || t.report("rank_day", window.gm_ap.level.dayLevel),
                                  window.sm.ui.open(APRankPanel).then(function (e) {
                                      e.generateUI();
                                  });
                          });
                },
                this
            )),
            (this.btnRank.active = SdkGameConfig.isOpenRank),
            (this.btnCircle = smtools.find(this.node, "btnCircle")),
            (this.btnCircle.active = SdkGameConfig.isOpenCircle && SdkPkgConfig.Channel == ChannelEnum.Weixin),
            "" != SdkGameConfig.mainLogoUrl &&
                window.sm.res.loadRemoteSprite(SdkGameConfig.mainLogoUrl).then(function (t) {
                    e.logo.spriteFrame = t;
                }),
            0 == this.btnFree.active && (this.btnRank.worldPosition = this.btnFree.worldPosition),
            window.gm_ap.mat.loadSkin(),
            this.refreshCircle(),
            (SdkPkgConfig.Channel != ChannelEnum.Toutiao && SdkPkgConfig.Channel != ChannelEnum.Kuaishou) ||
                window.SmSdk.showReturn(this.node);
    }
    refreshCircle() {
        SdkPkgConfig.Channel == ChannelEnum.Weixin &&
            (this.node.active
                ? (window.sm.ui.panel(APGamePanel) && window.sm.ui.panel(APGamePanel).node.active) ||
                  (window.sm.ui.panel(APSettingPanel) && window.sm.ui.panel(APSettingPanel).node.active) ||
                  (window.sm.ui.panel(APSkinPanel) && window.sm.ui.panel(APSkinPanel).node.active) ||
                  (window.sm.ui.panel(APFreePanel) && window.sm.ui.panel(APFreePanel).node.active)
                    ? this.destroyButton()
                    : (SdkGameConfig.isOpenRank &&
                          ("" != window.SmSdk.savedPlayerName || this.isInfoCreate
                              ? "" != window.SmSdk.savedPlayerName &&
                                this.isInfoCreate &&
                                (SdkGameConfig.isShowDebugLog && console.log("销毁授权"),
                                (this.isInfoCreate = false),
                                window.SmSdk.sdkImp.destroyUserInfoButton())
                              : (SdkGameConfig.isShowDebugLog && console.log("创建授权"),
                                (this.isInfoCreate = true),
                                window.SmSdk.sdkImp.createUserInfoButton(this.btnRank))),
                      SdkGameConfig.isOpenCircle &&
                          SdkPkgConfig.Channel == ChannelEnum.Weixin &&
                          (this.isCircleCreate ||
                              ((this.isCircleCreate = true),
                              SdkGameConfig.isShowDebugLog && console.log("创建游戏圈授权"),
                              window.SmSdk.createGameClubButton(this.node, this.btnCircle))))
                : this.destroyButton());
    }
    destroyButton() {
        SdkGameConfig.isOpenRank &&
            this.isInfoCreate &&
            (SdkGameConfig.isShowDebugLog && console.log("销毁授权"),
            (this.isInfoCreate = false),
            window.SmSdk.sdkImp.destroyUserInfoButton()),
            SdkGameConfig.isOpenCircle &&
                this.isCircleCreate &&
                SdkPkgConfig.Channel == ChannelEnum.Weixin &&
                (SdkGameConfig.isShowDebugLog && console.log("销毁游戏圈授权"),
                (this.isCircleCreate = false),
                window.SmSdk.destroyGameClubButton());
    }
    onShow() {
        this.lbl_level && (this.lbl_level.string = "第 " + (window.gm_ap.level.levelIdx + 1).toString() + " 关"),
            this.refreshCircle(),
            (APGameConfig.isMenuPanelOpen = true),
            (this.isPayPower = false);
    }
    onPlay() {
        (APGameConfig.powerSysOn && !this.tryToBegin()) || window.btl_ap.ctrl.loadStage();
    }
    onSkin() {
        window.sm.ui.open(APSkinPanel);
    }
    openSettingPanel() {
        window.sm.ui.open(APSettingPanel), window.sm.ui.open(APCommonPanel);
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
    close() {
        super.close.call(this), (APGameConfig.isMenuPanelOpen = false);
    }
}
