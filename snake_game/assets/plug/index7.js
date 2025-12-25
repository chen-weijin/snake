System.register("chunks:///_virtual/index7.js", ["./cjs-loader.mjs"], function (t, e) {
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
                    (r.exports = function (t, e, r) {
                        var n = r || 8192,
                            i = n >>> 1,
                            o = null,
                            s = n;
                        return function (r) {
                            if (r < 1 || r > i) return t(r);
                            s + r > n && ((o = t(n)), (s = 0));
                            var u = e.call(o, s, (s += r));
                            return 7 & s && (s = 1 + (7 | s)), u;
                        };
                    }),
                        r.exports;
                },
                {}
            );
        },
    };
});