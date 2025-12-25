System.register("chunks:///_virtual/index6.js", ["./cjs-loader.mjs"], function (t, e) {
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
                    (o.length = function (t) {
                        for (var e = 0, r = 0, n = 0; n < t.length; ++n)
                            (r = t.charCodeAt(n)) < 128
                                ? (e += 1)
                                : r < 2048
                                    ? (e += 2)
                                    : 55296 == (64512 & r) && 56320 == (64512 & t.charCodeAt(n + 1))
                                        ? (++n, (e += 4))
                                        : (e += 3);
                        return e;
                    }),
                        (o.read = function (t, e, r) {
                            if (r - e < 1) return "";
                            for (var n, i = null, o = [], s = 0; e < r;)
                                (n = t[e++]) < 128
                                    ? (o[s++] = n)
                                    : n > 191 && n < 224
                                        ? (o[s++] = ((31 & n) << 6) | (63 & t[e++]))
                                        : n > 239 && n < 365
                                            ? ((n =
                                                (((7 & n) << 18) | ((63 & t[e++]) << 12) | ((63 & t[e++]) << 6) | (63 & t[e++])) -
                                                65536),
                                                (o[s++] = 55296 + (n >> 10)),
                                                (o[s++] = 56320 + (1023 & n)))
                                            : (o[s++] = ((15 & n) << 12) | ((63 & t[e++]) << 6) | (63 & t[e++])),
                                    s > 8191 && ((i || (i = [])).push(String.fromCharCode.apply(String, o)), (s = 0));
                            return i
                                ? (s && i.push(String.fromCharCode.apply(String, o.slice(0, s))), i.join(""))
                                : String.fromCharCode.apply(String, o.slice(0, s));
                        }),
                        (o.write = function (t, e, r) {
                            for (var n, i, o = r, s = 0; s < t.length; ++s)
                                (n = t.charCodeAt(s)) < 128
                                    ? (e[r++] = n)
                                    : n < 2048
                                        ? ((e[r++] = (n >> 6) | 192), (e[r++] = (63 & n) | 128))
                                        : 55296 == (64512 & n) && 56320 == (64512 & (i = t.charCodeAt(s + 1)))
                                            ? ((n = 65536 + ((1023 & n) << 10) + (1023 & i)),
                                                ++s,
                                                (e[r++] = (n >> 18) | 240),
                                                (e[r++] = ((n >> 12) & 63) | 128),
                                                (e[r++] = ((n >> 6) & 63) | 128),
                                                (e[r++] = (63 & n) | 128))
                                            : ((e[r++] = (n >> 12) | 224), (e[r++] = ((n >> 6) & 63) | 128), (e[r++] = (63 & n) | 128));
                            return r - o;
                        }),
                        r.exports;
                },
                {}
            );
        },
    };
});