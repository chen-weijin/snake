import { _decorator, Vec3, Color, Sprite, tween, Component } from "cc";
import { APGameConfig } from "./APGameConfig";
import { GridDisplayType, GridColor } from "./APGridItem";

const { ccclass, property } = _decorator;

@ccclass("APGridItemMove")
export class APGridItemMove extends Component {
    @property(Vec3)
    changeEular = new Vec3(0, 0, 0);

    @property(Vec3)
    normalSize = new Vec3(1, 1, 1);

    isPrint = 1;
    endplayType = GridDisplayType.None;
    curIndexSnack = 0;
    curPos = new Vec3();
    roteTime = 0;
    dir = 0.01;
    centerX = 0;
    centerY = 0;
    pi = 0;
    firstMove = false;
    waitTime = 0;
    curEular = new Vec3();
    isChange = false;
    stayColor = GridColor.Normal;
    spTw1: any;
    spTw2: any;
    snackLinePos: any;
    orginIndex: any;
    orginPos: any;
    curP: any;
    nextP: any;

    init(e) {
        var t, n;
        if ((this.spTw1 == null || this.spTw1.stop(), this.spTw2 == null || this.spTw2.stop(), window.gm_ap.skin.curSkinId === 2)) {
            const o = new Color().fromHEX(e);
            const r = this.node.getComponentsInChildren(Sprite);
            for (const i of r) {
                i.color = o;
            }
        } else {
            const l = this.node.getComponent(Sprite);
            if (window.gm_ap.skin.curSkinId === 0 && window.gm_ap.skin.isDarkMode) {
                this.stayColor = GridColor.White;
            } else {
                this.stayColor = GridColor.Normal;
            }
            if (l) {
                l.color = new Color(this.stayColor);
            }
        }
    }

