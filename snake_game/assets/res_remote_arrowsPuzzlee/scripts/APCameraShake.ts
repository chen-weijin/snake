import { _decorator, math, tween, Vec3, Component } from "cc";

const { ccclass } = _decorator;
@ccclass("APCameraShake")
export class APCameraShake extends Component {
    shakeCounts = 0;
    shakeIndex = 0;
    oneShakeTime = 0;
    posScale = 0.1;
    rotateScale = 0.1;
    originPos = new Vec3();
    posTween;
    rotateTween;

    shake(e, t = 1, n = 5) {
        this.posScale = 0.1 * t;
        this.rotateScale = 0.1 * t;
        this.shakeIndex = 0;
        this.shakeCounts = n;
        this.oneShakeTime = e / n;
        this.originPos = this.node.position.clone();
        this.autoShake2();
    }
    autoShake2() {
        var e = this;
        if ((this.shakeIndex++, this.shakeIndex >= this.shakeCounts)) this.resetCamera();
        else {
            var t = math.randomRangeInt(-1, 2) * this.posScale;
            this.posTween = tween(this.node)
                .to(this.oneShakeTime, {
                    position: new Vec3(this.originPos.x + t, this.originPos.y, this.originPos.z),
                })
                .call(function () {
                    e.autoShake2();
                })
                .start();
        }
    }
    autoShake() {
        var e = this;
        this.shakeIndex++,
            this.shakeIndex >= this.shakeCounts
                ? this.resetCamera()
                : ((this.posTween = tween(this.node)
                      .to(this.oneShakeTime, {
                          position: new Vec3(
                              math.randomRangeInt(-1, 1) * this.posScale,
                              math.randomRangeInt(-1, 1) * this.posScale,
                              math.randomRangeInt(-1, 1) * this.posScale
                          ),
                      })
                      .call(function () {
                          e.autoShake();
                      })
                      .start()),
                  (this.rotateTween = tween(this.node)
                      .to(this.oneShakeTime, {
                          eulerAngles: new Vec3(
                              math.randomRangeInt(-1, 1) * this.rotateScale,
                              math.randomRangeInt(-1, 1) * this.rotateScale,
                              math.randomRangeInt(-1, 1) * this.rotateScale
                          ),
                      })
                      .start()));
    }
    resetCamera() {
        this.posTween && this.posTween.stop(),
            (this.posTween = tween(this.node)
                .to(0.2, {
                    position: this.originPos,
                })
                .start()),
            this.rotateTween && this.rotateTween.stop(),
            (this.rotateTween = tween(this.node)
                .to(0.2, {
                    eulerAngles: new Vec3(),
                })
                .start());
    }
}
