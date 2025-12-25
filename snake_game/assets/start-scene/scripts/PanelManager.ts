import { instantiate, js } from "cc";
import { SdkGameConfig } from "./SdkConfig";
import BasePanel from "./BasePanel";

export default class PanelManager {
    panelMap = {};
    idx = 1000;
    layer_bottom;
    layer_panel;
    layer_top;

    static _instnce;

    constructor(t, n, i) {
        this.layer_bottom = t;
        this.layer_panel = n;
        this.layer_top = i;
        PanelManager._instnce = this;
    }

    static get instance() {
        return this._instnce;
    }

    load(e) {
        var t = this;
        return this.panelMap.hasOwnProperty(e)
            ? Promise.resolve(this.panelMap[e])
            : new Promise(function (n, i) {
                  window.sm.res
                      .loadPrefab("panel/" + e)
                      .then(function (i) {
                          if (t.panelMap.hasOwnProperty(e)) n(t.panelMap[e]);
                          else {
                              var o = instantiate(i),
                                  a = o.getComponent(BasePanel);
                              o.setParent(a.layer), a.initialize(), (t.panelMap[e] = a), n(a);
                          }
                      })
                      .catch(function (t) {
                          window.sm.log.error("[" + e + "]初始化失败", t), i(t);
                      });
              });
    }
    async preload(t) {
        const i = js.getClassName(t);
        return this.load(i);
    }

    panel(e) {
        var t = js.getClassName(e);
        return this.panelMap[t];
    }
    open(e) {
        var t = this,
            n = js.getClassName(e);
        return new Promise(function (e, i) {
            SdkGameConfig.isShowDebugLog && console.log("开始打开面板", n),
                t
                    .load(n)
                    .then(function (i) {
                        SdkGameConfig.isShowDebugLog && console.log("面板加载完成，进行面板展示", n),
                            i.node.setSiblingIndex(t.idx++),
                            i.show(),
                            e(i);
                    })
                    .catch(function (e) {
                        window.sm.log.error("[" + n + "]打开失败", e), i(e);
                    });
        });
    }
    close(e) {
        var t = this.panel(e);
        t && t.close();
    }
    reset() {
        this.layer_panel.removeAllChildren();
    }
    refresh() {
        for (var e = this.layer_panel.children.length; e >= 0; --e) {
            var t = this.layer_panel.children[e];
            if (t && t.active && t.getComponent(BasePanel)) return t.getComponent(BasePanel).refresh();
        }
    }
}
