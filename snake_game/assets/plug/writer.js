System.register("chunks:///_virtual/writer.js", ["./cjs-loader.mjs", "./minimal2.js"], function (t, e) {
    var r, n;
    return {
        setters: [
            function (t) {
                r = t.default;
            },
            function (t) {
                n = t.__cjsMetaURL;
            },
        ],
        execute: function () {
            var i = t("__cjsMetaURL", e.meta.url);
            r.define(
                i,
                function (t, e, r, n, i) {
                    r.exports = p;
                    var o,
                        s = e("./util/minimal"),
                        u = s.LongBits,
                        f = s.base64,
                        a = s.utf8;
                    function c (t, e, r) {
                        (this.fn = t), (this.len = e), (this.next = void 0), (this.val = r);
                    }
                    function l () { }
                    function h (t) {
                        (this.head = t.head), (this.tail = t.tail), (this.len = t.len), (this.next = t.states);
                    }
                    function p () {
                        (this.len = 0), (this.head = new c(l, 0, 0)), (this.tail = this.head), (this.states = null);
                    }
                    var d = function () {
                        return s.Buffer
                            ? function () {
                                return (p.create = function () {
                                    return new o();
                                })();
                            }
                            : function () {
                                return new p();
                            };
                    };
                    function m (t, e, r) {
                        e[r] = 255 & t;
                    }
                    function y (t, e) {
                        (this.len = t), (this.next = void 0), (this.val = e);
                    }
                    function v (t, e, r) {
                        for (; t.hi;) (e[r++] = (127 & t.lo) | 128), (t.lo = ((t.lo >>> 7) | (t.hi << 25)) >>> 0), (t.hi >>>= 7);
                        for (; t.lo > 127;) (e[r++] = (127 & t.lo) | 128), (t.lo = t.lo >>> 7);
                        e[r++] = t.lo;
                    }
                    function _ (t, e, r) {
                        (e[r] = 255 & t), (e[r + 1] = (t >>> 8) & 255), (e[r + 2] = (t >>> 16) & 255), (e[r + 3] = t >>> 24);
                    }
                    (p.create = d()),
                        (p.alloc = function (t) {
                            return new s.Array(t);
                        }),
                        s.Array !== Array && (p.alloc = s.pool(p.alloc, s.Array.prototype.subarray)),
                        (p.prototype._push = function (t, e, r) {
                            return (this.tail = this.tail.next = new c(t, e, r)), (this.len += e), this;
                        }),
                        (y.prototype = Object.create(c.prototype)),
                        (y.prototype.fn = function (t, e, r) {
                            for (; t > 127;) (e[r++] = (127 & t) | 128), (t >>>= 7);
                            e[r] = t;
                        }),
                        (p.prototype.uint32 = function (t) {
                            return (
                                (this.len += (this.tail = this.tail.next =
                                    new y((t >>>= 0) < 128 ? 1 : t < 16384 ? 2 : t < 2097152 ? 3 : t < 268435456 ? 4 : 5, t)).len),
                                this
                            );
                        }),
                        (p.prototype.int32 = function (t) {
                            return t < 0 ? this._push(v, 10, u.fromNumber(t)) : this.uint32(t);
                        }),
                        (p.prototype.sint32 = function (t) {
                            return this.uint32(((t << 1) ^ (t >> 31)) >>> 0);
                        }),
                        (p.prototype.uint64 = function (t) {
                            var e = u.from(t);
                            return this._push(v, e.length(), e);
                        }),
                        (p.prototype.int64 = p.prototype.uint64),
                        (p.prototype.sint64 = function (t) {
                            var e = u.from(t).zzEncode();
                            return this._push(v, e.length(), e);
                        }),
                        (p.prototype.bool = function (t) {
                            return this._push(m, 1, t ? 1 : 0);
                        }),
                        (p.prototype.fixed32 = function (t) {
                            return this._push(_, 4, t >>> 0);
                        }),
                        (p.prototype.sfixed32 = p.prototype.fixed32),
                        (p.prototype.fixed64 = function (t) {
                            var e = u.from(t);
                            return this._push(_, 4, e.lo)._push(_, 4, e.hi);
                        }),
                        (p.prototype.sfixed64 = p.prototype.fixed64),
                        (p.prototype.float = function (t) {
                            return this._push(s.float.writeFloatLE, 4, t);
                        }),
                        (p.prototype.double = function (t) {
                            return this._push(s.float.writeDoubleLE, 8, t);
                        });
                    var b = s.Array.prototype.set
                        ? function (t, e, r) {
                            e.set(t, r);
                        }
                        : function (t, e, r) {
                            for (var n = 0; n < t.length; ++n) e[r + n] = t[n];
                        };
                    (p.prototype.bytes = function (t) {
                        var e = t.length >>> 0;
                        if (!e) return this._push(m, 1, 0);
                        if (s.isString(t)) {
                            var r = p.alloc((e = f.length(t)));
                            f.decode(t, r, 0), (t = r);
                        }
                        return this.uint32(e)._push(b, e, t);
                    }),
                        (p.prototype.string = function (t) {
                            var e = a.length(t);
                            return e ? this.uint32(e)._push(a.write, e, t) : this._push(m, 1, 0);
                        }),
                        (p.prototype.fork = function () {
                            return (this.states = new h(this)), (this.head = this.tail = new c(l, 0, 0)), (this.len = 0), this;
                        }),
                        (p.prototype.reset = function () {
                            return (
                                this.states
                                    ? ((this.head = this.states.head),
                                        (this.tail = this.states.tail),
                                        (this.len = this.states.len),
                                        (this.states = this.states.next))
                                    : ((this.head = this.tail = new c(l, 0, 0)), (this.len = 0)),
                                this
                            );
                        }),
                        (p.prototype.ldelim = function () {
                            var t = this.head,
                                e = this.tail,
                                r = this.len;
                            return this.reset().uint32(r), r && ((this.tail.next = t.next), (this.tail = e), (this.len += r)), this;
                        }),
                        (p.prototype.finish = function () {
                            for (var t = this.head.next, e = this.constructor.alloc(this.len), r = 0; t;)
                                t.fn(t.val, e, r), (r += t.len), (t = t.next);
                            return e;
                        }),
                        (p._configure = function (t) {
                            (o = t), (p.create = d()), o._configure();
                        }),
                        r.exports;
                },
                function () {
                    return {
                        "./util/minimal": n,
                    };
                }
            );
        },
    };
});
