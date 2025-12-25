import { _decorator, Node, Vec3, tween, game, instantiate, math, v3, isValid } from "cc";
import { TaskManager } from "./TaskManager";
import { smmath } from "./SmMath";

const { ccclass } = _decorator;

class class_1 {
    static time1 = 0.25;
    static time2 = 0.3;
    static time3 = 0.3;
    static addTimes = 10;

    aniTime = 0;
    displayLbl: any;
    tokenPath: any;
    valueCurrent: any;
    valueAfter: any;
    valueAddPerTime: number;
    flyingTokens: any[];

    init(e, t) {
        (this.displayLbl = e), (this.tokenPath = t);
    }
    startCollect(t, n, i, o) {
        var r = this;
        if (t == n) return o && o();
        (this.valueCurrent = t),
            (this.valueAfter = n),
            this.createFlyingTokens(this.displayLbl.node, i),
            TaskManager.addNormalTimeTask(function () {
                (r.valueAddPerTime = (n - t) / class_1.addTimes), r.updateLbl();
            }, 0.9 * (class_1.time1 + class_1.time2)),
            TaskManager.addNormalTimeTask(function () {
                r.destroyFlyingTokens(), o && o();
            }, class_1.time1 + class_1.time2 + class_1.time3);
    }
    updateLbl() {
        var t = this;
        (this.aniTime += game.deltaTime),
            this.aniTime >= class_1.time3 / class_1.addTimes &&
                ((this.aniTime -= class_1.time3 / class_1.addTimes),
                (this.valueCurrent = Math.ceil(this.valueCurrent + this.valueAddPerTime)),
                (this.displayLbl.string = smmath.reduceNum(this.valueCurrent)),
                this.valueCurrent >= this.valueAfter && (this.displayLbl.string = smmath.reduceNum(this.valueCurrent))),
            this.valueCurrent < this.valueAfter &&
                TaskManager.addNormalTimeTask(function () {
                    return t.updateLbl();
                }, 0);
    }
    createFlyingTokens(t, n) {
        var r = this;
        (this.flyingTokens = new Array()),
            window.sm.res.loadPrefab(this.tokenPath).then(function (l) {
                for (var d = r.getCirclePoints(n, 20, 180, 150), f = 0; f < d.length; f++) {
                    var h = instantiate(l);
                    (h.parent = window.sm.ui.layer_top), (h.worldPosition = n);
                    var m = math.randomRange(1, 2);
                    (h.scale = new Vec3(m, m, m)),
                        tween(h)
                            .to(class_1.time1, {
                                worldPosition: d[f],
                            })
                            .start(),
                        r.flyingTokens.push(h);
                }
                TaskManager.addNormalTimeTask(function () {
                    for (
                        var n = function (n) {
                                tween(r.flyingTokens[n])
                                    .to(class_1.time2, {
                                        worldPosition: t.worldPosition,
                                    })
                                    .call(function () {
                                        isValid(r.flyingTokens[n]) && (r.flyingTokens[n].active = false);
                                    })
                                    .start();
                            },
                            i = 0;
                        i < r.flyingTokens.length;
                        i++
                    )
                        n(i);
                }, class_1.time1);
            });
    }
    getCirclePoints(e, t, n = 180, i = 150) {
        for (var o = [], r = (Math.PI / 180) * Math.round(360 / t), a = 0; a < t; a++) {
            var s = e.x + n * Math.sin(r * a),
                u = e.y + n * Math.cos(r * a),
                c = v3(s + Math.random() * i, u + Math.random() * i, 0);
            o.push(c);
        }
        return o;
    }
    destroyFlyingTokens() {
        for (var e = 0; e < this.flyingTokens.length; e++)
            isValid(this.flyingTokens[e]) && ((this.flyingTokens[e].active = false), this.flyingTokens[e].destroy());
        this.flyingTokens = [];
    }
}

@ccclass("AddGoldAni")
export class AddGoldAni {
    static collecGold(e, t, i, o) {
        var r = i instanceof Node ? i.worldPosition : i,
            a = new class_1();
        a.init(window.sm.ui.panel(CommonPanel).getResUIItem(ItemId.Gold).lbl_count, "prefab/ui/addGoldEffectUI"),
            a.startCollect(window.gm.player.gold, window.gm.player.gold + e, r, function () {
                window.gm.player.addGold(e, t), window.sm.ui.panel(CommonPanel).refreshResUI(ItemId.Gold), o && o();
            });
    }
    static collectRes(e, t, i, o, r) {
        var a = o instanceof Node ? o.worldPosition : o,
            s = window.sm.tbl.item(e).data().collectEffect,
            l = new class_1();
        l.init(window.sm.ui.panel(CommonPanel).getResUIItem(e).lbl_count, "prefab/ui/" + s),
            l.startCollect(window.gm.player.itemCount(e), window.gm.player.itemCount(e) + t, a, function () {
                window.gm.player.addItem(e, t, i), window.sm.ui.panel(CommonPanel).refreshResUI(e), r && r();
            });
    }
    static collectGoldFromGameItem(e, t, r, a) {
        var s =
            r instanceof Node
                ? BattleCamera.instance.camera.convertToUINode(r.worldPosition, window.sm.ui.panel(CommonPanel).node, new Vec3())
                : r;
        window.sm.res.loadPrefab("prefab/ui/addGoldEffectUI").then(function (e) {
            var t = window.sm.pool.get(e);
            (t.parent = window.sm.ui.layer_top),
                (t.position = s),
                tween(t)
                    .to(0.3, {
                        worldPosition: window.sm.ui.panel(CommonPanel).iconGold.node.worldPosition,
                    })
                    .call(function () {
                        a && a(), window.sm.pool.put(t);
                    })
                    .start();
        });
    }
}
