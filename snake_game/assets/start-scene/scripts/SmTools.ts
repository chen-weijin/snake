import { Component, Button, Vec3, UITransform, assetManager, SpriteFrame } from "cc";
import { smmath } from "./SmMath";
import { smtime } from "./SmTime";

export default class smtools {
    static click(e, t, o?, r?) {
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
    static stringFormat() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
        if (0 == arguments.length) return null;
        for (var i = arguments[0], o = 1; o < arguments.length; o++) {
            var r = new RegExp("\\{" + (o - 1) + "\\}", "window.gm");
            i = i.replace(r, arguments[o]);
        }
        return i;
    }
    static getIDStringByCount(e) {
        return e <= 10 ? smmath.prefixFill(e, 2) : e <= 15 ? "11" : e <= 20 ? "12" : e <= 30 ? "13" : e <= 40 ? "14" : void 0;
    }
    static formatNumberWithUnit(e) {
        var t,
            n = "";
        return (
            e >= 1e9 ? ((t = e / 1e9), (n = "B")) : e >= 1e6 ? ((t = e / 1e6), (n = "M")) : e >= 1e3 ? ((t = e / 1e3), (n = "K")) : (t = e),
            Number.isInteger(t) ? t.toString() + n : t.toFixed(2) + n
        );
    }
    static isNewDay(e) {
        var t = smtime.getDateStruct(new Date().getTime()),
            n = smtime.getDateStruct(e);
        return t.y > n.y || t.m > n.m || t.d > n.d;
    }
    static padZero(e, t = 4) {
        return e.toString().padStart(t, "0");
    }
    static setSuitSize(e, t, n) {
        n.height < n.width
            ? ((e.width = t), (e.height = (n.height / n.width) * t))
            : ((e.height = t), (e.width = (n.width / n.height) * t));
    }
    static setPortrait(t, n, i = 75, o = false) {
        return !t || t.length <= 0
            ? this.setPortraitDefault(n, i)
            : o
            ? (console.log("本地头像"),
              new Promise(function (o, a) {
                  window.sm.res.loadSpriteFrame("texture/user_icon/" + t).then(function (t) {
                      (n.node.active = true), (n.spriteFrame = t);
                      var a = n.getComponent(UITransform);
                      a && smtools.setSuitSize(a, i, t), o(t);
                  });
              }))
            : new Promise(function (o, l) {
                  console.log("从服务器读取用户头像"),
                      assetManager.loadRemote(
                          t,
                          {
                              ext: ".png",
                          },
                          function (t, a: any) {
                              if (t)
                                  window.sm.log.warn(t),
                                      window.sm.res.loadSpriteFrame("texture/ui/defaultIcon").then(function (t) {
                                          (n.node.active = true), (n.spriteFrame = t);
                                          var a = n.getComponent(UITransform);
                                          a && smtools.setSuitSize(a, i, t), o(t);
                                      });
                              else {
                                  (n.node.active = true), (n.spriteFrame = SpriteFrame.createWithImage(a));
                                  var l = n.getComponent(UITransform);
                                  l && smtools.setSuitSize(l, i, n.spriteFrame), o(n.spriteFrame);
                              }
                          }
                      );
              });
    }
    static loadPortrait(e) {
        return !e || e.length <= 0
            ? new Promise(function (e, t) {
                  window.sm.res.loadSpriteFrame("texture/ui/defaultIcon").then(function (t) {
                      e(t);
                  });
              })
            : new Promise(function (t, n) {
                  console.log("从服务器读取用户头像"),
                      assetManager.loadRemote(
                          e,
                          {
                              ext: ".png",
                          },
                          function (e, n: any) {
                              e
                                  ? (window.sm.log.warn(e),
                                    window.sm.res.loadSpriteFrame("texture/ui/defaultIcon").then(function (e) {
                                        t(e);
                                    }))
                                  : t(SpriteFrame.createWithImage(n));
                          }
                      );
              });
    }
    static setPortraitDefault(t, n = 80) {
        return (
            console.log("默认头像"),
            new Promise(function (i, o) {
                window.sm.res.loadSpriteFrame("texture/ui/defaultIcon").then(function (o) {
                    (t.node.active = true), (t.spriteFrame = o);
                    var a = t.getComponent(UITransform);
                    a && smtools.setSuitSize(a, n, o), i(o);
                });
            })
        );
    }
}
