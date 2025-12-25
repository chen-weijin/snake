import { Component, Button, Vec3 } from "cc";

export class sdktools {
    static click(e, t, o, r?) {
        if (!e) return null;
        var a = e instanceof Component ? e.node : e;
        "string" == typeof t ? (a = this.find(a, t)) : ((r = o), (o = t));
        var s = a.getComponent(Button);
        return s || ((s = a.addComponent(Button)).transition = Button.Transition.SCALE), a.on(Button.EventType.CLICK, o, r), a;
    }
    static find(e, t, n?) {
        return this.find0(this.dfs, e, t, n);
    }
    static findDfs(e, t, n) {
        return this.find0(this.dfs, e, t, n);
    }
    static findBfs(e, t, n) {
        return this.find0(this.bfs, e, t, n);
    }
    static find0(e, t, i, o) {
        if (!t) return null;
        var r = e((t = t instanceof Component ? t.node : t), i);
        return r ? (o ? r.getComponent(o) : r) : null;
    }
    static dfs(e, t) {
        return (function e(t, n) {
            if (t.name === n) return t;
            for (var i = 0; i < t.children.length; ++i) {
                var o = e(t.children[i], n);
                if (null !== o) return o;
            }
            return null;
        })(e, t);
    }
    static bfs(e, t) {
        if (!e) return null;
        var n = [];
        for (n.push(e); n.length > 0; )
            [].concat(n).forEach(function (e) {
                if ((n.shift(), e.name === t)) return e;
                e.children && n.push.apply(n, e.children);
            });
        return null;
    }
    static setALayerToB(e, t) {
        var n = this;
        (e.layer = t.layer),
            e.children.forEach(function (e) {
                n.setALayerToB(e, t);
            });
    }
    static setTirmmedSizeSp(e, t) {
        var n = (e.spriteFrame.originalSize.x - t.originalSize.x) / t.originalSize.x,
            i = (e.spriteFrame.originalSize.y - t.originalSize.y) / t.originalSize.y,
            r = e.node.scale.x;
        Math.abs(n) < Math.abs(i) ? (r *= 1 + n) : (r *= 1 + i), (e.node.scale = new Vec3(r, r, 1)), (e.spriteFrame = t);
    }
    static setSpWithContentSize(e, t, n, i) {
        var r = n / t.originalSize.x,
            a = i / t.originalSize.y,
            s = 1;
        (s *= 1 + Math.abs(r) < Math.abs(a) ? r : a), (e.node.scale = new Vec3(s, s, 1)), (e.spriteFrame = t);
    }
    static request2$(e, t, n, i) {
        var o = new XMLHttpRequest();
        (o.responseType = "text"),
            (o.onload = function () {
                try {
                    var e = JSON.parse(o.response);
                    0 == e.code ? n(e.message) : i && i(e.code, e.message);
                } catch (e) {
                    i && i(o.status, e);
                }
            }),
            (o.onerror = function () {
                i && i(o.status, o.response);
            }),
            (o.ontimeout = function (e) {
                i && i(o.status, o.response);
            }),
            o.open("POST", e, true),
            (o.timeout = 5e3),
            o.setRequestHeader("Content-Type", "application/json"),
            o.send(t);
    }
}
