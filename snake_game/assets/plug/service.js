System.register("chunks:///_virtual/service.js", ["./cjs-loader.mjs", "./minimal2.js"], function (t, e) {
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
                    r.exports = s;
                    var o = e("../util/minimal");
                    function s (t, e, r) {
                        if ("function" != typeof t) throw TypeError("rpcImpl must be a function");
                        o.EventEmitter.call(this),
                            (this.rpcImpl = t),
                            (this.requestDelimited = Boolean(e)),
                            (this.responseDelimited = Boolean(r));
                    }
                    ((s.prototype = Object.create(o.EventEmitter.prototype)).constructor = s),
                        (s.prototype.rpcCall = function t (e, r, n, i, s) {
                            if (!i) throw TypeError("request must be specified");
                            var u = this;
                            if (!s) return o.asPromise(t, u, e, r, n, i);
                            if (u.rpcImpl)
                                try {
                                    return u.rpcImpl(
                                        e,
                                        r[u.requestDelimited ? "encodeDelimited" : "encode"](i).finish(),
                                        function (t, r) {
                                            if (t) return u.emit("error", t, e), s(t);
                                            if (null !== r) {
                                                if (!(r instanceof n))
                                                    try {
                                                        r = n[u.responseDelimited ? "decodeDelimited" : "decode"](r);
                                                    } catch (t) {
                                                        t =
                                                            VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(
                                                                t
                                                            );
                                                        return u.emit("error", t, e), s(t);
                                                    }
                                                return u.emit("data", r, e), s(null, r);
                                            }
                                            u.end(true);
                                        }
                                    );
                                } catch (t) {
                                    t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                                    return (
                                        u.emit("error", t, e),
                                        void setTimeout(function () {
                                            s(t);
                                        }, 0)
                                    );
                                }
                            else
                                setTimeout(function () {
                                    s(Error("already ended"));
                                }, 0);
                        }),
                        (s.prototype.end = function (t) {
                            return (
                                this.rpcImpl &&
                                (t || this.rpcImpl(null, null, null), (this.rpcImpl = null), this.emit("end").off()),
                                this
                            );
                        }),
                        r.exports;
                },
                function () {
                    return {
                        "../util/minimal": n,
                    };
                }
            );
        },
    };
});