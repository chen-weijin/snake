import { instantiate, NodePool, Vec3 } from "cc";
import Dictionary from "./Dictionary";
import Singleton from "./Singleton";
import { smtime } from "./SmTime";

class u {
    node: any;
    putPoolTime: number;
}

export class PoolManager extends Singleton {
    _poolDict = {};
    prePool = new Dictionary();
    tempPool = new Dictionary();
    _batllePoolDict = {};

    preGet(e, t) {
        var n = e.data.name;
        if (!(this.prePool.get(n) && this.prePool.get(n).length > 300)) {
            var a;
            if (
                (this._poolDict.hasOwnProperty(n)
                    ? (a = this._poolDict[n].get() || instantiate(e))
                    : ((this._poolDict[n] = new NodePool()), (a = instantiate(e))),
                a.isValid || (a = instantiate(e)),
                t && a.setParent(t),
                (a.parent = window.btl.map.itemHolder),
                (a.worldPosition = new Vec3(999999, 99999, 999999)),
                this.prePool.get(n))
            ) {
                var s = this.prePool.get(n);
                s.push(a), this.prePool.set(n, s);
            } else {
                var l = [];
                l.push(a), this.prePool.set(n, l);
            }
            return a;
        }
    }
    getFromPre(e, t) {
        var n,
            r,
            a = e.data.name;
        return (null == (n = this.prePool.get(a)) ? void 0 : n.length) > 0
            ? ((r = this.prePool.get(a)[0]), this.prePool.get(a).splice(0, 1), r)
            : (this._poolDict.hasOwnProperty(a)
                  ? (r = this._poolDict[a].get() || instantiate(e))
                  : ((this._poolDict[a] = new NodePool()), (r = instantiate(e))),
              r.isValid || (r = instantiate(e)),
              t && r.setParent(t),
              r);
    }
    get(e, t) {
        var n,
            r = e.data.name;
        return (
            this._poolDict.hasOwnProperty(r)
                ? (n = this._poolDict[r].get() || instantiate(e))
                : ((this._poolDict[r] = new NodePool()), (n = instantiate(e))),
            n.isValid || (n = instantiate(e)),
            t && n.setParent(t),
            n
        );
    }
    put(e) {
        if (e) {
            var t,
                n = e.name;
            this._poolDict.hasOwnProperty(n) ? (t = this._poolDict[n]) : ((t = new NodePool()), (this._poolDict[n] = t)), t.put(e);
        }
    }
    clear(e) {
        var t = "string" == typeof e ? e : e.data.name;
        this._poolDict.hasOwnProperty(t) && this._poolDict[t].clear();
    }
    getBattlePool(e, t) {
        var n,
            r,
            a = e.data.name;
        return (null == (n = this.tempPool.get(a)) ? void 0 : n.length) > 0
            ? ((r = this.tempPool.get(a)[0].node), this.tempPool.get(a).splice(0, 1), (r.active = true), r)
            : (this._batllePoolDict.hasOwnProperty(a)
                  ? (r = this._batllePoolDict[a].get() || instantiate(e))
                  : ((this._batllePoolDict[a] = new NodePool()), (r = instantiate(e))),
              r.isValid || (r = instantiate(e)),
              t && r.setParent(t),
              (r.active = true),
              r);
    }
    putBattlePool(e) {
        if (e) {
            var t = e.name;
            if (this.tempPool.get(t)) {
                e.position = new Vec3(99999, 9999, 9999);
                var n = new u();
                (n.node = e), (n.putPoolTime = 0), this.tempPool.get(t).push(n);
            } else {
                var i = [],
                    o = new u();
                (o.node = e),
                    (o.putPoolTime = smtime.now() + 3),
                    i.push(o),
                    this.tempPool.set(t, i),
                    (e.position = new Vec3(99999, 9999, 9999));
            }
            e.active = false;
        }
    }
    putTempArrToPool(e) {
        if (e) {
            var t,
                n = e.name;
            this._batllePoolDict.hasOwnProperty(n) ? (t = this._batllePoolDict[n]) : ((t = new NodePool()), (this._batllePoolDict[n] = t)),
                t.put(e);
        }
    }
    update2(e) {
        for (var t in this.tempPool.items) {
            var n = this.tempPool.get(t);
            n.length > 0 && smtime.now() >= n[0].putPoolTime && (this.putTempArrToPool(n[0].node), n.splice(0, 1));
        }
    }
    clearBattlePool(e) {
        var t = "string" == typeof e ? e : e.data.name;
        this._batllePoolDict.hasOwnProperty(t) && this._batllePoolDict[t].clear();
    }
    clearAllBattlePool() {
        for (var e in this._batllePoolDict) this._batllePoolDict[e].clear();
        this._batllePoolDict = {};
    }
    iteratePoolDictForIn() {
        for (var e in this._poolDict)
            if (this._poolDict.hasOwnProperty(e)) {
                var t = this._poolDict[e];
                console.log("Key: " + e + ", Pool size: " + t.size());
            }
    }
}
