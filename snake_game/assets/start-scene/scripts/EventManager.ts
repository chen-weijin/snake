import Singleton from "./Singleton";

class EventItem {
    event: any;
    callback: any;
    target: any;

    constructor(e, t, n) {
        this.event = e;
        this.callback = t;
        this.target = n;
    }

    check(e, t) {
        return this.target === e && this.callback === t;
    }

    checkByTarget(e) {
        return this.target === e;
    }

    checkByCallback(e) {
        return this.callback === e;
    }

    off() {
        window.sm.event.offByEventTarget(this);
    }

    emit(e) {
        this.callback.apply(this.target, e);
    }
}

export class EventManager extends Singleton {
    static TAG = "EventManager";

    eventList = new Map();

    getEventList(e) {
        return this.eventList.has(e) || this.eventList.set(e, []), this.eventList.get(e);
    }
    on(e, t, n) {
        if (!e) return window.sm.log.error(EventManager.TAG, "监听事件没有事件名"), null;
        if (!t) return window.sm.log.error(EventManager.TAG, "监听事件没有回调函数"), null;
        var o = new EventItem(e, t, n);
        return this.getEventList(e).push(o), n && (n._$eventList || (n._$eventList = [])).push(o), o;
    }
    once(e, t, n) {
        const o = this;
        return t
            ? this.on(
                  e,
                  function i(...args) {
                      t.apply(o, args);
                      o.off(e, i, n);
                  },
                  n
              )
            : (window.sm.log.error(EventManager.TAG, "监听事件没有回调函数"), null);
    }

    off(e, t, n) {
        if (!e) return window.sm.log.error(EventManager.TAG, "注销事件时没有指定事件"), null;
        if (!t) return window.sm.log.error(EventManager.TAG, "销毁事件没有回调函数"), null;
        var o = this.getEventList(e);
        if (o.length > 0) for (var r = 0, a = o.length; r < a; r++) if (o[r].check(n, t)) return o.splice(r, 1), a--, o[--r];
        return null;
    }
    offByTarget(e, t) {
        if (!e) return window.sm.log.error(EventManager.TAG, "offByTarget not target"), false;
        if (t) {
            var n = this.getEventList(t);
            if (n.length > 0) for (var o = 0, r = n.length; o < r; o++) n[o].checkByTarget(e) && (n.splice(o, 1), r--, o--);
            return true;
        }
        for (var a = this.eventList.values(); ; ) {
            var s = a.next();
            if (s.done) break;
            var l = s.value;
            if (l.length > 0) for (var u = 0, c = l.length; u < c; u++) l[u].checkByTarget(e) && (l.splice(u, 1), c--, u--);
        }
        return true;
    }
    offByCallback(e, t) {
        if (!e) return window.sm.log.error(EventManager.TAG, "offByCallback not callback"), false;
        if (t) {
            var n = this.getEventList(t);
            if (n.length > 0) for (var o = 0, r = n.length; o < r; o++) n[o].checkByCallback(e) && (n.splice(o, 1), r--, o--);
            return true;
        }
        for (var a = this.eventList.values(); ; ) {
            var s = a.next();
            if (s.done) break;
            var l = s.value;
            if (l.length > 0) for (var u = 0, c = l.length; u < c; u++) l[u].checkByCallback(e) && (l.splice(u, 1), c--, u--);
        }
        return true;
    }
    offByEvent(e) {
        return e ? (this.eventList.set(e, []), true) : (window.sm.log.error(EventManager.TAG, "offByEvent not event"), false);
    }
    offByEventTarget(e) {
        e ? this.off(e.event, e.callback, e.target) : window.sm.log.error(EventManager.TAG, "offByEventTarget not eventTarget");
    }

    emit(e, ...args) {
        if (!e) return window.sm.log.error(EventManager.TAG, "发送事件时没有指定事件");
        const t = this.getEventList(e);
        for (let u of t) {
            u.emit(args);
        }
    }
}
