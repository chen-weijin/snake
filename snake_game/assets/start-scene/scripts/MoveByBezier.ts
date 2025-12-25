import { _decorator, tween, Component } from "cc";
import { smmath } from "./SmMath";

const { ccclass, property } = _decorator;

@ccclass("MoveByBezier")
export class MoveByBezier extends Component {
    linePathCount = 0;
    itemMoveIndex = 0;
    perPointMoveTime = 0;
    LinePathPosArr;
    moveTween;
    cb;

    init(e, t, n, i, o = 8, r) {
        (this.LinePathPosArr = []), (this.linePathCount = o), (this.perPointMoveTime = i / o), (this.itemMoveIndex = 0);
        for (var s = 0; s < this.linePathCount; s++) {
            var l = (s + 1) / this.linePathCount;
            this.LinePathPosArr[s] = smmath.GetBezierPoint(l, e, n, t);
        }
        this.cb = r;
    }
    initLocalPos(e, t, n, i, o = 8, r) {
        this.init(e, t, n, i, o, r), this.itemMoveByParabolaLocal();
    }
    initWorldPos(e, t, n, i, o = 8, r) {
        this.init(e, t, n, i, o, r), this.itemMoveByParabolaWorld();
    }
    itemMoveByParabolaLocal() {
        var e = this;
        this.itemMoveIndex++,
            this.itemMoveIndex >= this.LinePathPosArr.length
                ? this.cb && this.cb()
                : (this.moveTween && this.moveTween.stop(),
                  (this.moveTween = tween(this.node)
                      .to(this.perPointMoveTime, {
                          position: this.LinePathPosArr[this.itemMoveIndex],
                      })
                      .call(function () {
                          e.itemMoveByParabolaLocal();
                      })
                      .start()));
    }
    itemMoveByParabolaWorld() {
        var e = this;
        this.itemMoveIndex++,
            this.itemMoveIndex >= this.LinePathPosArr.length
                ? this.cb && this.cb()
                : (this.moveTween && this.moveTween.stop(),
                  (this.moveTween = tween(this.node)
                      .to(this.perPointMoveTime, {
                          worldPosition: this.LinePathPosArr[this.itemMoveIndex],
                      })
                      .call(function () {
                          e.itemMoveByParabolaWorld();
                      })
                      .start()));
    }
    stopMoveTween() {
        this.moveTween && this.moveTween.stop(), (this.cb = null);
    }
}
