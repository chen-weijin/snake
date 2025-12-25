import { _decorator, Prefab, director, Vec3, tween, Component } from "cc";
import { smarray } from "../../start-scene/scripts/SmArray";
import { APGameConfig } from "./APGameConfig";
import { APGamePanel } from "./APGamePanel";
import { APRevivePanel } from "./APRevivePanel";
import { GridColor } from "./APGridItem";
import { APGridItemMove } from "./APGridItemMove";

const G = [
    { dx: 0, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: 0 },
    { dx: 1, dy: 0 },
];

const { ccclass, property } = _decorator;
@ccclass("APArrowItem")
export class APArrowItem extends Component {
    @property(Prefab)
    bodyPre;

    @property(Prefab)
    headPre;

    @property(Prefab)
    tailPre;

    @property(Prefab)
    tailEndPre;

    grids = [];
    indices = [];
    color = "yellow";

    moves = [];
    _isRemoved = false;
    _isMoving = false;
    isMovingBack = false;
    _isError = false;
    _ingore = false;
    moveSpeed = 0.02;
    halfMove = false;
    hasMove = false;
    waitTime = 0;
    isClear = false;
    arrowColor = "";
    blockedPosition;
    snackLinePos: any[];
    myX;
    myY;
    arrowDir;

    static COLOR_POOL = ["#60B8F1", "#4760FF", "#EE5FD5", "#C77ADD", "#A44069", "#00CA00", "#006C0D", "#C59B2A"];

    static getRandomColor() {
        return this.COLOR_POOL[Math.floor(Math.random() * this.COLOR_POOL.length)];
    }

    get isRemoved() {
        return this._isRemoved;
    }
    set isRemoved(e) {
        (this._isRemoved = e), true === e && window.btl_ap.ctrl.curStageItem.arrowRemoved(this.grids);
    }

    get isMoving() {
        return this._isMoving;
    }
    set isMoving(e) {
        this._isMoving = e;
    }

    get isError() {
        return this._isError;
    }
    set isError(e) {
        this._isError = e;
    }

