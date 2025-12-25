System.register("chunks:///_virtual/table_proto.js", ["./cjs-loader.mjs", "./minimal.js"], function (e, t) {
    var n, __cjsMetaURL;
    return {
        setters: [
            function (e) {
                n = e.default;
            },
            function (e) {
                __cjsMetaURL = e.__cjsMetaURL;
            },
        ],
        execute: function () {
            e("default", void 0);
            var o = e("__cjsMetaURL", t.meta.url);
            n.define(
                o,
                function (t, n, i, o, r) {
                    var obj = {};
                    var minimal = n("protobufjs/minimal.js");
                    var l_Reader = minimal.Reader;
                    var u_Writer = minimal.Writer;
                    var c_util = minimal.util;

                    obj.APColorData = (function () {
                        function ctor (e) {
                            if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }

                        ctor.prototype.id = 0;
                        ctor.prototype.name = "";
                        ctor.prototype.textureBody = "";
                        ctor.prototype.textureHead = "";
                        ctor.prototype.textureTail = "";
                        ctor.prototype.textureTailEnd = "";
                        ctor.encode = function (e, t) {
                            return (
                                t || (t = u_Writer.create()),
                                null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).int32(e.id),
                                null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name),
                                null != e.textureBody && Object.hasOwnProperty.call(e, "textureBody") && t.uint32(26).string(e.textureBody),
                                null != e.textureHead && Object.hasOwnProperty.call(e, "textureHead") && t.uint32(34).string(e.textureHead),
                                null != e.textureTail && Object.hasOwnProperty.call(e, "textureTail") && t.uint32(42).string(e.textureTail),
                                null != e.textureTailEnd &&
                                Object.hasOwnProperty.call(e, "textureTailEnd") &&
                                t.uint32(50).string(e.textureTailEnd),
                                t
                            );
                        };
                        ctor.encodeDelimited = function (e, t) {
                            return this.encode(e, t).ldelim();
                        };
                        ctor.decode = function (e, t) {
                            e instanceof l_Reader || (e = l_Reader.create(e));
                            for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APColorData(); e.pos < n;) {
                                var o = e.uint32();
                                switch (o >>> 3) {
                                    case 1:
                                        i.id = e.int32();
                                        break;

                                    case 2:
                                        i.name = e.string();
                                        break;

                                    case 3:
                                        i.textureBody = e.string();
                                        break;

                                    case 4:
                                        i.textureHead = e.string();
                                        break;

                                    case 5:
                                        i.textureTail = e.string();
                                        break;

                                    case 6:
                                        i.textureTailEnd = e.string();
                                        break;

                                    default:
                                        e.skipType(7 & o);
                                }
                            }
                            return i;
                        };
                        ctor.decodeDelimited = function (e) {
                            return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                        };

                        return ctor;
                    })();

                    obj.APColorDataArray = (function () {
                        function e (e) {
                            if (((this.items = []), e))
                                for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.items = c_util.emptyArray),
                            (e.encode = function (e, t) {
                                if ((t || (t = u_Writer.create()), null != e.items && e.items.length))
                                    for (var n = 0; n < e.items.length; ++n)
                                        window.table.APColorData.encode(e.items[n], t.uint32(10).fork()).ldelim();
                                return t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APColorDataArray(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            (i.items && i.items.length) || (i.items = []),
                                                i.items.push(window.table.APColorData.decode(e, e.uint32()));
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APConfigParamsData = (function () {
                        function e (e) {
                            if (((this.params = []), e))
                                for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.id = 0),
                            (e.prototype.name = ""),
                            (e.prototype.params = c_util.emptyArray),
                            (e.prototype.notes = ""),
                            (e.prototype.notes2 = ""),
                            (e.encode = function (e, t) {
                                if (
                                    (t || (t = u_Writer.create()),
                                        null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).int32(e.id),
                                        null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name),
                                        null != e.params && e.params.length)
                                )
                                    for (var n = 0; n < e.params.length; ++n) t.uint32(29).float(e.params[n]);
                                return (
                                    null != e.notes && Object.hasOwnProperty.call(e, "notes") && t.uint32(34).string(e.notes),
                                    null != e.notes2 && Object.hasOwnProperty.call(e, "notes2") && t.uint32(42).string(e.notes2),
                                    t
                                );
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APConfigParamsData(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            i.id = e.int32();
                                            break;

                                        case 2:
                                            i.name = e.string();
                                            break;

                                        case 3:
                                            if (((i.params && i.params.length) || (i.params = []), 2 == (7 & o)))
                                                for (var r = e.uint32() + e.pos; e.pos < r;) i.params.push(e.float());
                                            else i.params.push(e.float());
                                            break;

                                        case 4:
                                            i.notes = e.string();
                                            break;

                                        case 5:
                                            i.notes2 = e.string();
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APConfigParamsDataArray = (function () {
                        function e (e) {
                            if (((this.items = []), e))
                                for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.items = c_util.emptyArray),
                            (e.encode = function (e, t) {
                                if ((t || (t = u_Writer.create()), null != e.items && e.items.length))
                                    for (var n = 0; n < e.items.length; ++n)
                                        window.table.APConfigParamsData.encode(e.items[n], t.uint32(10).fork()).ldelim();
                                return t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (
                                    var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APConfigParamsDataArray();
                                    e.pos < n;

                                ) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            (i.items && i.items.length) || (i.items = []),
                                                i.items.push(window.table.APConfigParamsData.decode(e, e.uint32()));
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APLevelData = (function () {
                        function e (e) {
                            if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.id = 0),
                            (e.prototype.name = ""),
                            (e.prototype.sortId = 0),
                            (e.encode = function (e, t) {
                                return (
                                    t || (t = u_Writer.create()),
                                    null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).int32(e.id),
                                    null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name),
                                    null != e.sortId && Object.hasOwnProperty.call(e, "sortId") && t.uint32(24).int32(e.sortId),
                                    t
                                );
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APLevelData(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            i.id = e.int32();
                                            break;

                                        case 2:
                                            i.name = e.string();
                                            break;

                                        case 3:
                                            i.sortId = e.int32();
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APLevelDataArray = (function () {
                        function e (e) {
                            if (((this.items = []), e))
                                for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.items = c_util.emptyArray),
                            (e.encode = function (e, t) {
                                if ((t || (t = u_Writer.create()), null != e.items && e.items.length))
                                    for (var n = 0; n < e.items.length; ++n)
                                        window.table.APLevelData.encode(e.items[n], t.uint32(10).fork()).ldelim();
                                return t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APLevelDataArray(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            (i.items && i.items.length) || (i.items = []),
                                                i.items.push(window.table.APLevelData.decode(e, e.uint32()));
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APLevel2Data = (function () {
                        function e (e) {
                            if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.id = 0),
                            (e.prototype.name = ""),
                            (e.prototype.sortId = 0),
                            (e.encode = function (e, t) {
                                return (
                                    t || (t = u_Writer.create()),
                                    null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).int32(e.id),
                                    null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name),
                                    null != e.sortId && Object.hasOwnProperty.call(e, "sortId") && t.uint32(24).int32(e.sortId),
                                    t
                                );
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APLevel2Data(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            i.id = e.int32();
                                            break;

                                        case 2:
                                            i.name = e.string();
                                            break;

                                        case 3:
                                            i.sortId = e.int32();
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APLevel2DataArray = (function () {
                        function e (e) {
                            if (((this.items = []), e))
                                for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.items = c_util.emptyArray),
                            (e.encode = function (e, t) {
                                if ((t || (t = u_Writer.create()), null != e.items && e.items.length))
                                    for (var n = 0; n < e.items.length; ++n)
                                        window.table.APLevel2Data.encode(e.items[n], t.uint32(10).fork()).ldelim();
                                return t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APLevel2DataArray(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            (i.items && i.items.length) || (i.items = []),
                                                i.items.push(window.table.APLevel2Data.decode(e, e.uint32()));
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APShiWanData = (function () {
                        function e (e) {
                            if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.id = 0),
                            (e.prototype.name = ""),
                            (e.prototype.sortId = 0),
                            (e.prototype.skinId = 0),
                            (e.prototype.shiwanId = 0),
                            (e.prototype.limitHeart = !1),
                            (e.prototype.isDarkMode = !1),
                            (e.encode = function (e, t) {
                                return (
                                    t || (t = u_Writer.create()),
                                    null != e.id && Object.hasOwnProperty.call(e, "id") && t.uint32(8).int32(e.id),
                                    null != e.name && Object.hasOwnProperty.call(e, "name") && t.uint32(18).string(e.name),
                                    null != e.sortId && Object.hasOwnProperty.call(e, "sortId") && t.uint32(24).int32(e.sortId),
                                    null != e.skinId && Object.hasOwnProperty.call(e, "skinId") && t.uint32(32).int32(e.skinId),
                                    null != e.shiwanId && Object.hasOwnProperty.call(e, "shiwanId") && t.uint32(40).int32(e.shiwanId),
                                    null != e.limitHeart && Object.hasOwnProperty.call(e, "limitHeart") && t.uint32(48).bool(e.limitHeart),
                                    null != e.isDarkMode && Object.hasOwnProperty.call(e, "isDarkMode") && t.uint32(56).bool(e.isDarkMode),
                                    t
                                );
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APShiWanData(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            i.id = e.int32();
                                            break;

                                        case 2:
                                            i.name = e.string();
                                            break;

                                        case 3:
                                            i.sortId = e.int32();
                                            break;

                                        case 4:
                                            i.skinId = e.int32();
                                            break;

                                        case 5:
                                            i.shiwanId = e.int32();
                                            break;

                                        case 6:
                                            i.limitHeart = e.bool();
                                            break;

                                        case 7:
                                            i.isDarkMode = e.bool();
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.APShiWanDataArray = (function () {
                        function e (e) {
                            if (((this.items = []), e))
                                for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.prototype.items = c_util.emptyArray),
                            (e.encode = function (e, t) {
                                if ((t || (t = u_Writer.create()), null != e.items && e.items.length))
                                    for (var n = 0; n < e.items.length; ++n)
                                        window.table.APShiWanData.encode(e.items[n], t.uint32(10).fork()).ldelim();
                                return t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.APShiWanDataArray(); e.pos < n;) {
                                    var o = e.uint32();
                                    switch (o >>> 3) {
                                        case 1:
                                            (i.items && i.items.length) || (i.items = []),
                                                i.items.push(window.table.APShiWanData.decode(e, e.uint32()));
                                            break;

                                        default:
                                            e.skipType(7 & o);
                                    }
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            e
                        );
                    })();

                    obj.Common = (function () {
                        function e (e) {
                            if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.encode = function (e, t) {
                                return t || (t = u_Writer.create()), t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.Common(); e.pos < n;) {
                                    var o = e.uint32();
                                    e.skipType(7 & o);
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            (e.MsgType0 = (function () {
                                function e (e) {
                                    if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                                }
                                var t, n;
                                return (
                                    (e.encode = function (e, t) {
                                        return t || (t = u_Writer.create()), t;
                                    }),
                                    (e.encodeDelimited = function (e, t) {
                                        return this.encode(e, t).ldelim();
                                    }),
                                    (e.decode = function (e, t) {
                                        e instanceof l_Reader || (e = l_Reader.create(e));
                                        for (
                                            var n = void 0 === t ? e.len : e.pos + t, i = new window.table.Common.MsgType0();
                                            e.pos < n;

                                        ) {
                                            var o = e.uint32();
                                            e.skipType(7 & o);
                                        }
                                        return i;
                                    }),
                                    (e.decodeDelimited = function (e) {
                                        return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                                    }),
                                    (e.MsgType =
                                        ((t = {}),
                                            ((n = Object.create(t))[(t[0] = "None")] = 0),
                                            (n[(t[1] = "Floating_prompt")] = 1),
                                            (n[(t[2] = "ConfirmOK")] = 2),
                                            (n[(t[3] = "ConfirmYN")] = 3),
                                            n)),
                                    e
                                );
                            })()),
                            e
                        );
                    })();

                    obj.Item = (function () {
                        function e (e) {
                            if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                        }
                        return (
                            (e.encode = function (e, t) {
                                return t || (t = u_Writer.create()), t;
                            }),
                            (e.encodeDelimited = function (e, t) {
                                return this.encode(e, t).ldelim();
                            }),
                            (e.decode = function (e, t) {
                                e instanceof l_Reader || (e = l_Reader.create(e));
                                for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.Item(); e.pos < n;) {
                                    var o = e.uint32();
                                    e.skipType(7 & o);
                                }
                                return i;
                            }),
                            (e.decodeDelimited = function (e) {
                                return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                            }),
                            (e.ItemType0 = (function () {
                                function e (e) {
                                    if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                                }
                                var t, n;
                                return (
                                    (e.encode = function (e, t) {
                                        return t || (t = u_Writer.create()), t;
                                    }),
                                    (e.encodeDelimited = function (e, t) {
                                        return this.encode(e, t).ldelim();
                                    }),
                                    (e.decode = function (e, t) {
                                        e instanceof l_Reader || (e = l_Reader.create(e));
                                        for (var n = void 0 === t ? e.len : e.pos + t, i = new window.table.Item.ItemType0(); e.pos < n;) {
                                            var o = e.uint32();
                                            e.skipType(7 & o);
                                        }
                                        return i;
                                    }),
                                    (e.decodeDelimited = function (e) {
                                        return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                                    }),
                                    (e.ItemType =
                                        ((t = {}),
                                            ((n = Object.create(t))[(t[0] = "None")] = 0),
                                            (n[(t[1] = "Currency")] = 1),
                                            (n[(t[2] = "Consumable")] = 2),
                                            (n[(t[3] = "Collection")] = 3),
                                            n)),
                                    e
                                );
                            })()),
                            (e.CurrencyType0 = (function () {
                                function e (e) {
                                    if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                                }
                                var t, n;
                                return (
                                    (e.encode = function (e, t) {
                                        return t || (t = u_Writer.create()), t;
                                    }),
                                    (e.encodeDelimited = function (e, t) {
                                        return this.encode(e, t).ldelim();
                                    }),
                                    (e.decode = function (e, t) {
                                        e instanceof l_Reader || (e = l_Reader.create(e));
                                        for (
                                            var n = void 0 === t ? e.len : e.pos + t, i = new window.table.Item.CurrencyType0();
                                            e.pos < n;

                                        ) {
                                            var o = e.uint32();
                                            e.skipType(7 & o);
                                        }
                                        return i;
                                    }),
                                    (e.decodeDelimited = function (e) {
                                        return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                                    }),
                                    (e.CurrencyType =
                                        ((t = {}),
                                            ((n = Object.create(t))[(t[0] = "None")] = 0),
                                            (n[(t[1] = "Normal")] = 1),
                                            (n[(t[2] = "Valuable")] = 2),
                                            (n[(t[3] = "Recovery")] = 3),
                                            n)),
                                    e
                                );
                            })()),
                            (e.ItemSubType0 = (function () {
                                function e (e) {
                                    if (e) for (var t = Object.keys(e), n = 0; n < t.length; ++n) null != e[t[n]] && (this[t[n]] = e[t[n]]);
                                }
                                var t, n;
                                return (
                                    (e.encode = function (e, t) {
                                        return t || (t = u_Writer.create()), t;
                                    }),
                                    (e.encodeDelimited = function (e, t) {
                                        return this.encode(e, t).ldelim();
                                    }),
                                    (e.decode = function (e, t) {
                                        e instanceof l_Reader || (e = l_Reader.create(e));
                                        for (
                                            var n = void 0 === t ? e.len : e.pos + t, i = new window.table.Item.ItemSubType0();
                                            e.pos < n;

                                        ) {
                                            var o = e.uint32();
                                            e.skipType(7 & o);
                                        }
                                        return i;
                                    }),
                                    (e.decodeDelimited = function (e) {
                                        return e instanceof l_Reader || (e = new l_Reader(e)), this.decode(e, e.uint32());
                                    }),
                                    (e.ItemSubType =
                                        ((t = {}),
                                            ((n = Object.create(t))[(t[0] = "None")] = 0),
                                            (n[(t[1] = "Normal")] = 1),
                                            (n[(t[2] = "Pack")] = 2),
                                            (n[(t[3] = "PackAutoUnpack")] = 3),
                                            n)),
                                    e
                                );
                            })()),
                            e
                        );
                    })();

                    window.table = obj;
                    i.exports = window;
                    e("default", i.exports);
                },
                function () {
                    return {
                        "protobufjs/minimal.js": __cjsMetaURL,
                    };
                }
            );
        },
    };
});
