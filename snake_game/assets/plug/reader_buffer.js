System.register("chunks:///_virtual/reader_buffer.js", ["./cjs-loader.mjs", "./reader.js", "./minimal2.js"], function (t, e) {
    var r, n, i;
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
        ],
        execute: function () {
            var o = t("__cjsMetaURL", e.meta.url);
            r.define(
                o,
                function (t, e, r, n, i) {
                    r.exports = u;
                    var o = e("./reader");
                    (u.prototype = Object.create(o.prototype)).constructor = u;
                    var s = e("./util/minimal");
                    function u (t) {
                        o.call(this, t);
                    }
                    (u._configure = function () {
                        s.Buffer && (u.prototype._slice = s.Buffer.prototype.slice);
                    }),
                        (u.prototype.string = function () {
                            var t = this.uint32();
                            return this.buf.utf8Slice
                                ? this.buf.utf8Slice(this.pos, (this.pos = Math.min(this.pos + t, this.len)))
                                : this.buf.toString("utf-8", this.pos, (this.pos = Math.min(this.pos + t, this.len)));
                        }),
                        u._configure(),
                        r.exports;
                },
                function () {
                    return {
                        "./reader": n,
                        "./util/minimal": i,
                    };
                }
            );
        },
    };
});