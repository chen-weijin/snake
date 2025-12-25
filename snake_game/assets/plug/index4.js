System.register("chunks:///_virtual/index4.js", ["./cjs-loader.mjs"], function (t, e) {
    var r;
    return {
        setters: [
            function (t) {
                r = t.default;
            },
        ],
        execute: function () {
            var n = t("__cjsMetaURL", e.meta.url);
            r.define(
                n,
                function (t, e, r, n, i) {
                    function o (t) {
                        return (
                            "undefined" != typeof Float32Array
                                ? (function () {
                                    var e = new Float32Array([-0]),
                                        r = new Uint8Array(e.buffer),
                                        n = 128 === r[3];
                                    function i (t, n, i) {
                                        (e[0] = t), (n[i] = r[0]), (n[i + 1] = r[1]), (n[i + 2] = r[2]), (n[i + 3] = r[3]);
                                    }
                                    function o (t, n, i) {
                                        (e[0] = t), (n[i] = r[3]), (n[i + 1] = r[2]), (n[i + 2] = r[1]), (n[i + 3] = r[0]);
                                    }
                                    function s (t, n) {
                                        return (r[0] = t[n]), (r[1] = t[n + 1]), (r[2] = t[n + 2]), (r[3] = t[n + 3]), e[0];
                                    }
                                    function u (t, n) {
                                        return (r[3] = t[n]), (r[2] = t[n + 1]), (r[1] = t[n + 2]), (r[0] = t[n + 3]), e[0];
                                    }
                                    (t.writeFloatLE = n ? i : o),
                                        (t.writeFloatBE = n ? o : i),
                                        (t.readFloatLE = n ? s : u),
                                        (t.readFloatBE = n ? u : s);
                                })()
                                : (function () {
                                    function e (t, e, r, n) {
                                        var i = e < 0 ? 1 : 0;
                                        if ((i && (e = -e), 0 === e)) t(1 / e > 0 ? 0 : 2147483648, r, n);
                                        else if (isNaN(e)) t(2143289344, r, n);
                                        else if (e > 3.4028234663852886e38) t(((i << 31) | 2139095040) >>> 0, r, n);
                                        else if (e < 1.1754943508222875e-38)
                                            t(((i << 31) | Math.round(e / 1.401298464324817e-45)) >>> 0, r, n);
                                        else {
                                            var o = Math.floor(Math.log(e) / Math.LN2);
                                            t(
                                                ((i << 31) |
                                                    ((o + 127) << 23) |
                                                    (8388607 & Math.round(e * Math.pow(2, -o) * 8388608))) >>>
                                                0,
                                                r,
                                                n
                                            );
                                        }
                                    }
                                    function r (t, e, r) {
                                        var n = t(e, r),
                                            i = 2 * (n >> 31) + 1,
                                            o = (n >>> 23) & 255,
                                            s = 8388607 & n;
                                        return 255 === o
                                            ? s
                                                ? NaN
                                                : i * (1 / 0)
                                            : 0 === o
                                                ? 1.401298464324817e-45 * i * s
                                                : i * Math.pow(2, o - 150) * (s + 8388608);
                                    }
                                    (t.writeFloatLE = e.bind(null, s)),
                                        (t.writeFloatBE = e.bind(null, u)),
                                        (t.readFloatLE = r.bind(null, f)),
                                        (t.readFloatBE = r.bind(null, a));
                                })(),
                            "undefined" != typeof Float64Array
                                ? (function () {
                                    var e = new Float64Array([-0]),
                                        r = new Uint8Array(e.buffer),
                                        n = 128 === r[7];
                                    function i (t, n, i) {
                                        (e[0] = t),
                                            (n[i] = r[0]),
                                            (n[i + 1] = r[1]),
                                            (n[i + 2] = r[2]),
                                            (n[i + 3] = r[3]),
                                            (n[i + 4] = r[4]),
                                            (n[i + 5] = r[5]),
                                            (n[i + 6] = r[6]),
                                            (n[i + 7] = r[7]);
                                    }
                                    function o (t, n, i) {
                                        (e[0] = t),
                                            (n[i] = r[7]),
                                            (n[i + 1] = r[6]),
                                            (n[i + 2] = r[5]),
                                            (n[i + 3] = r[4]),
                                            (n[i + 4] = r[3]),
                                            (n[i + 5] = r[2]),
                                            (n[i + 6] = r[1]),
                                            (n[i + 7] = r[0]);
                                    }
                                    function s (t, n) {
                                        return (
                                            (r[0] = t[n]),
                                            (r[1] = t[n + 1]),
                                            (r[2] = t[n + 2]),
                                            (r[3] = t[n + 3]),
                                            (r[4] = t[n + 4]),
                                            (r[5] = t[n + 5]),
                                            (r[6] = t[n + 6]),
                                            (r[7] = t[n + 7]),
                                            e[0]
                                        );
                                    }
                                    function u (t, n) {
                                        return (
                                            (r[7] = t[n]),
                                            (r[6] = t[n + 1]),
                                            (r[5] = t[n + 2]),
                                            (r[4] = t[n + 3]),
                                            (r[3] = t[n + 4]),
                                            (r[2] = t[n + 5]),
                                            (r[1] = t[n + 6]),
                                            (r[0] = t[n + 7]),
                                            e[0]
                                        );
                                    }
                                    (t.writeDoubleLE = n ? i : o),
                                        (t.writeDoubleBE = n ? o : i),
                                        (t.readDoubleLE = n ? s : u),
                                        (t.readDoubleBE = n ? u : s);
                                })()
                                : (function () {
                                    function e (t, e, r, n, i, o) {
                                        var s = n < 0 ? 1 : 0;
                                        if ((s && (n = -n), 0 === n)) t(0, i, o + e), t(1 / n > 0 ? 0 : 2147483648, i, o + r);
                                        else if (isNaN(n)) t(0, i, o + e), t(2146959360, i, o + r);
                                        else if (n > 1.7976931348623157e308)
                                            t(0, i, o + e), t(((s << 31) | 2146435072) >>> 0, i, o + r);
                                        else {
                                            var u;
                                            if (n < 2.2250738585072014e-308)
                                                t((u = n / 5e-324) >>> 0, i, o + e),
                                                    t(((s << 31) | (u / 4294967296)) >>> 0, i, o + r);
                                            else {
                                                var f = Math.floor(Math.log(n) / Math.LN2);
                                                1024 === f && (f = 1023),
                                                    t((4503599627370496 * (u = n * Math.pow(2, -f))) >>> 0, i, o + e),
                                                    t(
                                                        ((s << 31) | ((f + 1023) << 20) | ((1048576 * u) & 1048575)) >>> 0,
                                                        i,
                                                        o + r
                                                    );
                                            }
                                        }
                                    }
                                    function r (t, e, r, n, i) {
                                        var o = t(n, i + e),
                                            s = t(n, i + r),
                                            u = 2 * (s >> 31) + 1,
                                            f = (s >>> 20) & 2047,
                                            a = 4294967296 * (1048575 & s) + o;
                                        return 2047 === f
                                            ? a
                                                ? NaN
                                                : u * (1 / 0)
                                            : 0 === f
                                                ? 5e-324 * u * a
                                                : u * Math.pow(2, f - 1075) * (a + 4503599627370496);
                                    }
                                    (t.writeDoubleLE = e.bind(null, s, 0, 4)),
                                        (t.writeDoubleBE = e.bind(null, u, 4, 0)),
                                        (t.readDoubleLE = r.bind(null, f, 0, 4)),
                                        (t.readDoubleBE = r.bind(null, a, 4, 0));
                                })(),
                            t
                        );
                    }
                    function s (t, e, r) {
                        (e[r] = 255 & t), (e[r + 1] = (t >>> 8) & 255), (e[r + 2] = (t >>> 16) & 255), (e[r + 3] = t >>> 24);
                    }
                    function u (t, e, r) {
                        (e[r] = t >>> 24), (e[r + 1] = (t >>> 16) & 255), (e[r + 2] = (t >>> 8) & 255), (e[r + 3] = 255 & t);
                    }
                    function f (t, e) {
                        return (t[e] | (t[e + 1] << 8) | (t[e + 2] << 16) | (t[e + 3] << 24)) >>> 0;
                    }
                    function a (t, e) {
                        return ((t[e] << 24) | (t[e + 1] << 16) | (t[e + 2] << 8) | t[e + 3]) >>> 0;
                    }
                    (r.exports = o(o)),
                        r.exports,
                        r.exports.writeFloatLE,
                        r.exports.writeFloatBE,
                        r.exports.readFloatLE,
                        r.exports.readFloatBE,
                        r.exports.writeDoubleLE,
                        r.exports.writeDoubleBE,
                        r.exports.readDoubleLE,
                        r.exports.readDoubleBE;
                },
                {}
            );
        },
    };
});