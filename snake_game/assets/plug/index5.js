System.register("chunks:///_virtual/index5.js", ["./cjs-loader.mjs"], function (exports, module) {
    var loader;
    return {
        setters: [
            function (t) {
                loader = t.default;
            },
        ],
        execute: function execute () {
            var __cjsMetaURL = exports("__cjsMetaURL", module.meta.url);
            loader.define(
                __cjsMetaURL,
                function (exports, require, module, __filename, __dirname) {
                    function inquire (moduleName) {
                        try {
                            var mod = eval("quire".replace(/^/, "re"))(moduleName);
                            if (mod && (mod.length || Object.keys(mod).length)) return mod;
                        } catch (t) { }
                        return null;
                    }
                    (module.exports = inquire), module.exports;
                },
                {}
            );
        },
    };
});