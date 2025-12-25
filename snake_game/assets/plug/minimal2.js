System.register(
    "chunks:///_virtual/minimal2.js",
    [
        "./cjs-loader.mjs",
        "./index.js",
        "./index2.js",
        "./index3.js",
        "./index4.js",
        "./index5.js",
        "./index6.js",
        "./index7.js",
        "./longbits.js",
    ],
    function (t, e) {
        var r, n, i, o, s, u, f, a, c;
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
                function (t) {
                    c = t.__cjsMetaURL;
                },
            ],
            execute: function () {
                var l = t("__cjsMetaURL", e.meta.url);
                r.define(
                    l,
                    function (t, e, r, n, i) {
                        var o = t;
                        function s (t, e, r) {
                            for (var n = Object.keys(e), i = 0; i < n.length; ++i)
                                (void 0 !== t[n[i]] && r) || (t[n[i]] = e[n[i]]);
                            return t;
                        }
                        function u (t) {
                            function e (t, r) {
                                if (!(this instanceof e)) return new e(t, r);
                                Object.defineProperty(this, "message", {
                                    get: function () {
                                        return t;
                                    },
                                }),
                                    Error.captureStackTrace
                                        ? Error.captureStackTrace(this, e)
                                        : Object.defineProperty(this, "stack", {
                                            value: new Error().stack || "",
                                        }),
                                    r && s(this, r);
                            }
                            return (
                                ((e.prototype = Object.create(Error.prototype)).constructor = e),
                                Object.defineProperty(e.prototype, "name", {
                                    get: function () {
                                        return t;
                                    },
                                }),
                                (e.prototype.toString = function () {
                                    return this.name + ": " + this.message;
                                }),
                                e
                            );
                        }
                        (o.asPromise = e("@protobufjs/aspromise")),
                            (o.base64 = e("@protobufjs/base64")),
                            (o.EventEmitter = e("@protobufjs/eventemitter")),
                            (o.float = e("@protobufjs/float")),
                            (o.inquire = e("@protobufjs/inquire")),
                            (o.utf8 = e("@protobufjs/utf8")),
                            (o.pool = e("@protobufjs/pool")),
                            (o.LongBits = e("./longbits")),
                            (o.isNode = Boolean(
                                "undefined" != typeof global &&
                                global &&
                                global.process &&
                                global.process.versions &&
                                global.process.versions.node
                            )),
                            (o.global =
                                (o.isNode && global) ||
                                ("undefined" != typeof window && window) ||
                                ("undefined" != typeof self && self) ||
                                this),
                            (o.emptyArray = Object.freeze ? Object.freeze([]) : []),
                            (o.emptyObject = Object.freeze ? Object.freeze({}) : {}),
                            (o.isInteger =
                                Number.isInteger ||
                                function (t) {
                                    return "number" == typeof t && isFinite(t) && Math.floor(t) === t;
                                }),
                            (o.isString = function (t) {
                                return "string" == typeof t || t instanceof String;
                            }),
                            (o.isObject = function (t) {
                                return t && "object" == _typeof2(t);
                            }),
                            (o.isset = o.isSet =
                                function (t, e) {
                                    var r = t[e];
                                    return (
                                        !(null == r || !t.hasOwnProperty(e)) &&
                                        ("object" != _typeof2(r) || (Array.isArray(r) ? r.length : Object.keys(r).length) > 0)
                                    );
                                }),
                            (o.Buffer = (function () {
                                try {
                                    var t = o.inquire("buffer").Buffer;
                                    return t.prototype.utf8Write ? t : null;
                                } catch (t) {
                                    t = VM2_INTERNAL_STATE_DO_NOT_USE_OR_PROGRAM_WILL_FAIL.handleException(t);
                                    return null;
                                }
                            })()),
                            (o._Buffer_from = null),
                            (o._Buffer_allocUnsafe = null),
                            (o.newBuffer = function (t) {
                                return "number" == typeof t
                                    ? o.Buffer
                                        ? o._Buffer_allocUnsafe(t)
                                        : new o.Array(t)
                                    : o.Buffer
                                        ? o._Buffer_from(t)
                                        : "undefined" == typeof Uint8Array
                                            ? t
                                            : new Uint8Array(t);
                            }),
                            (o.Array = "undefined" != typeof Uint8Array ? Uint8Array : Array),
                            (o.Long = (o.global.dcodeIO && o.global.dcodeIO.Long) || o.global.Long || o.inquire("long")),
                            (o.key2Re = /^true|false|0|1$/),
                            (o.key32Re = /^-?(?:0|[1-9][0-9]*)$/),
                            (o.key64Re = /^(?:[\\x00-\\xff]{8}|-?(?:0|[1-9][0-9]*))$/),
                            (o.longToHash = function (t) {
                                return t ? o.LongBits.from(t).toHash() : o.LongBits.zeroHash;
                            }),
                            (o.longFromHash = function (t, e) {
                                var r = o.LongBits.fromHash(t);
                                return o.Long ? o.Long.fromBits(r.lo, r.hi, e) : r.toNumber(Boolean(e));
                            }),
                            (o.merge = s),
                            (o.lcFirst = function (t) {
                                return t.charAt(0).toLowerCase() + t.substring(1);
                            }),
                            (o.newError = u),
                            (o.ProtocolError = u("ProtocolError")),
                            (o.oneOfGetter = function (t) {
                                for (var e = {}, r = 0; r < t.length; ++r) e[t[r]] = 1;
                                return function () {
                                    for (var t = Object.keys(this), r = t.length - 1; r > -1; --r)
                                        if (1 === e[t[r]] && void 0 !== this[t[r]] && null !== this[t[r]]) return t[r];
                                };
                            }),
                            (o.oneOfSetter = function (t) {
                                return function (e) {
                                    for (var r = 0; r < t.length; ++r) t[r] !== e && delete this[t[r]];
                                };
                            }),
                            (o.toJSONOptions = {
                                longs: String,
                                enums: String,
                                bytes: String,
                                json: true,
                            }),
                            (o._configure = function () {
                                var t = o.Buffer;
                                t
                                    ? ((o._Buffer_from =
                                        (t.from !== Uint8Array.from && t.from) ||
                                        function (e, r) {
                                            return new t(e, r);
                                        }),
                                        (o._Buffer_allocUnsafe =
                                            t.allocUnsafe ||
                                            function (e) {
                                                return new t(e);
                                            }))
                                    : (o._Buffer_from = o._Buffer_allocUnsafe = null);
                            }),
                            r.exports;
                    },
                    function () {
                        return {
                            "@protobufjs/aspromise": n,
                            "@protobufjs/base64": i,
                            "@protobufjs/eventemitter": o,
                            "@protobufjs/float": s,
                            "@protobufjs/inquire": u,
                            "@protobufjs/utf8": f,
                            "@protobufjs/pool": a,
                            "./longbits": c,
                        };
                    }
                );
            },
        };
    }
);