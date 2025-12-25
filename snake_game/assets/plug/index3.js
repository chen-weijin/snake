System.register("chunks:///_virtual/index3.js", ["./cjs-loader.mjs"], function (t, e) {
    var r;
    return {
        setters: [
            function (t) {
                r = t.default;
            },
        ],
        execute: function () {
            var n = t("__cjsMetaURL", e.meta.url);
            r.define(
                n,
                function (t, e, r, n, i) {
                    function o () {
                        this._listeners = {};
                    }
                    (r.exports = o),
                        (o.prototype.on = function (t, e, r) {
                            return (
                                (this._listeners[t] || (this._listeners[t] = [])).push({
                                    fn: e,
                                    ctx: r || this,
                                }),
                                this
                            );
                        }),
                        (o.prototype.off = function (t, e) {
                            if (void 0 === t) this._listeners = {};
                            else if (void 0 === e) this._listeners[t] = [];
                            else for (var r = this._listeners[t], n = 0; n < r.length;) r[n].fn === e ? r.splice(n, 1) : ++n;
                            return this;
                        }),
                        (o.prototype.emit = function (t) {
                            var e = this._listeners[t];
                            if (e) {
                                for (var r = [], n = 1; n < arguments.length;) r.push(arguments[n++]);
                                for (n = 0; n < e.length;) e[n].fn.apply(e[n++].ctx, r);
                            }
                            return this;
                        }),
                        r.exports;
                },
                {}
            );
        },
    };
});