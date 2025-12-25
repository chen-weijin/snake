import { _decorator, JsonAsset, instantiate, Vec3, AnimationComponent, Component, tween, Sprite, Color } from "cc";
import { smtime } from "../../start-scene/scripts/SmTime";
import smtools from "../../start-scene/scripts/SmTools";
import { TaskManager } from "../../start-scene/scripts/TaskManager";
import Loading from "../../start-scene/scripts/Loading";
import { sdkEventManager, SdkInnerEvent } from "../../start-scene/scripts/SdkEventManager";
import { APEGuideStep, APCusEvent, APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APClickPanel } from "./APClickPanel";
import { APGamePanel } from "./APGamePanel";
import { APGuidePanel } from "./APGuidePanel";
import { APRevivePanel } from "./APRevivePanel";
import { APShiwanRestartPanel } from "./APShiwanRestartPanel";
import { APWinPanel } from "./APWinPanel";
import { APStageCamera } from "./APStageCamera";
import { APArrowItem } from "./APArrowItem";
import { APGridItem, GridDisplayType } from "./APGridItem";

const { ccclass, property } = _decorator;

@ccclass("APStageItem")
export class APStageItem extends Component {
    @property(JsonAsset)
    levelJson = null;

    @property
    gridSize: number = 10;

    @property(APStageCamera)
    stageCamera = null;

    arrowParent = null;
    pixelParent = null;
    blockPrefab = null;
    pixelPrefab = null;
    arrowPrefab = null;
    snakePrefab = null;
    blockGrid = [];
    pixelMap = new Map();
    _hp = 3;
    _blocks = [];
    _arrows = [];
    _winTarget = 10;
    _curWinProgress = 0;
    isPause = false;
    levelMaxArrow = 1;
    startCountDown = false;
    isFirst = true;
    ready = false;
    longPressArrow = null;
    isFail = false;
    failType = "hp";
    soundIdx = 1;
    longline: any;
    clickNode: any;
    bg: any;

    get Hp() {
        return this._hp;
    }

    set Hp(v) {
        this._hp = v;
        window.sm.ui.panel(APGamePanel)?.refreshUI_hp(this._hp);
    }

    get blocks() {
        return this._blocks;
    }

    set blocks(v) {
        this._blocks = v;
    }

    get arrows() {
        return this._arrows;
    }

    set arrows(v) {
        this._arrows = v;
    }

    get winTarget() {
        return this._winTarget;
    }

    set winTarget(v) {
        this._winTarget = v;
    }

    get curWinProgress() {
        return this._curWinProgress;
    }

    set curWinProgress(v) {
        this._curWinProgress = v;
        if (v >= this.winTarget) {
            this.onWin();
        }
    }

