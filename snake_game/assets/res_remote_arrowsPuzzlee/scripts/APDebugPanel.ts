import { _decorator, EditBox, sys, game, Label } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { SdkGameConfig } from "../../start-scene/scripts/SdkConfig";
import { APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APArrowItem } from "./APArrowItem";
import { APGamePanel } from "./APGamePanel";
import { APWinPanel } from "./APWinPanel";

const { ccclass, property } = _decorator;

@ccclass("APDebugPanel")
export class APDebugPanel extends BasePanel {
    isAutoGame = false;
    isAutoNextLevel = false;
    isNextLevel = false;
    levelCount = 1;
    debug_toOneLevel;
    debugToOneLevelEdit;
    lbl_changeAni;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APDebugPanel;
    }

    init() {
        var e = this;
        (this.debug_toOneLevel = smtools.find(this.node, "debug_toonelevel")),
            (this.debugToOneLevelEdit = smtools.find(this.node, "EditBox_toOneLevel", EditBox)),
            smtools.click(this.node, "btnClose", this.close, this),
            smtools.click(
                this.node,
                "debug_nextlevel",
                function () {
                    var e, t;
                    window.gm_ap.level.levelIdx++,
                        window.gm_ap.level.dayLevel++,
                        null == (e = window.SmSdk.rankManager) || e.report("rank_total", window.gm_ap.level.levelIdx),
                        null == (t = window.SmSdk.rankManager) || t.report("rank_day", window.gm_ap.level.dayLevel),
                        window.sm.ui.panel(APGamePanel) &&
                            window.sm.ui.panel(APGamePanel).node.active &&
                            window.sm.ui.open(APWinPanel).then(function (e) {
                                e.showThis();
                            });
                },
                this
            ),
            smtools.click(
                this.node,
                "debug_skipad",
                function () {
                    SdkGameConfig.isSkipVideo = !SdkGameConfig.isSkipVideo;
                },
                this
            ),
            smtools.click(this.node, "debug_toonelevel", this.toOneLevel, this),
            smtools.click(
                this.node,
                "debug_clear",
                function () {
                    sys.localStorage.clear(), game.pause(), game.end();
                },
                this
            ),
            smtools.click(this.node, "debug_autogame", this.toggleAutoGame, this),
            (this.lbl_changeAni = smtools.find(this.node, "lbl_changeAni", Label)),
            this.changeAniLabel(),
            smtools.click(
                this.node,
                "debug_changeAni",
                function () {
                    APGameConfig.loadAni++,
                        (APGameConfig.loadAni = APGameConfig.loadAni % 5),
                        e.changeAniLabel(),
                        window.btl_ap.ctrl.curStageItem.onRestart();
                },
                this
            ),
            this.autoNextLevel(),
            (this.isAutoGame = false);
    }
    close() {
        super.close.call(this), (this.isAutoGame = false), (this.isAutoNextLevel = false);
    }
    changeAniLabel() {
        0 == APGameConfig.loadAni && (this.lbl_changeAni.string = "大小"),
            1 == APGameConfig.loadAni && (this.lbl_changeAni.string = "移动-快"),
            2 == APGameConfig.loadAni && (this.lbl_changeAni.string = "移动-慢"),
            3 == APGameConfig.loadAni && (this.lbl_changeAni.string = "无"),
            4 == APGameConfig.loadAni && (this.lbl_changeAni.string = "大小无动画");
    }
    toOneLevel() {
        (this.levelCount = Number(this.debugToOneLevelEdit.string)),
            (window.gm_ap.level.levelIdx = this.levelCount - 1),
            window.sm.ui.panel(APGamePanel) &&
                window.sm.ui.panel(APGamePanel).node.active &&
                window.sm.ui.open(APWinPanel).then(function (e) {
                    e.showThis();
                });
    }
    autoFindAndMoveArrow() {
        const e = this;
        if (window.btl_ap.ctrl.curStageItem && this.isAutoGame) {
            let t;
            const i = window.btl_ap.ctrl.curStageItem.arrows.filter((e) => {
                if (!e.active) return false;
                const t = e.getComponent(APArrowItem);
                return t && !t.isRemoved;
            });

            const o: { arrow: any; component: APArrowItem }[] = [];

            for (const r of i) {
                const a = r.getComponent(APArrowItem);
                if (a && a.debugIsPathBlocked(window.btl_ap.ctrl.curStageItem.blockGrid).canMove) {
                    o.push({
                        arrow: r,
                        component: a,
                    });
                }
            }

            if (o.length !== 0) {
                const l = o[Math.floor(Math.random() * o.length)].component.grids[0];
                if (l) {
                    l.onClick();
                    this.scheduleOnce(function () {
                        if (e.isAutoGame) e.autoFindAndMoveArrow();
                    }, 0.3);
                }
            }
        }
    }

    toggleAutoGame() {
        (this.isAutoGame = !this.isAutoGame),
            (this.isAutoNextLevel = this.isAutoGame),
            this.isAutoGame ? this.autoFindAndMoveArrow() : this.stopAutoGame();
    }
    stopAutoGame() {
        (this.isAutoGame = false), (this.isAutoNextLevel = false), this.unscheduleAllCallbacks();
    }
    onDestroy() {
        var t;
        this.stopAutoGame(), null == (t = super.onDestroy) || t.call(this);
    }
    autoNextLevel() {
        var e = this;
        this.schedule(function () {
            if (!e.isNextLevel && e.isAutoNextLevel) {
                var t = window.sm.ui.panel(APWinPanel);
                t &&
                    t.node.active &&
                    ((e.isNextLevel = true),
                    e.scheduleOnce(function () {
                        e.isAutoNextLevel
                            ? (t.onBtnNext(),
                              e.scheduleOnce(function () {
                                  e.isAutoNextLevel && e.autoFindAndMoveArrow(), (e.isNextLevel = false);
                              }, 3.5))
                            : (e.isNextLevel = false);
                    }, 3));
            }
        }, 2);
    }
}