    init() {
        director.on("GridOnClick", this.arrowMove, this),
            (this.isClear = false),
            (this.isMoving = false),
            (this.isMovingBack = false),
            (this.isRemoved = false),
            (this._ingore = false),
            (this.isError = false),
            (this.blockedPosition = null),
            (this.halfMove = false),
            2 === window.gm_ap.skin.curSkinId
                ? (this.color = APArrowItem.getRandomColor())
                : (this.color = window.gm_ap.mat.getOneColorName());
    }
    resetMovePos() {
        var e = this;
        this.snackLinePos = [];
        for (var t = this.grids.length - 1; t >= 0; t--) this.snackLinePos.push(this.grids[t].node.worldPosition.clone());
        for (var n = 0; n < this.snackLinePos.length - 2; )
            (this.snackLinePos[n].x == this.snackLinePos[n + 1].x && this.snackLinePos[n].x == this.snackLinePos[n + 2].x) ||
            (this.snackLinePos[n].y == this.snackLinePos[n + 1].y && this.snackLinePos[n].y == this.snackLinePos[n + 2].y)
                ? smarray.remove(this.snackLinePos, this.snackLinePos[n + 1])
                : n++;
        for (var i = 0; i < this.snackLinePos.length - 1; i++) {
            var o = this.snackLinePos[i],
                s = this.snackLinePos[i + 1],
                r = Math.abs(o.x - s.x) + Math.abs(o.y - s.y),
                a = Math.ceil(r / 3);
            0 == window.gm_ap.skin.curSkinId && window.btl_ap.ctrl.curStageItem.winTarget < 100 && (a = Math.ceil(r / 2)),
                1 == window.gm_ap.skin.curSkinId && (a = Math.floor(r / 4));
            for (var l = 0; l < a; l++) {
                var c = this.bodyPre;
                i == this.snackLinePos.length - 2 && l == a - 1
                    ? (c = this.headPre)
                    : 0 == i && 0 == l
                    ? (c = this.tailEndPre)
                    : 0 == i && 1 == l && (c = this.tailPre);
                var d = window.sm.pool.get(c);
                d.setParent(this.node);
                var m = d.getComponent(APGridItemMove);
                this.moves.push(m);
                var g = o.clone();
                (g.x = o.x + (s.x - o.x) * (l / a)),
                    (g.y = o.y + (s.y - o.y) * (l / a)),
                    i == this.snackLinePos.length - 2 && l == a - 1
                        ? m.reset(this.snackLinePos, i + 1, this.grids[0].displayType, g, 0 == i && 0 == l)
                        : m.reset(this.snackLinePos, i, this.grids[0].displayType, g, 0 == i && 0 == l);
            }
        }
        if (
            (this.moves.forEach(function (t) {
                t.init(e.color), (0 != APGameConfig.loadAni && 4 != APGameConfig.loadAni) || (t.node.scale = Vec3.ZERO);
            }),
            0 == APGameConfig.loadAni || 4 == APGameConfig.loadAni)
        )
            for (var v = this.moves.length, y = 0; y < this.moves.length; y++) {
                var k = y,
                    A = this.moves[y];
                window.btl_ap.ctrl.firstInGame
                    ? v < 100
                        ? 0 == APGameConfig.loadAni
                            ? tween(A.node)
                                  .delay(0.01 * y)
                                  .to(0.1, {
                                      scale: A.normalSize,
                                  })
                                  .start()
                            : 4 == APGameConfig.loadAni && this.showThis(A.node, 0.01 * y, A.normalSize)
                        : 0 == APGameConfig.loadAni
                        ? tween(A.node)
                              .delay(k / v)
                              .to(0.1, {
                                  scale: A.normalSize,
                              })
                              .start()
                        : 4 == APGameConfig.loadAni && this.showThis(A.node, k / v, A.normalSize)
                    : v < 100
                    ? 0 == APGameConfig.loadAni
                        ? tween(A.node)
                              .delay((0.01 * y) / 2)
                              .to(0.1, {
                                  scale: A.normalSize,
                              })
                              .start()
                        : 4 == APGameConfig.loadAni && this.showThis(A.node, (0.01 * y) / 2, A.normalSize)
                    : 0 == APGameConfig.loadAni
                    ? tween(A.node)
                          .delay(k / v / 2)
                          .to(0.1, {
                              scale: A.normalSize,
                          })
                          .start()
                    : 4 == APGameConfig.loadAni && this.showThis(A.node, k / v / 2, A.normalSize);
            }
    }
    showThis(e, t, n) {
        this.scheduleOnce(function () {
            e.scale = n;
        }, t);
    }
    changeMoves() {
        var e = this;
        if (1 == window.gm_ap.skin.curSkinId || window.btl_ap.ctrl.curStageItem.winTarget < 100) this.hasMove = true;
        else {
            for (var t = this.moves.length - 1; t >= 0; t--)
                APGameConfig.isOpenPool ? window.sm.pool.put(this.moves[t].node) : this.moves[t].node.destroy();
            this.moves = [];
            for (var n = 0; n < this.snackLinePos.length - 1; n++) {
                var i = this.snackLinePos[n],
                    o = this.snackLinePos[n + 1],
                    s = Math.abs(i.x - o.x) + Math.abs(i.y - o.y),
                    r = Math.ceil(s / 3);
                0 == window.gm_ap.skin.curSkinId && (r = Math.ceil(s / 2)), 1 == window.gm_ap.skin.curSkinId && (r = Math.floor(s / 4));
                for (var a = 0; a < r; a++) {
                    var l = this.bodyPre;
                    n == this.snackLinePos.length - 2 && a == r - 1
                        ? (l = this.headPre)
                        : 0 == n && 0 == a
                        ? (l = this.tailEndPre)
                        : 0 == n && 1 == a && (l = this.tailPre);
                    var c = window.sm.pool.get(l);
                    c.setParent(this.node);
                    var h = c.getComponent(APGridItemMove);
                    this.moves.push(h);
                    var d = i.clone();
                    (d.x = i.x + (o.x - i.x) * (a / r)),
                        (d.y = i.y + (o.y - i.y) * (a / r)),
                        n == this.snackLinePos.length - 2 && a == r - 1
                            ? h.reset(this.snackLinePos, n + 1, this.grids[0].displayType, d, 0 == n && 0 == a)
                            : h.reset(this.snackLinePos, n, this.grids[0].displayType, d, 0 == n && 0 == a);
                }
            }
            this.moves.forEach(function (t) {
                t.init(e.color), (t.node.scale = Vec3.ONE);
            }),
                (this.hasMove = true);
        }
    }
    arrowMove(e) {
        if (this.node.activeInHierarchy && !window.btl_ap.ctrl.curStageItem.isPause && -1 !== this.grids.indexOf(e)) {
            var t = window.btl_ap.ctrl.curStageItem;
            if (t) {
                var n = t.blockGrid;
                this.blockedPosition = null;
                var i = this.isPathBlocked(n),
                    o = i.canMove,
                    s = i.block,
                    r = i.halfMove;
                if (((this.halfMove = r), (this.isMovingBack = false), this.hasMove || this.changeMoves(), o))
                    window.SmSdk.sdkImp.shake(),
                        (this.isRemoved = true),
                        (this.isMoving = true),
                        (this._ingore = true),
                        this.highlight(GridColor.Correct, true, 0.15),
                        window.btl_ap.ctrl.curStageItem.curWinProgress++,
                        window.btl_ap.ctrl.curStageItem.playSoundByRemove();
                else {
                    this.isError || ((this.isError = true), window.btl_ap.ctrl.curStageItem.descHp(1)),
                        window.SmSdk.sdkImp.shake(100),
                        window.sm.audio.playSound("SFX_UI_Word_Fail_1_C48kbps"),
                        window.sm.ui.panel(APGamePanel).moveErrorAni();
                    var a = s.node.worldPosition;
                    (this.blockedPosition = a), (this.isMoving = true), this.highlight(GridColor.Error);
                }
            }
        }
    }
    isPathBlocked(e) {
        for (var t = this.myX, n = this.myY, i = G[this.arrowDir], o = i.dx, s = i.dy; !window.btl_ap.ctrl.curStageItem.isPause; ) {
            if (((t += o), (n += s) < 0 || n >= e[0].length || t < 0 || t >= e.length))
                return {
                    canMove: true,
                    block: null,
                    halfMove: false,
                };
            var r = e[t][n];
            if (null != r) {
                var a = t - this.myX == o || n - this.myY == s;
                return (
                    r.myFather.highlight(GridColor.Error, true),
                    {
                        canMove: false,
                        block: r,
                        halfMove: a,
                    }
                );
            }
        }
    }
    debugIsPathBlocked(e) {
        for (var t = this.myX, n = this.myY, i = G[this.arrowDir], o = i.dx, s = i.dy; !window.btl_ap.ctrl.curStageItem.isPause; ) {
            if (((t += o), (n += s) < 0 || n >= e[0].length || t < 0 || t >= e.length))
                return {
                    canMove: true,
                    block: null,
                    halfMove: false,
                };
            var r = e[t][n];
            if (null != r)
                return {
                    canMove: false,
                    block: r,
                    halfMove: t - this.myX == o || n - this.myY == s,
                };
        }
    }
    update(e) {
        var t = this;
        if (!window.btl_ap.ctrl.curStageItem.isPause && this.hasMove)
            if (this.isMoving) {
                if (
                    (this.moves.forEach(function (e) {
                        e.update1();
                    }),
                    null != this.blockedPosition)
                ) {
                    var n = this.moves[this.moves.length - 1].node.worldPosition;
                    this.blockedPosition.clone().subtract(n).length() < APGameConfig.moveLength &&
                        ((this.isMoving = false),
                        (this.isMovingBack = true),
                        window.btl_ap.ctrl.curStageItem.isFail &&
                            ((window.btl_ap.ctrl.curStageItem.isPause = true),
                            window.sm.ui.open(APRevivePanel).then(function (e) {
                                return e.setInfo(window.btl_ap.ctrl.curStageItem.failType);
                            })),
                        this.moves.forEach(function (e) {
                            e.curIndexSnack + 1 < t.snackLinePos.length && e.curIndexSnack++;
                        }));
                } else {
                    var i = this.moves[0].node.worldPosition;
                    (i.x < 0 || i.x > 750 || i.y > 1650 || i.y < 0) && ((this.isMoving = false), (this.node.active = false), this.clear());
                }
            } else if (this.isMovingBack) {
                this.moves.forEach(function (e) {
                    e.update2();
                });
                var o = this.moves[0].node.worldPosition;
                this.moves[0].orginPos.clone().subtract(o).length() < APGameConfig.moveLength &&
                    ((this.isMovingBack = false),
                    this.moves.forEach(function (e) {
                        e.setOrginPos();
                    }));
            }
    }
    getNextPosition(e, t) {
        switch (t) {
            case 0:
                return new Vec3(e.x, e.y + 10, 0);
            case 1:
                return new Vec3(e.x, e.y - 10, 0);
            case 2:
                return new Vec3(e.x - 10, e.y, 0);
            case 3:
                return new Vec3(e.x + 10, e.y, 0);
            default:
                return e;
        }
    }
    highlight(e, t = false, n = 0.5) {
        0 === window.gm_ap.skin.curSkinId &&
            (e === GridColor.Error && this.isError && t && (t = false),
            this.moves.forEach(function (i) {
                i.hightlight(e, t, n);
            }));
    }
    onDisable() {
        this.unscheduleAllCallbacks(),
            (this.isMoving = false),
            (this.isRemoved = false),
            (this.isError = false),
            (this.blockedPosition = null),
            (this.halfMove = false);
    }
    clear() {
        if (!this.isClear) {
            (this.isClear = true),
                (this.isMoving = false),
                (this.isRemoved = false),
                (this.isError = false),
                (this.blockedPosition = null),
                (this.halfMove = false),
                this.unscheduleAllCallbacks();
            for (var e = this.grids.length - 1; e >= 0; e--)
                this.grids[e].clear(), APGameConfig.isOpenPool ? window.sm.pool.put(this.grids[e].node) : this.grids[e].node.destroy();
            for (var t = this.moves.length - 1; t >= 0; t--)
                APGameConfig.isOpenPool ? window.sm.pool.put(this.moves[t].node) : this.moves[t].node.destroy();
            (this.moves = []), (this.grids = []), director.off("GridOnClick", this.arrowMove, this);
        }
    }
    levelStartAni() {
        var e = this;
        this.grids.forEach(function (e) {
            e.node.active = false;
        }),
            (function t(n) {
                n < 0
                    ? e.playHeadAnimation()
                    : ((e.grids[n].node.active = true),
                      e.scheduleOnce(function () {
                          return t(n - 1);
                      }, 0.01));
            })(this.grids.length - 1);
    }
    playHeadAnimation() {}
}