    initOnce() {
        (this.isFirst = false),
            (this.arrowParent = smtools.find(this.node, "BlockContainer")),
            (this.pixelParent = smtools.find(this.node, "PixelContainer")),
            (this.longline = smtools.find(this.node, "LongLine")),
            (this.clickNode = smtools.find(this.node, "clickNode")),
            (this.bg = smtools.find(this.node, "bg"));
    }
    async init() {
        var t = this;
        this.isFail = false;
        this.ready = false;

        if (this.isFirst) {
            this.initOnce();
        }

        window.SmSdk.stat.cusEventOnce(APCusEvent.LevelStartPeople + (window.gm_ap.level.levelIdx + 1).toString().padStart(4, "0"));
        window.SmSdk.stat.cusEvent(APCusEvent.LevelStartTimes + (window.gm_ap.level.levelIdx + 1).toString().padStart(4, "0"));

        sdkEventManager.emit(SdkInnerEvent.UserEnterLevel);

        var isJsonLoaded = false;
        var isPanelOpened = false;
        var startTime = smtime.now();

        window.sm.ui.open(APGamePanel).then(function () {
            var now = smtime.now();
            console.log("gamePanel " + (now - startTime));
            isPanelOpened = true;

            window.sm.ui.panel(APGamePanel)?.refreshUI_level();

            if (isPanelOpened && isJsonLoaded) {
                console.log("gamePanel2 " + (now - startTime));
                Loading.instance?.setPro(1);
                Loading.instance.hideLoadingPanel();
            } else {
                Loading.instance?.setPro(0.95);
                console.log("gamePanel1 " + (now - startTime));
            }
        });

        await this.loadPrefab();

        var r = "json/" + window.gm_ap.level.getLevelJsonName();

        if (APGameConfig.isShiWan) {
            var data = window.gm_ap.level.getCurShiWanData();
            window.gm_ap.skin.curSkinId = data.skinId;
            window.gm_ap.skin.isDarkMode = data.isDarkMode;
        }

        window.sm.ui.open(APClickPanel);

        window.sm.res.loadJson(r).then(
            function (e) {
                var n,
                    r,
                    now = smtime.now();
                console.log("loadJson " + (now - startTime));

                t.levelJson = e;
                isJsonLoaded = true;

                if (isPanelOpened && isJsonLoaded) {
                    console.log("loadJson2 " + (now - startTime));
                    Loading.instance?.setPro(1);
                    Loading.instance.hideLoadingPanel();
                } else {
                    Loading.instance?.setPro(0.95);
                    console.log("loadJson1 " + (now - startTime));
                }

                t.levelJson ? t.generateLevel(t.levelJson.json) : console.error("未设置关卡 JSON 文件");
            },
            function () {
                window.sm.ui.tip("网络连接出错");
            }
        );

        this.startCountDown = false;
        this.isPause = false;
        this.loadNextStage();
        this.Hp = 3;
        this.curWinProgress = 0;

        if (window.gm_ap.skin.isDarkMode) {
            this.bg.getComponent(Sprite).color = new Color().fromHEX("#32374D");
        } else {
            this.bg.getComponent(Sprite).color = new Color().fromHEX("#FFFFFF");
        }
    }
    loadNextStage() {
        for (
            var e = function () {
                    var e = "json/" + window.gm_ap.level.getLevelJsonNameById(window.gm_ap.level.levelIdx + t);
                    window.sm.res.loadJson(e).then(
                        function (t) {
                            console.log("成功加载json" + e);
                        },
                        function () {
                            console.log("失败加载json" + e);
                        }
                    );
                },
                t = 0;
            t < APGameConfig.loadNextLevel;
            t++
        )
            e();
    }
    generateLevel(e) {
        var t = this,
            n = e.XSize,
            i = e.YSize,
            o = e.Arrows;
        (this.blockGrid = []),
            (this.blockGrid = Array.from(
                {
                    length: n,
                },
                function () {
                    return Array(i).fill(null);
                }
            ));
        var s = (n * this.gridSize) / 2,
            a = (i * this.gridSize) / 2,
            l = this.arrowPrefab,
            c = 1 / 0,
            u = -1 / 0,
            h = 1 / 0,
            d = -1 / 0;
        (c = 0 * this.gridSize - s), (u = n * this.gridSize - s), (h = 0 * this.gridSize - a), (d = i * this.gridSize - a);
        for (const p of this.blocks) {
            const m = p.position;
            if (m.x < c) c = m.x;
            if (m.x > u) u = m.x;
            if (m.y < h) h = m.y;
            if (m.y > d) d = m.y;
        }

        switch ((this.stageCamera && this.stageCamera.setMoveBounds(c, u, h, d), window.gm_ap.skin.curSkinId)) {
            case 0:
            case 2:
                l = this.arrowPrefab;
                break;
            case 1:
                l = this.snakePrefab;
                break;
            default:
                l = this.arrowPrefab;
        }
        var g = o.length,
            v = 0,
            P = 0;
        console.log(3.15),
            (this.levelMaxArrow = g),
            (this.winTarget = g),
            o.forEach(function (e) {
                v++,
                    window.btl_ap.ctrl.firstInGame ? (P += v < 30 ? 0.03 : v < 50 ? 0.025 : v < 100 ? 0.015 : 0.01) : (P += 0.008),
                    t.generateArrow(e, l, n, i, s, a, P, v == g);
            });
    }
    generateArrow(e, t, n, i, o, s, r, a) {
        var l = this;
        TaskManager.addNormalTimeTask(function () {
            var i = e.Dx,
                r = e.Dy,
                c = e.X,
                u = e.Y,
                h = e.Indices,
                f = APGameConfig.isOpenPool ? window.sm.pool.get(t) : instantiate(t);
            f.setParent(l.arrowParent), f.setPosition(new Vec3(0, 0, 0)), (f.active = true);
            var m = f.getComponent(APArrowItem);
            (m.myX = c),
                (m.myY = u),
                m.init(),
                l.arrows.push(f),
                h.forEach(function (e, t) {
                    var a = e % n,
                        h = Math.floor(e / n),
                        d = a * l.gridSize - o,
                        g = h * l.gridSize - s,
                        v = window.sm.pool.get(l.blockPrefab);
                    v.setParent(f), v.setPosition(new Vec3(d, g, 0)), m.indices.push(v.position);
                    var P = v.getComponent(APGridItem);
                    l.blocks.push(v), (P.myFather = m), P.init(), (l.blockGrid[a][h] = P);
                    var y = window.sm.pool.get(l.pixelPrefab);
                    y.setParent(l.pixelParent), y.setPosition(v.position), (y.scale = Vec3.ONE), (y.active = false);
                    var k = Math.round(v.position.x) + "," + Math.round(v.position.y);
                    l.pixelMap.set(k, y),
                        a === c &&
                            h === u &&
                            (0 === i && -1 === r
                                ? ((m.arrowDir = 1), (P.displayType = GridDisplayType.ArrowDown))
                                : 0 === i && 1 === r
                                ? ((m.arrowDir = 0), (P.displayType = GridDisplayType.ArrowUp))
                                : -1 === i && 0 === r
                                ? ((m.arrowDir = 2), (P.displayType = GridDisplayType.ArrowLeft))
                                : 1 === i && 0 === r && ((m.arrowDir = 3), (P.displayType = GridDisplayType.ArrowRight))),
                        m.grids.push(P);
                }),
                m.resetMovePos(),
                a && l.generateFinish();
        }, r);
    }
    generateFinish() {
        var e = this;
        (window.btl_ap.ctrl.firstInGame = false),
            TaskManager.addNormalTimeTask(function () {
                (e.ready = true), e.guideLogic();
            }, 0.7);
    }
    arrowRemoved(e) {
        var t = this;
        e.forEach(function (e) {
            for (var n = 0; n < t.blockGrid.length; n++)
                for (var i = 0; i < t.blockGrid[n].length; i++)
                    if (t.blockGrid[n][i] === e) {
                        t.blockGrid[n][i] = null;
                        var o = Math.round(e.node.position.x) + "," + Math.round(e.node.position.y),
                            s = t.pixelMap.get(o);
                        s && (s.active = true);
                        break;
                    }
        });
    }
    setLongPress(e, t) {}
    async loadPrefab() {
        var t = this;
        var i = "prefab/item/APGridItem_Arrow";

        switch (window.gm_ap.skin.curSkinId) {
            case 0:
            case 2:
                i = "prefab/item/APGridItem_Arrow";
                break;
            case 1:
                i = "prefab/item/APGridItem_Snake";
                break;
            default:
                i = "prefab/item/APGridItem_Arrow";
        }

        await window.sm.res.loadPrefab(i).then(function (e) {
            t.blockPrefab = e;
        });

        await window.sm.res.loadPrefab("prefab/item/Pixel").then(function (e) {
            t.pixelPrefab = e;
        });

        await window.sm.res.loadPrefab("prefab/item/APArrowItem_Arrow").then(function (e) {
            t.arrowPrefab = e;
        });

        await window.sm.res.loadPrefab("prefab/item/APArrowItem_Snake").then(function (e) {
            t.snakePrefab = e;
        });
    }
    onWin() {
        var e,
            t,
            n,
            i = this;
        console.log("win"),
            window.sm.audio.playSound("SFX_UI_Success_Word_2_C48kbps"),
            sdkEventManager.emit(SdkInnerEvent.FinishLevel),
            window.gm_ap.level.levelIdx++,
            window.gm_ap.level.dayLevel++,
            null == (e = window.SmSdk.rankManager) || e.report("rank_total", window.gm_ap.level.levelIdx),
            null == (t = window.SmSdk.rankManager) || t.report("rank_day", window.gm_ap.level.dayLevel);
        var o = new Vec3(0, 0, 0);
        window.sm.ui.open(APWinPanel).then(function (e) {
            e.winTipsAni();
        }),
            this.playWinAnimation(o, function () {
                (i.isPause = true),
                    window.sm.ui.open(APWinPanel).then(function (e) {
                        e.showThis();
                    });
            }),
            null == (n = window.sm.ui.panel(APGamePanel)) || n.stopCountdown();
    }
    playWinAnimation(e, t) {
        var n = this,
            i = this.pixelParent.children.filter(function (e) {
                return e.active;
            }),
            o = 0.08;
        i.length > 100 && (o = 0.05), i.length > 500 && (o = 0.02);
        var s = new Map();
        i.forEach(function (e) {
            var t = Math.round(e.position.x) + "," + Math.round(e.position.y);
            s.set(t, e);
        });
        var r = Array.from(s.keys()).map(function (e) {
                var t = e.split(",").map(Number),
                    n = t[0],
                    i = t[1];
                return new Vec3(n, i, 0);
            }),
            a = Math.min.apply(
                Math,
                r.map(function (e) {
                    return e.x;
                })
            ),
            l = Math.max.apply(
                Math,
                r.map(function (e) {
                    return e.x;
                })
            ),
            c = Math.min.apply(
                Math,
                r.map(function (e) {
                    return e.y;
                })
            ),
            u = Math.max.apply(
                Math,
                r.map(function (e) {
                    return e.y;
                })
            ),
            h = this.findClosestFourPoints(e, s),
            d = new Set(),
            f = 0,
            m = i.length;

        let func1 = function (i, r) {
            if (0 !== i.length) {
                var h = [];
                i.forEach(function (e) {
                    var i = Math.round(e.x) + "," + Math.round(e.y);
                    if (!d.has(i)) {
                        d.add(i);
                        var v = s.get(i);
                        v &&
                            tween(v)
                                .delay(r * o)
                                .to(
                                    0.25,
                                    {
                                        scale: new Vec3(2.5, 2.5, 1),
                                    },
                                    {
                                        easing: "sineOut",
                                    }
                                )
                                .to(
                                    0.25,
                                    {
                                        scale: new Vec3(0, 0, 0),
                                    },
                                    {
                                        easing: "sineIn",
                                    }
                                )
                                .call(function () {
                                    ++f === m && t();
                                })
                                .start(),
                            [
                                new Vec3(e.x - n.gridSize, e.y, 0),
                                new Vec3(e.x + n.gridSize, e.y, 0),
                                new Vec3(e.x, e.y - n.gridSize, 0),
                                new Vec3(e.x, e.y + n.gridSize, 0),
                            ].forEach(function (e) {
                                var t = Math.round(e.x) + "," + Math.round(e.y);
                                !d.has(t) && e.x >= a && e.x <= l && e.y >= c && e.y <= u && h.push(e);
                            });
                    }
                }),
                    n.scheduleOnce(function () {
                        return func1(h, r + 1);
                    }, o);
            } else f === m && t();
        };

        func1(h, 0);
    }
    findClosestFourPoints(e, t) {
        var n = Array.from(t.keys()).map(function (e: any) {
                var t = e.split(",").map(Number),
                    n = t[0],
                    i = t[1];
                return new Vec3(n, i, 0);
            }),
            i = n[0],
            o = Vec3.distance(e, i);
        n.forEach(function (t) {
            var n = Vec3.distance(e, t);
            n < o && ((i = t), (o = n));
        });
        var s = i;
        return [
            s,
            new Vec3(s.x + this.gridSize, s.y, 0),
            new Vec3(s.x, s.y + this.gridSize, 0),
            new Vec3(s.x + this.gridSize, s.y + this.gridSize, 0),
        ].filter(function (e) {
            var n = Math.round(e.x) + "," + Math.round(e.y);
            return t.has(n);
        });
    }
    descHp(e = 1) {
        e < 0 || (0 === window.gm_ap.level.levelIdx && !APGameConfig.isShiWan) || ((this.Hp -= 1), this.Hp <= 0 && this.onLose("hp"));
    }
    onLose(e) {
        if (APGameConfig.isShiWan) {
            var t = window.gm_ap.level.getCurShiWanData();
            "hp" == e && t.limitHeart && ((this.isPause = true), window.sm.ui.open(APShiwanRestartPanel));
        } else
            (this.failType = e),
                (this.isFail = true),
                "time" == e &&
                    window.sm.ui.open(APRevivePanel).then(function (t) {
                        return t.setInfo(e);
                    });
    }
    onRestart() {
        var e;
        this.clear(), null == (e = window.sm.ui.panel(APGamePanel)) || e.stopCountdown(), (this.Hp = 3), console.log("=====1"), this.init();
    }
    onRevive(e) {
        (this.isFail = false), (this.isPause = false);
        var t,
            n = APGameConfig.reviveHp;
        "time" === e
            ? (this.Hp <= 0 && (this.Hp = n),
              null == (t = window.sm.ui.panel(APGamePanel)) || t.startCountdown(APGameConfig.reviveCountDown))
            : (this.Hp = n);
    }
    clear() {
        (this.blockGrid = []), (this.blocks = []);
        for (var e = this.arrows.length - 1; e >= 0; e--)
            this.arrows[e].getComponent(APArrowItem).clear(), window.sm.pool.put(this.arrows[e]);
        this.arrows = [];
        for (var t = this.pixelParent.children.length - 1; t >= 0; t--) window.sm.pool.putBattlePool(this.pixelParent.children[t]);
        this.pixelMap.clear();
    }
    guideLogic() {
        window.gm_ap.player.curGuideStep == APEGuideStep.ClickGuide1
            ? (window.sm.ui.open(APGuidePanel).then(function (e) {
                  e.setClickGuide(true);
              }),
              (this.clickNode.active = true),
              this.clickNode.getComponent(AnimationComponent).play("clickguide"),
              (this.clickNode.worldPosition = this.arrows[0].getComponent(APArrowItem).grids[0].node.worldPosition))
            : window.gm_ap.player.curGuideStep == APEGuideStep.ClickGuide2
            ? (window.sm.ui.open(APGuidePanel).then(function (e) {
                  e.setClickGuide(true);
              }),
              this.clickNode.getComponent(AnimationComponent).play("clickguide"),
              (this.clickNode.worldPosition = this.arrows[1].getComponent(APArrowItem).grids[0].node.worldPosition))
            : window.gm_ap.player.curGuideStep == APEGuideStep.ZoomGuide &&
              window.sm.ui.open(APGuidePanel).then(function (e) {
                  e.setZoomGuide(true);
              });
    }
    playSoundByRemove() {
        window.sm.audio.playSound("merge_" + this.soundIdx + "_C48kbps"), this.soundIdx++, this.soundIdx > 7 && (this.soundIdx = 1);
    }
}
