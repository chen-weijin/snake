System.register("chunks:///_virtual/reader.js", ["./cjs-loader.mjs", "./minimal2.js"], function (t, e) {
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
                    r.exports = c;
                    var o,
                        s = e("./util/minimal"),
                        u = s.LongBits,
                        f = s.utf8;
                    function a (t, e) {
                        return RangeError("index out of range: " + t.pos + " + " + (e || 1) + " > " + t.len);
                    }
                    function c (t) {
                        (this.buf = t), (this.pos = 0), (this.len = t.length);
                    }
                    var l,
                        h =
                            "undefined" != typeof Uint8Array
                                ? function (t) {
                                    if (t instanceof Uint8Array || Array.isArray(t)) return new c(t);
                                    throw Error("illegal buffer");
                                }
                                : function (t) {
                                    if (Array.isArray(t)) return new c(t);
                                    throw Error("illegal buffer");
                                },
                        p = function () {
                            return s.Buffer
                                ? function (t) {
                                    return (c.create = function (t) {
                                        return s.Buffer.isBuffer(t) ? new o(t) : h(t);
                                    })(t);
                                }
                                : h;
                        };
                    function d () {
                        var t = new u(0, 0),
                            e = 0;
                        if (!(this.len - this.pos > 4)) {
                            for (; e < 3; ++e) {
                                if (this.pos >= this.len) throw a(this);
                                if (
                                    ((t.lo = (t.lo | ((127 & this.buf[this.pos]) << (7 * e))) >>> 0),
                                        this.buf[this.pos++] < 128)
                                )
                                    return t;
                            }
                            return (t.lo = (t.lo | ((127 & this.buf[this.pos++]) << (7 * e))) >>> 0), t;
                        }
                        for (; e < 4; ++e)
                            if (((t.lo = (t.lo | ((127 & this.buf[this.pos]) << (7 * e))) >>> 0), this.buf[this.pos++] < 128))
                                return t;
                        if (
                            ((t.lo = (t.lo | ((127 & this.buf[this.pos]) << 28)) >>> 0),
                                (t.hi = (t.hi | ((127 & this.buf[this.pos]) >> 4)) >>> 0),
                                this.buf[this.pos++] < 128)
                        )
                            return t;
                        if (((e = 0), this.len - this.pos > 4)) {
                            for (; e < 5; ++e)
                                if (
                                    ((t.hi = (t.hi | ((127 & this.buf[this.pos]) << (7 * e + 3))) >>> 0),
                                        this.buf[this.pos++] < 128)
                                )
                                    return t;
                        } else
                            for (; e < 5; ++e) {
                                if (this.pos >= this.len) throw a(this);
                                if (
                                    ((t.hi = (t.hi | ((127 & this.buf[this.pos]) << (7 * e + 3))) >>> 0),
                                        this.buf[this.pos++] < 128)
                                )
                                    return t;
                            }
                        throw Error("invalid varint encoding");
                    }
                    function m (t, e) {
                        return (t[e - 4] | (t[e - 3] << 8) | (t[e - 2] << 16) | (t[e - 1] << 24)) >>> 0;
                    }
                    function y () {
                        if (this.pos + 8 > this.len) throw a(this, 8);
                        return new u(m(this.buf, (this.pos += 4)), m(this.buf, (this.pos += 4)));
                    }
                    (c.create = p()),
                        (c.prototype._slice = s.Array.prototype.subarray || s.Array.prototype.slice),
                        (c.prototype.uint32 =
                            ((l = 4294967295),
                                function () {
                                    if (((l = (127 & this.buf[this.pos]) >>> 0), this.buf[this.pos++] < 128)) return l;
                                    if (((l = (l | ((127 & this.buf[this.pos]) << 7)) >>> 0), this.buf[this.pos++] < 128)) return l;
                                    if (((l = (l | ((127 & this.buf[this.pos]) << 14)) >>> 0), this.buf[this.pos++] < 128))
                                        return l;
                                    if (((l = (l | ((127 & this.buf[this.pos]) << 21)) >>> 0), this.buf[this.pos++] < 128))
                                        return l;
                                    if (((l = (l | ((15 & this.buf[this.pos]) << 28)) >>> 0), this.buf[this.pos++] < 128)) return l;
                                    if ((this.pos += 5) > this.len) throw ((this.pos = this.len), a(this, 10));
                                    return l;
                                })),
                        (c.prototype.int32 = function () {
                            return 0 | this.uint32();
                        }),
                        (c.prototype.sint32 = function () {
                            var t = this.uint32();
                            return ((t >>> 1) ^ -(1 & t)) | 0;
                        }),
                        (c.prototype.bool = function () {
                            return 0 !== this.uint32();
                        }),
                        (c.prototype.fixed32 = function () {
                            if (this.pos + 4 > this.len) throw a(this, 4);
                            return m(this.buf, (this.pos += 4));
                        }),
                        (c.prototype.sfixed32 = function () {
                            if (this.pos + 4 > this.len) throw a(this, 4);
                            return 0 | m(this.buf, (this.pos += 4));
                        }),
                        (c.prototype.float = function () {
                            if (this.pos + 4 > this.len) throw a(this, 4);
                            var t = s.float.readFloatLE(this.buf, this.pos);
                            return (this.pos += 4), t;
                        }),
                        (c.prototype.double = function () {
                            if (this.pos + 8 > this.len) throw a(this, 4);
                            var t = s.float.readDoubleLE(this.buf, this.pos);
                            return (this.pos += 8), t;
                        }),
                        (c.prototype.bytes = function () {
                            var t = this.uint32(),
                                e = this.pos,
                                r = this.pos + t;
                            if (r > this.len) throw a(this, t);
                            return (
                                (this.pos += t),
                                Array.isArray(this.buf)
                                    ? this.buf.slice(e, r)
                                    : e === r
                                        ? new this.buf.constructor(0)
                                        : this._slice.call(this.buf, e, r)
                            );
                        }),
                        (c.prototype.string = function () {
                            var t = this.bytes();
                            return f.read(t, 0, t.length);
                        }),
                        (c.prototype.skip = function (t) {
                            if ("number" == typeof t) {
                                if (this.pos + t > this.len) throw a(this, t);
                                this.pos += t;
                            } else
                                do {
                                    if (this.pos >= this.len) throw a(this);
                                } while (128 & this.buf[this.pos++]);
                            return this;
                        }),
                        (c.prototype.skipType = function (t) {
                            switch (t) {
                                case 0:
                                    this.skip();
                                    break;

                                case 1:
                                    this.skip(8);
                                    break;

                                case 2:
                                    this.skip(this.uint32());
                                    break;

                                case 3:
                                    for (; 4 != (t = 7 & this.uint32());) this.skipType(t);
                                    break;

                                case 5:
                                    this.skip(4);
                                    break;

                                default:
                                    throw Error("invalid wire type " + t + " at offset " + this.pos);
                            }
                            return this;
                        }),
                        (c._configure = function (t) {
                            (o = t), (c.create = p()), o._configure();
                            var e = s.Long ? "toLong" : "toNumber";
                            s.merge(c.prototype, {
                                int64: function () {
                                    return d.call(this)[e](false);
                                },
                                uint64: function () {
                                    return d.call(this)[e](true);
                                },
                                sint64: function () {
                                    return d.call(this).zzDecode()[e](false);
                                },
                                fixed64: function () {
                                    return y.call(this)[e](true);
                                },
                                sfixed64: function () {
                                    return y.call(this)[e](false);
                                },
                            });
                        }),
                        r.exports;
                },
                function () {
                    return {
                        "./util/minimal": n,
                    };
                }
            );
        },
    };
});