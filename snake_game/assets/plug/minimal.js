System.register("chunks:///_virtual/minimal.js", ["./cjs-loader.mjs", "./index-minimal.js"], function (t, e) {
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
                    r.exports = e("./src/index-minimal");
                    r.exports;
                },
                function () {
                    return {
                        "./src/index-minimal": n,
                    };
                }
            );
        },
    };
});
