import { Prefab, resources, assetManager, isValid, SpriteFrame } from "cc";
import Singleton from "./Singleton";
import { smarray } from "./SmArray";

export class ResManager extends Singleton {
    resCache = {};
    loadingRes = {};
    loadingGroup = {};

    add(e) {
        var t = e.name;
        !t && e.data && (t = e.data.name),
            t &&
                (e && e.isValid
                    ? (this.resCache.hasOwnProperty(t) &&
                          (window.sm.log.error("资源名字冲突:" + t + ",删除旧资源使用新资源替换"), this.resCache[t].decRef()),
                      (this.resCache[t] = e),
                      e.addRef())
                    : window.sm.log.error("##添加资源失败, 资源不可用:" + t));
    }
    get(e) {
        var n = e,
            i = e.lastIndexOf("/");
        if ((-1 != i && (n = e.substring(i + 1, e.length)), this.resCache.hasOwnProperty(n))) return this.resCache[n];
    }
    loadPrefab(e) {
        var t = this,
            n = this.get(e);
        if (null != n) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var o = new Promise(function (n, o) {
            t.findBundle(e).load(e, Prefab, function (i, r) {
                if (i) return window.sm.log.error("加载Prefab[" + e + "]出错", i), void o(i);
                try {
                    t.add(r), n(r), delete t.loadingRes[e];
                } catch (t) {
                    window.sm.log.error("使用Prefab[" + e + "]出错", t), o(t);
                }
            });
        });
        return (this.loadingRes[e] = o);
    }
    preloadPrefabOnly(e) {
        this.findBundle(e).preload(e, Prefab, function (e, t) {});
    }
    preLoadPrefab(e) {
        var t = this,
            n = this.get(e);
        if (null != n) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var o = new Promise(function (n, o) {
            var r = t.findBundle(e);
            r.preload(e, Prefab, function () {
                r.load(e, Prefab, function (i, r) {
                    if (i) return window.sm.log.error("加载Prefab[" + e + "]出错", i), void o(i);
                    try {
                        t.add(r), n(r), delete t.loadingRes[e];
                    } catch (t) {
                        window.sm.log.error("使用Prefab[" + e + "]出错", t), o(t);
                    }
                });
            });
        });
        return (this.loadingRes[e] = o);
    }
    loadImage(e) {
        var t = this,
            n = this.get(e);
        if (null != n) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载Texture2D出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    loadSpriteFrame(e) {
        var t = this,
            n = this.get(e);
        if (((e += "/spriteFrame"), null != n)) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载SpriteFrame出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    setSpriteFrame(e, t) {
        this.loadSpriteFrame(t).then(function (t) {
            e.spriteFrame = t;
        });
    }
    loadTexture(e) {
        var t = this,
            n = this.get(e);
        if (((e += "/texture"), null != n)) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载texture出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    loadMaterial(e) {
        var t = this,
            n = this.get(e);
        if (((e = e), null != n)) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载material出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    loadAudioClip(e) {
        var t = this,
            n = this.get(e);
        if (((e = e), null != n)) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载声音出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    loadJson(e) {
        var t = this,
            n = this.get(e);
        if (((e = e), null != n)) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载json出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    loadAnimationCilp(e) {
        var t = this,
            n = this.get(e);
        if (((e = e), null != n)) return Promise.resolve(n);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var i = new Promise(function (n, i) {
            t.findBundle(e).load(e, function (e, o) {
                if (e) return window.sm.log.error("加载动画出错出错", e), void i(e);
                t.add(o), n(o);
            });
        });
        return (this.loadingRes[e] = i);
    }
    getSpriteFrame(e) {
        return this.resCache.hasOwnProperty(e) ? this.resCache[e] : null;
    }
    loadResDir(e, t, n) {
        var i = this;
        resources.loadDir(e, t, function (e, t) {
            e
                ? window.sm.log.warn(e)
                : (t.forEach(function (e) {
                      return i.add(e);
                  }),
                  n && n());
        });
    }
    loadResArray(e, t, n) {
        var i = this;
        resources.load(e, t, function (e, t: any) {
            e
                ? window.sm.log.warn(e)
                : (t.forEach(function (e) {
                      return i.add(e);
                  }),
                  n && n());
        });
    }
    loadPrefabToGroup(e, t) {
        var n = this,
            o = this.get(e);
        if (null != o) return Promise.resolve(o);
        if (this.loadingRes.hasOwnProperty(e)) return this.loadingRes[e];
        var r = new Promise(function (o, a) {
            n.findBundle(e).load(e, Prefab, function (i, s) {
                if ((smarray.remove(n.loadingGroup[t], r), i)) return window.sm.log.error("加载Prefab[" + e + "]出错", i), void a(i);
                try {
                    n.add(s), o(s), delete n.loadingRes[e];
                } catch (t) {
                    window.sm.log.error("使用Prefab[" + e + "]出错", t), a(t);
                }
            });
        });
        return this.loadingGroup[t] || (this.loadingGroup[t] = []), this.loadingGroup[t].push(r), (this.loadingRes[e] = r);
    }
    checkLoadingGroupFinish(e) {
        return !this.loadingGroup[e] || this.loadingGroup[e].length <= 0;
    }
    findBundle(e) {
        var t = assetManager.bundles._map;
        for (var n in t) if (t[n].config.paths._map[e]) return assetManager.getBundle(t[n].name);
        return console.error("没有找到对应资源", e), null;
    }
    destroyGameObject(e) {
        if (isValid(e, true)) {
            var t = e;
            (t.active = false), t.setParent(window.btl.map.itemHolder, true), t.destroy();
        }
    }
    loadRemoteSprite(e) {
        return new Promise(function (t, n) {
            assetManager.loadRemote(
                e,
                {
                    ext: ".png",
                },
                function (e, i: any) {
                    if (e) return window.sm.log.warn(e), void n(e);
                    t(SpriteFrame.createWithImage(i));
                }
            );
        });
    }
}