    reset(e, t, n, i, o) {
        (this.snackLinePos = e),
            (this.endplayType = n),
            (this.curIndexSnack = t),
            (this.orginIndex = t),
            0 == APGameConfig.loadAni || 3 == APGameConfig.loadAni || 4 == APGameConfig.loadAni
                ? ((this.curPos = i.clone()), (this.node.worldPosition = this.curPos.clone()))
                : (1 != APGameConfig.loadAni && 2 != APGameConfig.loadAni) ||
                  ((this.curIndexSnack = 0), (this.curPos = e[0].clone()), (this.node.worldPosition = e[0].clone()), (this.firstMove = !o)),
            (this.orginPos = i.clone()),
            (this.roteTime = 0),
            (this.isChange = false),
            this.colEular(this.curIndexSnack, this.curIndexSnack + 1);
    }
    update(e) {
        this.firstMove &&
            (1 == APGameConfig.loadAni ? this.update1(false) : 2 == APGameConfig.loadAni && this.update1(true),
            this.curPos.clone().subtract(this.orginPos).length() < APGameConfig.moveLength
                ? ((this.firstMove = false), this.setOrginPos())
                : 1 == APGameConfig.loadAni &&
                  (this.update1(),
                  this.curPos.clone().subtract(this.orginPos).length() < APGameConfig.moveLength &&
                      ((this.firstMove = false), this.setOrginPos())));
    }
    update1(e = true) {
        if (!this.isChange) {
            if (
                ((this.curP = this.snackLinePos[this.curIndexSnack]),
                (this.nextP = this.snackLinePos[this.curIndexSnack + 1]),
                this.curIndexSnack + 1 >= this.snackLinePos.length)
            )
                this.endplayType == GridDisplayType.ArrowDown && (this.curPos.y -= APGameConfig.moveLength),
                    this.endplayType == GridDisplayType.ArrowUp && (this.curPos.y += APGameConfig.moveLength),
                    this.endplayType == GridDisplayType.ArrowLeft && (this.curPos.x -= APGameConfig.moveLength),
                    this.endplayType == GridDisplayType.ArrowRight && (this.curPos.x += APGameConfig.moveLength);
            else if (this.curP.x == this.nextP.x || this.curP.y == this.nextP.y) {
                var t = this.move(this.curIndexSnack, this.curPos, APGameConfig.moveLength);
                (this.curPos = t[1]), (this.curIndexSnack = t[0]);
            } else {
                this.roteTime += this.dir;
                var n = Math.abs(this.curP.y - this.nextP.y),
                    i = (this.roteTime * (0.007 * APGameConfig.moveLength) + this.pi) * Math.PI;
                (this.curPos.x = this.centerX + n * Math.sin(i)), (this.curPos.y = this.centerY + n * Math.cos(i));
            }
            e && (this.colEular(this.curIndexSnack, this.curIndexSnack + 1), (this.node.worldPosition = this.curPos.clone()));
        }
    }
    move(e, t, n) {
        for (var i = e, o = t.clone(), s = true, r = e; r < this.snackLinePos.length - 1; r++) {
            var a = this.snackLinePos[r];
            i = r;
            var l = this.snackLinePos[r + 1];
            0 == this.isPrint &&
                (console.log("之前节点" + a), console.log("现在位置" + o), console.log("变化长度" + n), console.log("目标节点" + l)),
                (s = false);
            var c = Math.abs(a.x - l.x) < 0.01,
                u = Math.abs(a.y - l.y) < 0.01;
            if (
                (0 == this.isPrint && (console.log("xx" + c), console.log("yy" + u)),
                c
                    ? l.y > a.y
                        ? ((o.y += n), o.y == l.y ? ((o.y = l.y), i++) : o.y > l.y && ((n = o.y - l.y), (o.y = l.y), (s = true)))
                        : ((o.y -= n), o.y == l.y ? ((o.y = l.y), i++) : o.y < l.y && ((n = l.y - o.y), (o.y = l.y), (s = true)))
                    : u &&
                      (l.x > a.x
                          ? ((o.x += n), o.x == l.x ? ((o.x = l.x), i++) : o.x > l.x && ((n = o.x - l.x), (o.x = l.x), (s = true)))
                          : ((o.x -= n), o.x == l.x ? ((o.x = l.x), i++) : o.x < l.x && ((n = l.x - o.x), (o.x = l.x), (s = true)))),
                0 == this.isPrint && console.log("变化后位置" + o),
                !s)
            )
                break;
        }
        return (
            s &&
                (i++,
                this.endplayType == GridDisplayType.ArrowDown && (o.y -= n),
                this.endplayType == GridDisplayType.ArrowUp && (o.y += n),
                this.endplayType == GridDisplayType.ArrowLeft && (o.x -= n),
                this.endplayType == GridDisplayType.ArrowRight && (o.x += n)),
            [i, o]
        );
    }
    update2() {
        if (!this.isChange)
            if (
                ((this.curP = this.snackLinePos[this.curIndexSnack]),
                (this.nextP = this.snackLinePos[this.curIndexSnack - 1]),
                this.curIndexSnack - 1 < 0)
            )
                this.setOrginPos();
            else {
                if (this.curP.x == this.nextP.x || this.curP.y == this.nextP.y) {
                    var e = this.moveBack(this.curIndexSnack, this.curPos, APGameConfig.moveLength);
                    (this.curPos = e[1]), (this.curIndexSnack = e[0]);
                } else {
                    this.roteTime += this.dir;
                    var t = Math.abs(this.curP.y - this.nextP.y),
                        n = (this.roteTime * (0.007 * APGameConfig.moveLength) + this.pi) * Math.PI;
                    (this.curPos.x = this.centerX + t * Math.sin(n)), (this.curPos.y = this.centerY + t * Math.cos(n));
                }
                this.colEular(this.curIndexSnack, this.curIndexSnack + 1), (this.node.worldPosition = this.curPos.clone());
            }
    }
    moveBack(e, t, n) {
        for (var i = e, o = t.clone(), s = true, r = e; r > 0; r--) {
            var a = this.snackLinePos[r];
            i = r;
            var l = this.snackLinePos[r - 1];
            2 == this.isPrint &&
                (console.log("之前节点" + a), console.log("现在位置" + o), console.log("变化长度" + n), console.log("目标节点" + l)),
                (s = false);
            var c = Math.abs(a.x - l.x) < 0.01,
                u = Math.abs(a.y - l.y) < 0.01;
            if (
                (2 == this.isPrint && (console.log("xx" + c), console.log("yy" + u)),
                c
                    ? l.y > a.y
                        ? ((o.y += n), o.y == l.y ? ((o.y = l.y), i--) : o.y > l.y && ((n = o.y - l.y), (o.y = l.y), (s = true)))
                        : ((o.y -= n), o.y == l.y ? ((o.y = l.y), i--) : o.y < l.y && ((n = l.y - o.y), (o.y = l.y), (s = true)))
                    : u &&
                      (l.x > a.x
                          ? ((o.x += n), o.x == l.x ? ((o.x = l.x), i--) : o.x > l.x && ((n = o.x - l.x), (o.x = l.x), (s = true)))
                          : ((o.x -= n), o.x == l.x ? ((o.x = l.x), i--) : o.x < l.x && ((n = l.x - o.x), (o.x = l.x), (s = true)))),
                2 == this.isPrint && console.log("变化后位置" + o),
                !s)
            )
                break;
        }
        return s && (i--, (o = this.snackLinePos[0].clone())), [i, o];
    }
    setOrginPos() {
        (this.curIndexSnack = this.orginIndex),
            (this.curPos = this.orginPos.clone()),
            (this.node.worldPosition = this.curPos.clone()),
            this.colEular(this.curIndexSnack, this.curIndexSnack + 1);
    }
    colEularSnake(e, t) {
        var n = t.clone().subtract(e),
            i = (180 * Math.atan2(n.y, n.x)) / Math.PI;
        this.curEular.z = i + 180;
    }
    colEular(e, t) {
        if (t >= this.snackLinePos.length)
            this.endplayType == GridDisplayType.ArrowDown && (this.curEular.z = 180),
                this.endplayType == GridDisplayType.ArrowUp && (this.curEular.z = 0),
                this.endplayType == GridDisplayType.ArrowLeft && (this.curEular.z = 90),
                this.endplayType == GridDisplayType.ArrowRight && (this.curEular.z = 270),
                (this.node.eulerAngles = this.curEular.clone());
        else {
            var n = this.snackLinePos[e],
                i = this.snackLinePos[t].clone().subtract(n),
                o = (180 * Math.atan2(i.y, i.x)) / Math.PI;
            (this.curEular.z = o + 180), (this.node.eulerAngles = this.curEular.clone().add(this.changeEular));
        }
    }
    colCenter() {
        if (!(this.curIndexSnack + 2 > this.snackLinePos.length - 1)) {
            var e = this.snackLinePos[this.curIndexSnack],
                t = this.snackLinePos[this.curIndexSnack + 1];
            e.x > t.x && e.y > t.y
                ? ((this.centerX = t.x), (this.centerY = e.y), (this.pi = 0.5), (this.dir = 0.01))
                : e.x < t.x && e.y < t.y
                ? this.snackLinePos[this.curIndexSnack + 2].x == t.x
                    ? ((this.centerX = e.x), (this.centerY = t.y), (this.pi = 1), (this.dir = -0.01))
                    : ((this.centerX = t.x), (this.centerY = e.y), (this.pi = -0.5), (this.dir = 0.01))
                : ((this.centerX = e.x), (this.centerY = t.y), (this.pi = 0), (this.dir = 0.01));
        }
    }
    clone(e) {
        (this.isChange = true),
            (this.dir = e.dir),
            (this.curEular = e.curEular.clone()),
            (this.curPos = e.curPos.clone()),
            (this.curIndexSnack = e.curIndexSnack),
            (this.roteTime = e.roteTime),
            (this.centerX = e.centerX),
            (this.centerY = e.centerY),
            (this.node.worldPosition = e.node.worldPosition.clone()),
            (this.pi = e.pi),
            (this.isChange = false);
    }
    setPos(e, t) {
        (this.curPos.x = e + 36 * t), (this.node.worldPosition = this.curPos.clone());
    }
    hightlight(e, t = false, n = 0.5) {
        var i,
            o,
            s = this;

        var r = this.node.getComponent(Sprite);
        t || e != GridColor.Error || (this.stayColor = e),
            null == (i = this.spTw1) || i.stop(),
            null == (o = this.spTw2) || o.stop(),
            (this.spTw1 = tween(r)
                .to(
                    n,
                    {
                        color: new Color().fromHEX(e),
                    },
                    {
                        easing: "sineInOut",
                    }
                )
                .call(function () {
                    t &&
                        (s.spTw2 = tween(r)
                            .to(
                                n,
                                {
                                    color: new Color().fromHEX(s.stayColor),
                                },
                                {
                                    easing: "sineInOut",
                                }
                            )
                            .start());
                })
                .start());
    }
}
