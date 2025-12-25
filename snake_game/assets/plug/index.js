System.register("chunks:///_virtual/index.js", ["./cjs-loader.mjs"], function (t, e) {
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
                    (r.exports = function (t, e) {
                        for (var r = new Array(arguments.length - 1), n = 0, i = 2, o = true; i < arguments.length;) r[n++] = arguments[i++];
                        return new Promise(function (i, s) {
                            r[n] = function (t) {
                                if (o)
                                    if (((o = false), t)) s(t);
                                    else {
                                        for (var e = new Array(arguments.length - 1), r = 0; r < e.length;) e[r++] = arguments[r];
                                        i.apply(null, e);
                                    }
                            };
                            try {
                                t.apply(e || null, r);
                            } catch (t) {
                                t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                                o && ((o = false), s(t));
                            }
                        });
                    }),
                        r.exports;
                },
                {}
            );
        },
    };
});
