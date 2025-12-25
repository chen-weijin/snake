import { assetManager, Prefab, instantiate, Camera, director, game, js } from "cc";

export class SmSdkPanel {
    panelMap = {};
    loadingPanel = {};
    rootFunc;
    sdkRootNode: import("cc").Node;
    rootPanel: import("cc").Node;

    get funcRoot() {
        return this.rootFunc;
    }

    initRoot(e) {
        var t = this;
        assetManager.getBundle("smsdk").load("sdkRoot", Prefab, function (n, i) {
            if (n) console.error("### smsdk ### [sdkRoot]初始化失败", n);
            else {
                (t.sdkRootNode = instantiate(i)),
                    (t.sdkRootNode.layer = 1),
                    (t.sdkRootNode.getComponentInChildren(Camera).visibility = t.sdkRootNode.layer),
                    (t.rootPanel = t.sdkRootNode.getChildByName("root_panel")),
                    (t.rootFunc = t.sdkRootNode.getChildByName("root_func"));
                var o = director.getScene();
                o.addChild(t.sdkRootNode),
                    t.sdkRootNode.setSiblingIndex(o.children.length - 1),
                    game.addPersistRootNode(t.sdkRootNode),
                    e();
            }
        });
    }
    getPanel(e) {
        var t = js.getClassName(e);
        return this.panelMap.hasOwnProperty(t) ? this.panelMap[t] : null;
    }
    showPanel(e, t = false) {
        var n = this;
        var i = js.getClassName(e);
        if (this.panelMap.hasOwnProperty(i)) {
            var a = this.panelMap[i];
            return (a.node.active = true), Promise.resolve(a);
        }
        if (this.loadingPanel.hasOwnProperty(i)) return this.loadingPanel[i];
        var s = "panel/" + i,
            l = new Promise(function (e, a) {
                n.findBundle(s).load(s, Prefab, function (o, l) {
                    if (o) return console.error("### smsdk ### [" + s + "]初始化失败", o), a(o);
                    if (n.panelMap.hasOwnProperty(i)) return e(n.panelMap[i]);
                    var u = instantiate(l),
                        c = u.addComponent(i);
                    t ? u.setParent(n.rootFunc) : u.setParent(n.rootPanel), c.initialize(), (n.panelMap[i] = c), e(c);
                });
            });
        return (this.loadingPanel[i] = l), l;
    }
    closePanel(e) {
        var t = js.getClassName(e);
        return this.panelMap.hasOwnProperty(t)
            ? this.panelMap[t].close()
            : this.loadingPanel.hasOwnProperty(t)
            ? this.loadingPanel[t].then(function (e) {
                  return e.close();
              })
            : void 0;
    }
    findBundle(e) {
        var t = assetManager.bundles._map;
        for (var n in t) if (t[n].config.paths._map[e]) return assetManager.getBundle(t[n].name);
        return console.error("没有找到对应资源", e), null;
    }
}
