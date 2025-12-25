System.register("chunks:///_virtual/rpc.js", ["./cjs-loader.mjs", "./service.js"], function (t, e) {
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
                    (t.Service = e("./rpc/service")), r.exports;
                },
                function () {
                    return {
                        "./rpc/service": n,
                    };
                }
            );
        },
    };
});