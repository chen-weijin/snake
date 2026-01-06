import { _decorator, Label, Sprite } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { ChannelEnum } from "../../start-scene/scripts/PlatConst";
import { SdkPkgConfig, SdkGameConfig } from "../../start-scene/scripts/SdkConfig";
import { RankManager } from "../../start-scene/scripts/RankManager";
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
    btnTestScore: any;

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
                    console.log("点击排行榜按钮");
                    if (!window.SmSdk.rankManager) {
                        console.log("rankManager 未初始化，等待初始化...");
                        var self = this;
                        setTimeout(function() {
                            console.log("检查 rankManager:", window.SmSdk && window.SmSdk.rankManager);
                            self.openRankPanel();
                        }, 200);
                        return;
                    } else {
                        console.log("rankManager 已存在:", window.SmSdk.rankManager);
                    }
                    this.openRankPanel();
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
            window.gm_ap.mat.loadSkin(),
            this.refreshCircle(),
            (SdkPkgConfig.Channel != ChannelEnum.Toutiao && SdkPkgConfig.Channel != ChannelEnum.Kuaishou) ||
                window.SmSdk.showReturn(this.node);
            
            // 仅在调试模式下添加测试按钮
            if (SdkGameConfig.isShowDebugLog) {
                try {
                    // 创建测试按钮（用于调试）
                    console.log("=== 创建测试分数上报按钮 ===");
                    
                    // 直接调用上报方法，不需要UI按钮
                    this.onTestScore();
                    
                    console.log("=== 测试分数上报按钮已创建 ===");
                } catch (error) {
                    console.warn("Failed to initialize test score button:", error);
                }
            }
    }
    refreshCircle() {
        // 确保排行榜按钮始终可见
        if (this.btnRank && SdkGameConfig.isOpenRank) {
            this.btnRank.active = true;
        }
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
        // 再次确保排行榜按钮可见（在创建/销毁用户信息按钮后）
        if (this.btnRank && SdkGameConfig.isOpenRank) {
            this.btnRank.active = true;
        }
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
        // 确保排行榜按钮在销毁用户信息按钮后仍然可见
        if (this.btnRank && SdkGameConfig.isOpenRank) {
            this.btnRank.active = true;
        }
    }
    onShow() {
        this.lbl_level && (this.lbl_level.string = "第 " + (window.gm_ap.level.levelIdx + 1).toString() + " 关");
        // 确保排行榜按钮可见
        if (this.btnRank && SdkGameConfig.isOpenRank) {
            this.btnRank.active = true;
        }
        this.refreshCircle();
        (APGameConfig.isMenuPanelOpen = true);
        (this.isPayPower = false);
    }
    openRankPanel() {
        // 尝试获取玩家信息
        window.SmSdk.sdkImp.getPlayerInfo(function () {
            console.log("获取玩家信息成功，上报排行榜数据...");
            // 上报排行榜数据
            var e, t;
            null == (e = window.SmSdk.rankManager) || e.report("rank_total", window.gm_ap.level.levelIdx),
                null == (t = window.SmSdk.rankManager) || t.report("rank_day", window.gm_ap.level.dayLevel);
        }, function (error) {
            console.log("获取玩家信息失败，直接打开排行榜面板: ", error);
        });
        // 直接打开排行榜面板，不受获取玩家信息结果影响
        console.log("打开排行榜面板...");
        window.sm.ui.open(APRankPanel).then(function (e) {
            console.log("排行榜面板打开成功，生成UI...");
            e.generateUI();
        }).catch(function (error) {
            console.error("打开排行榜面板失败: ", error);
        });
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
    
    // 测试分数上报功能 - 仅在调试模式下使用
    onTestScore() {
        if (!SdkGameConfig.isShowDebugLog) return;
        
        console.log("=== 开始测试分数上报 ===");
        
        // 获取当前等级作为测试分数
        const testScore = window.gm_ap.level.levelIdx;
        const dayScore = window.gm_ap.level.dayLevel;
        
        console.log("测试分数信息:", {
            totalScore: testScore,
            dayScore: dayScore,
            playerName: window.SmSdk.savedPlayerName,
            openid: window.SmSdk.savedOpenid
        });
        
        // 直接上报分数，不依赖玩家信息获取
        if (window.SmSdk.rankManager) {
            window.SmSdk.rankManager.report("rank_total", testScore, { test: true });
            window.SmSdk.rankManager.report("rank_day", dayScore, { test: true });
            console.log("✅ 测试分数上报请求已发送");
            window.sm.ui.tip("测试分数上报完成");
        } else {
            console.error("❌ rankManager未初始化");
            window.sm.ui.tip("测试分数上报失败: rankManager未初始化");
        }
        
        console.log("=== 分数上报测试完成 ===");
    }
    
    close() {
        super.close.call(this), (APGameConfig.isMenuPanelOpen = false);
    }
}
