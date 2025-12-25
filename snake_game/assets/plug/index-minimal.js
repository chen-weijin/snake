System.register(
    "chunks:///_virtual/index-minimal.js",
    [
        "./cjs-loader.mjs",
        "./writer.js",
        "./writer_buffer.js",
        "./reader.js",
        "./reader_buffer.js",
        "./minimal2.js",
        "./rpc.js",
        "./roots.js",
    ],
    function (t, e) {
        var r, n, i, o, s, u, f, a;
        return {
            setters: [
                function (t) {
                    r = t.default;
                },
                function (t) {
                    n = t.__cjsMetaURL;
                },
                function (t) {
                    i = t.__cjsMetaURL;
                },
                function (t) {
                    o = t.__cjsMetaURL;
                },
                function (t) {
                    s = t.__cjsMetaURL;
                },
                function (t) {
                    u = t.__cjsMetaURL;
                },
                function (t) {
                    f = t.__cjsMetaURL;
                },
                function (t) {
                    a = t.__cjsMetaURL;
                },
            ],
            execute: function () {
                var c = t("__cjsMetaURL", e.meta.url);
                r.define(
                    c,
                    function (t, e, r, n, i) {
                        var o = t;
                        function s () {
                            o.util._configure(), o.Writer._configure(o.BufferWriter), o.Reader._configure(o.BufferReader);
                        }
                        (o.build = "minimal"),
                            (o.Writer = e("./writer")),
                            (o.BufferWriter = e("./writer_buffer")),
                            (o.Reader = e("./reader")),
                            (o.BufferReader = e("./reader_buffer")),
                            (o.util = e("./util/minimal")),
                            (o.rpc = e("./rpc")),
                            (o.roots = e("./roots")),
                            (o.configure = s),
                            s(),
                            r.exports;
                    },
                    function () {
                        return {
                            "./writer": n,
                            "./writer_buffer": i,
                            "./reader": o,
                            "./reader_buffer": s,
                            "./util/minimal": u,
                            "./rpc": f,
                            "./roots": a,
                        };
                    }
                );
            },
        };
    }
)
