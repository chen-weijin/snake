import { assetManager, instantiate, director } from "cc";
import TableManager from "./TableManager";
import Singleton from "./Singleton";
import Loading from "./Loading";
import { LoadingPanel } from "./LoadingPanel";

export class BattleCtrl extends Singleton {
    paused = false;
    battleTime = 0;
    lastReportTime = 0;
    loadFlags = {};
    miniGameCtrls = {};

    init() {}
    update2(e) {
        this.paused ||
            ((e = Math.min(e, 0.1)),
            (this.battleTime += e),
            this.battleTime - this.lastReportTime >= 60 && (this.lastReportTime = this.battleTime));
    }
    clearAll() {}
    enterMiniGame(e, t) {
        var n = this;
        if (!this.loadFlags[e] || this.miniGameCtrls[e]) {
            window.SmSdk.stat.cusEventOnce("miniGameClickOnce_" + e),
                window.SmSdk.stat.cusEvent("miniGameClick_" + e),
                (this.loadFlags[e] = true);
            var r = this.miniGameCtrls[e];
            r
                ? window.sm.ui.open(LoadingPanel).then(function (e) {
                      r.init();
                  })
                : assetManager.loadBundle(t, function (i, r) {
                      var s;
                      if ((i && console.log("### load bundle " + t + " error " + i), null == (s = Loading.instance) || s.setPro(0.6), r)) {
                          var u = e + "MiniDataLoaded";
                          window.sm.event.on(u, function () {
                              var t;
                              n.miniGameCtrls[e] ||
                                  (null == (t = Loading.instance) || t.setPro(0.7),
                                  window.sm.res.loadPrefab("prefab/" + e + "_Ctrl").then(function (t) {
                                      var i, r;
                                      if ((null == (i = Loading.instance) || i.setPro(0.8), !n.miniGameCtrls[e])) {
                                          var a = instantiate(t);
                                          a.parent = window.btl.map.itemHolder;
                                          var s = e.charAt(0).toUpperCase() + e.slice(1) + "Ctrl",
                                              u = a.getComponent(s);
                                          null == (r = Loading.instance) || r.setPro(0.9),
                                              console.log("str " + s),
                                              u.init(),
                                              (n.miniGameCtrls[e] = u);
                                      }
                                  }));
                          }),
                              TableManager.instance().loadData_mini(e, u);
                      } else window.sm.ui.tip("加载资源失败，请重启游戏");
                  });
        }
    }
    changeDirectorPaused() {
        director.isPaused() ? director.resume() : director.pause();
    }
    adCallBack() {
        for (var e in this.miniGameCtrls) {
            var t;
            null == (t = this.miniGameCtrls[e]) || t.adCallBack();
        }
    }
}
