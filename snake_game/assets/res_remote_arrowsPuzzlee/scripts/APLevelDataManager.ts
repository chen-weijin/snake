import { _decorator, director } from "cc";
import { BaseGameManager } from "../../start-scene/scripts/BaseGameManager";
import TableManager from "../../start-scene/scripts/TableManager";
import { APGameConfig } from "./APGameConfig";
import { TblAPLevel } from "./TblAPLevel";
import { TblAPLevel2 } from "./TblAPLevel2";
import { TblAPShiWan } from "./TblAPShiWan";

const { ccclass } = _decorator;
@ccclass("APLevelDataManager")
export class APLevelDataManager extends BaseGameManager {
    allLevels = {};
    levels = [];

    get name() {
        return "level";
    }

    get levelIdx() {
        return this.get("levelIdx", 0);
    }

    set levelIdx(e) {
        var t = this;
        this.levelIdx > 98 - APGameConfig.loadNextLevel &&
            !APGameConfig.isShiWan &&
            TableManager.instance()
                .loadTable_lazy("arrowsPuzzlee", "TblAPLevel2")
                .then(function (e) {
                    (e && e.alreadyLoaded) ||
                        (console.log("按需加载完成"),
                        t.changeLevelData(),
                        console.log("level length :" + t.levels.length),
                        director.emit(APLevelDataManager.LoadTGLevel2Lazy));
                })
                .catch(function (e) {
                    console.log("解析错误" + e);
                }),
            this.save("levelIdx", e);
    }

    get dayLevel() {
        return this.get("dayLevel", 0);
    }

    set dayLevel(e) {
        this.save("dayLevel", e);
    }

    get feedCount() {
        return this.get("feedCount", 0);
    }

    set feedCount(e) {
        this.save("feedCount", e);
    }

    static LoadTGLevel2Lazy = "APLevel2Lazy";

    init() {}
    onManagerInit() {
        var e = this;
        window.SmSdk.sdkImp.isSdkNewDay && ((this.dayLevel = 0), (this.feedCount = 0)),
            APGameConfig.isShiWan
                ? ((this.levelIdx = 0), (this.allLevels = TblAPShiWan.AllLevels), (this.levels = TblAPShiWan.Levels))
                : ((this.allLevels = TblAPLevel.AllLevels), (this.levels = TblAPLevel.Levels)),
            this.levels.sort(function (e, t) {
                return APGameConfig.isShiWan
                    ? window.sm.tbl.find(TblAPShiWan, e).data().sortId - window.sm.tbl.find(TblAPShiWan, t).data().sortId
                    : window.sm.tbl.find(TblAPLevel, e).data().sortId - window.sm.tbl.find(TblAPLevel, t).data().sortId;
            }),
            this.levelIdx > 98 - APGameConfig.loadNextLevel &&
                !APGameConfig.isShiWan &&
                TableManager.instance()
                    .loadTable_lazy("arrowsPuzzlee", "TblAPLevel2")
                    .then(function (t) {
                        (t && t.alreadyLoaded) ||
                            (console.log("按需加载完成"),
                            e.changeLevelData(),
                            console.log("level length :" + e.levels.length),
                            director.emit(APLevelDataManager.LoadTGLevel2Lazy));
                    })
                    .catch(function (e) {
                        console.log("解析错误" + e);
                    });
    }
    getValidLevelId(e?) {
        void 0 === e && (e = this.levelIdx);
        if (this.levels.length <= 1) return this.levels[0];
        if (0 === e) return this.levels[0];
        var t = ((e - 1) % (this.levels.length - 1)) + 1;
        return this.levels[t];
    }
    changeLevelData() {
        (this.allLevels = {}), (this.allLevels = TblAPLevel.AllLevels), (this.levels = TblAPLevel.Levels);
        var e = new Set(window.sm.tbl.keys(TblAPLevel));
        this.levels.sort(function (t, n) {
            var i = function (t) {
                return e.has(t) ? window.sm.tbl.find(TblAPLevel, t).data().sortId : window.sm.tbl.find(TblAPLevel2, t).data().sortId;
            };
            return i(t) - i(n);
        });
    }
    getLevelNum() {
        return this.levelIdx + 1;
    }
    getLevelJsonName() {
        var e = this.getValidLevelId();
        return this.allLevels[e];
    }
    getLevelJsonNameById(e) {
        var t = this.getValidLevelId(e);
        return this.allLevels[t];
    }
    getCurShiWanData() {
        var e = this.getValidLevelId();
        return window.sm.tbl.find(TblAPShiWan, e).data();
    }
}
