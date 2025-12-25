System.register("chunks:///_virtual/index2.js", ["./cjs-loader.mjs"], function (t, e) {
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
                    var o = t;
                    o.length = function (t) {
                        var e = t.length;
                        if (!e) return 0;
                        for (var r = 0; --e % 4 > 1 && "=" === t.charAt(e);) ++r;
                        return Math.ceil(3 * t.length) / 4 - r;
                    };
                    for (var s = new Array(64), u = new Array(123), f = 0; f < 64;)
                        u[(s[f] = f < 26 ? f + 65 : f < 52 ? f + 71 : f < 62 ? f - 4 : (f - 59) | 43)] = f++;
                    o.encode = function (t, e, r) {
                        for (var n, i = null, o = [], u = 0, f = 0; e < r;) {
                            var a = t[e++];
                            switch (f) {
                                case 0:
                                    (o[u++] = s[a >> 2]), (n = (3 & a) << 4), (f = 1);
                                    break;

                                case 1:
                                    (o[u++] = s[n | (a >> 4)]), (n = (15 & a) << 2), (f = 2);
                                    break;

                                case 2:
                                    (o[u++] = s[n | (a >> 6)]), (o[u++] = s[63 & a]), (f = 0);
                            }
                            u > 8191 && ((i || (i = [])).push(String.fromCharCode.apply(String, o)), (u = 0));
                        }
                        return (
                            f && ((o[u++] = s[n]), (o[u++] = 61), 1 === f && (o[u++] = 61)),
                            i
                                ? (u && i.push(String.fromCharCode.apply(String, o.slice(0, u))), i.join(""))
                                : String.fromCharCode.apply(String, o.slice(0, u))
                        );
                    };
                    var a = "invalid encoding";
                    (o.decode = function (t, e, r) {
                        for (var n, i = r, o = 0, s = 0; s < t.length;) {
                            var f = t.charCodeAt(s++);
                            if (61 === f && o > 1) break;
                            if (void 0 === (f = u[f])) throw Error(a);
                            switch (o) {
                                case 0:
                                    (n = f), (o = 1);
                                    break;

                                case 1:
                                    (e[r++] = (n << 2) | ((48 & f) >> 4)), (n = f), (o = 2);
                                    break;

                                case 2:
                                    (e[r++] = ((15 & n) << 4) | ((60 & f) >> 2)), (n = f), (o = 3);
                                    break;

                                case 3:
                                    (e[r++] = ((3 & n) << 6) | f), (o = 0);
                            }
                        }
                        if (1 === o) throw Error(a);
                        return r - i;
                    }),
                        (o.test = function (t) {
                            return /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(t);
                        }),
                        r.exports;
                },
                {}
            );
        },
    };
});