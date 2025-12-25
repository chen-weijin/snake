import { instantiate, math, Vec3, tween, v3, isValid } from "cc";

class GoldAniInner {
    static time1 = 0.25;
    static time2 = 0.3;
    static time3 = 0.3;
    tokenPrefab: any;
    startPos: any;
    endPos: any;
    flyingTokens: any;

    init(e, t, n) {
        (this.tokenPrefab = e), (this.startPos = t), (this.endPos = n);
    }
    startCollect() {
        var t = this;
        this.createFlyingTokens(),
            window.SmSdk.task(function () {
                t.destroyFlyingTokens();
            }, GoldAniInner.time1 + GoldAniInner.time2 + GoldAniInner.time3);
    }
    createFlyingTokens() {
        var t = this;
        this.flyingTokens = new Array();
        for (var a = this.getCirclePoints(this.startPos, 20, 180, 150), l = 0; l < a.length; l++) {
            var u = instantiate(this.tokenPrefab);
            (u.parent = window.SmSdk.sdkPanel.funcRoot), (u.worldPosition = this.startPos);
            var c = math.randomRange(1, 2);
            (u.scale = new Vec3(c, c, c)),
                tween(u)
                    .to(GoldAniInner.time1, {
                        worldPosition: a[l],
                    })
                    .start(),
                this.flyingTokens.push(u);
        }
        window.SmSdk.task(function () {
            for (
                var n = function (n) {
                        tween(t.flyingTokens[n])
                            .to(GoldAniInner.time2, {
                                worldPosition: t.endPos,
                            })
                            .call(function () {
                                isValid(t.flyingTokens[n]) && (t.flyingTokens[n].active = false);
                            })
                            .start();
                    },
                    i = 0;
                i < t.flyingTokens.length;
                i++
            )
                n(i);
        }, GoldAniInner.time1);
    }
    getCirclePoints(e, t, n = 180, i = 150) {
        for (var o = [], r = (Math.PI / 180) * Math.round(360 / t), s = 0; s < t; s++) {
            var l = e.x + n * Math.sin(r * s),
                u = e.y + n * Math.cos(r * s),
                c = v3(l + Math.random() * i, u + Math.random() * i, 0);
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

export class GoldAni {
    static gold(e, t, n) {
        const i = new GoldAniInner();
        i.init(e, t.worldPosition, n.worldPosition);
        i.startCollect();
    }
}
