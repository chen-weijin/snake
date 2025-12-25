System.register("chunks:///_virtual/longbits.js", ["./cjs-loader.mjs", "./minimal2.js"], function (t, e) {
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
                    r.exports = s;
                    var o = e("../util/minimal");
                    function s (t, e) {
                        (this.lo = t >>> 0), (this.hi = e >>> 0);
                    }
                    var u = (s.zero = new s(0, 0));
                    (u.toNumber = function () {
                        return 0;
                    }),
                        (u.zzEncode = u.zzDecode =
                            function () {
                                return this;
                            }),
                        (u.length = function () {
                            return 1;
                        });
                    var f = (s.zeroHash = "\0\0\0\0\0\0\0\0");
                    (s.fromNumber = function (t) {
                        if (0 === t) return u;
                        var e = t < 0;
                        e && (t = -t);
                        var r = t >>> 0,
                            n = ((t - r) / 4294967296) >>> 0;
                        return (
                            e && ((n = ~n >>> 0), (r = ~r >>> 0), ++r > 4294967295 && ((r = 0), ++n > 4294967295 && (n = 0))),
                            new s(r, n)
                        );
                    }),
                        (s.from = function (t) {
                            if ("number" == typeof t) return s.fromNumber(t);
                            if (o.isString(t)) {
                                if (!o.Long) return s.fromNumber(parseInt(t, 10));
                                t = o.Long.fromString(t);
                            }
                            return t.low || t.high ? new s(t.low >>> 0, t.high >>> 0) : u;
                        }),
                        (s.prototype.toNumber = function (t) {
                            if (!t && this.hi >>> 31) {
                                var e = (1 + ~this.lo) >>> 0,
                                    r = ~this.hi >>> 0;
                                return e || (r = (r + 1) >>> 0), -(e + 4294967296 * r);
                            }
                            return this.lo + 4294967296 * this.hi;
                        }),
                        (s.prototype.toLong = function (t) {
                            return o.Long
                                ? new o.Long(0 | this.lo, 0 | this.hi, Boolean(t))
                                : {
                                    low: 0 | this.lo,
                                    high: 0 | this.hi,
                                    unsigned: Boolean(t),
                                };
                        });
                    var a = String.prototype.charCodeAt;
                    (s.fromHash = function (t) {
                        return t === f
                            ? u
                            : new s(
                                (a.call(t, 0) | (a.call(t, 1) << 8) | (a.call(t, 2) << 16) | (a.call(t, 3) << 24)) >>> 0,
                                (a.call(t, 4) | (a.call(t, 5) << 8) | (a.call(t, 6) << 16) | (a.call(t, 7) << 24)) >>> 0
                            );
                    }),
                        (s.prototype.toHash = function () {
                            return String.fromCharCode(
                                255 & this.lo,
                                (this.lo >>> 8) & 255,
                                (this.lo >>> 16) & 255,
                                this.lo >>> 24,
                                255 & this.hi,
                                (this.hi >>> 8) & 255,
                                (this.hi >>> 16) & 255,
                                this.hi >>> 24
                            );
                        }),
                        (s.prototype.zzEncode = function () {
                            var t = this.hi >> 31;
                            return (
                                (this.hi = (((this.hi << 1) | (this.lo >>> 31)) ^ t) >>> 0),
                                (this.lo = ((this.lo << 1) ^ t) >>> 0),
                                this
                            );
                        }),
                        (s.prototype.zzDecode = function () {
                            var t = -(1 & this.lo);
                            return (
                                (this.lo = (((this.lo >>> 1) | (this.hi << 31)) ^ t) >>> 0),
                                (this.hi = ((this.hi >>> 1) ^ t) >>> 0),
                                this
                            );
                        }),
                        (s.prototype.length = function () {
                            var t = this.lo,
                                e = ((this.lo >>> 28) | (this.hi << 4)) >>> 0,
                                r = this.hi >>> 24;
                            return 0 === r
                                ? 0 === e
                                    ? t < 16384
                                        ? t < 128
                                            ? 1
                                            : 2
                                        : t < 2097152
                                            ? 3
                                            : 4
                                    : e < 16384
                                        ? e < 128
                                            ? 5
                                            : 6
                                        : e < 2097152
                                            ? 7
                                            : 8
                                : r < 128
                                    ? 9
                                    : 10;
                        }),
                        r.exports;
                },
                function () {
                    return {
                        "../util/minimal": n,
                    };
                }
            );
        },
    };
});