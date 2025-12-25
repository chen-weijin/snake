System.register("chunks:///_virtual/writer_buffer.js", ["./cjs-loader.mjs", "./writer.js", "./minimal2.js"], function (t, e) {
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
                    var o = e("./writer");
                    (u.prototype = Object.create(o.prototype)).constructor = u;
                    var s = e("./util/minimal");
                    function u () {
                        o.call(this);
                    }
                    function f (t, e, r) {
                        t.length < 40 ? s.utf8.write(t, e, r) : e.utf8Write ? e.utf8Write(t, r) : e.write(t, r);
                    }
                    (u._configure = function () {
                        (u.alloc = s._Buffer_allocUnsafe),
                            (u.writeBytesBuffer =
                                s.Buffer && s.Buffer.prototype instanceof Uint8Array && "set" === s.Buffer.prototype.set.name
                                    ? function (t, e, r) {
                                        e.set(t, r);
                                    }
                                    : function (t, e, r) {
                                        if (t.copy) t.copy(e, r, 0, t.length);
                                        else for (var n = 0; n < t.length;) e[r++] = t[n++];
                                    });
                    }),
                        (u.prototype.bytes = function (t) {
                            s.isString(t) && (t = s._Buffer_from(t, "base64"));
                            var e = t.length >>> 0;
                            return this.uint32(e), e && this._push(u.writeBytesBuffer, e, t), this;
                        }),
                        (u.prototype.string = function (t) {
                            var e = s.Buffer.byteLength(t);
                            return this.uint32(e), e && this._push(f, e, t), this;
                        }),
                        u._configure(),
                        r.exports;
                },
                function () {
                    return {
                        "./writer": n,
                        "./util/minimal": i,
                    };
                }
            );
        },
    };
});