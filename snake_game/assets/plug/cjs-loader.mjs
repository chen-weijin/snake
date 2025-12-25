System.register("chunks:///_virtual/cjs-loader.mjs", [], function (t) {
    return {
        execute: function () {
            t(
                "default",
                new ((function () {
                    function t () {
                        (this._registry = {}), (this._moduleCache = {});
                    }
                    var e = t.prototype;
                    return (
                        (e.define = function (t, e, r) {
                            this._registry[t] = {
                                factory: e,
                                resolveMap: r,
                            };
                        }),
                        (e.require = function (t) {
                            return this._require(t);
                        }),
                        (e.throwInvalidWrapper = function (t, e) {
                            throw new Error(
                                "Module '" +
                                t +
                                "' imported from '" +
                                e +
                                "' is expected be an ESM-wrapped CommonJS module but it doesn't."
                            );
                        }),
                        (e._require = function (t, e) {
                            var r = this._moduleCache[t];
                            if (r) return r.exports;
                            var n = {
                                id: t,
                                exports: {},
                            };
                            return (this._moduleCache[t] = n), this._tryModuleLoad(n, t), n.exports;
                        }),
                        (e._resolve = function (t, e) {
                            return this._resolveFromInfos(t, e) || this._throwUnresolved(t, e);
                        }),
                        (e._resolveFromInfos = function (t, e) {
                            var r, n;
                            return t in cjsInfos
                                ? t
                                : e && null != (r = null == (n = cjsInfos[e]) ? void 0 : n.resolveCache[t])
                                    ? r
                                    : void 0;
                        }),
                        (e._tryModuleLoad = function (t, e) {
                            var r = !0;
                            try {
                                this._load(t, e), (r = !1);
                            } finally {
                                r && delete this._moduleCache[e];
                            }
                        }),
                        (e._load = function (t, e) {
                            var r = this._loadWrapper(e),
                                n = r.factory,
                                i = r.resolveMap,
                                o = this._createRequire(t),
                                s = i ? this._createRequireWithResolveMap("function" == typeof i ? i() : i, o) : o;
                            n(t.exports, s, t);
                        }),
                        (e._loadWrapper = function (t) {
                            return t in this._registry ? this._registry[t] : this._loadHostProvidedModules(t);
                        }),
                        (e._loadHostProvidedModules = function (t) {
                            return {
                                factory: function (e, r, n) {
                                    if ("undefined" == typeof require)
                                        throw new Error(
                                            "Current environment does not provide a require() for requiring '" + t + "'."
                                        );
                                    try {
                                        n.exports = require(t);
                                    } catch (e) {
                                        throw new Error("Exception thrown when calling host defined require('" + t + "').", {
                                            cause: e,
                                        });
                                    }
                                },
                            };
                        }),
                        (e._createRequire = function (t) {
                            var e = this;
                            return function (r) {
                                return e._require(r, t);
                            };
                        }),
                        (e._createRequireWithResolveMap = function (t, e) {
                            return function (r) {
                                var n = t[r];
                                if (n) return e(n);
                                throw new Error("Unresolved specifier " + r);
                            };
                        }),
                        (e._throwUnresolved = function (t, e) {
                            throw new Error("Unable to resolve " + t + " from " + parent + ".");
                        }),
                        t
                    );
                })())()
            );
        },
    };
});