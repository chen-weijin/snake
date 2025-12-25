import { _decorator, director } from "cc";
import { smtime } from "../../start-scene/scripts/SmTime";
import { BaseGameManager } from "../../start-scene/scripts/BaseGameManager";
import { APEResConfig, APEGuideStep } from "./APEnum";
import { TblAPConfigParams } from "./TblAPConfigParams";

const { ccclass } = _decorator;
@ccclass("APPlayerDataManager")
export class APPlayerDataManager extends BaseGameManager {
    isBoosterGuide = false;

    get name() {
        return "ap_player";
    }

    get initRes() {
        return this.get("initRes", false);
    }
    set initRes(e) {
        this.save("initRes", e);
    }

    get resCount() {
        return this.get("resCount", {});
    }
    set resCount(e) {
        this.save("resCount", e);
    }

    get curGuideStep() {
        return this.get("curGuideStep", APEGuideStep.ClickGuide1);
    }
    set curGuideStep(e) {
        this.save("curGuideStep", e);
    }

    get sensitivity() {
        return this.get("sensitivity", 1);
    }
    set sensitivity(e) {
        this.save("sensitivity", e);
    }

    get firstHintBooster() {
        return this.get("firstHintBooster", false);
    }
    set firstHintBooster(e) {
        this.save("firstHintBooster", e);
    }

    get endLessHpStartTime() {
        return this.get("endLessHpStartTime", 0);
    }
    set endLessHpStartTime(e) {
        this.save("endLessHpStartTime", e);
    }

    get endLessHpKeepTime() {
        return this.get("endLessHpKeepTime", 30);
    }
    set endLessHpKeepTime(e) {
        this.save("endLessHpKeepTime", e);
    }

    get endLessHp() {
        return smtime.now() - this.endLessHpStartTime < this.endLessHpKeepTime && 0 != this.endLessHpStartTime;
    }

    onManagerInit() {
        if (!this.initRes) {
            this.initRes = true;
            var e = {};
            for (var t in this.resCount) e[t] = this.resCount[t];
            for (var n = window.sm.tbl.find(TblAPConfigParams, APEResConfig.InitialRes).data(), i = 0; i < n.params.length; i += 2) {
                var o = n.params[i],
                    s = n.params[i + 1];
                e[o] = s;
            }
            this.resCount = e;
        }
    }
    init() {}
    itemCount(e) {
        return this.resCount[e] ? this.resCount[e] : 0;
    }
    addItem(e, t) {
        if (t < 0) throw new Error("道具:" + e + "获得数量不能小于0, 当前:" + t);
        if (0 !== t) {
            var n = {};
            for (var i in this.resCount) n[i] = this.resCount[i];
            null == n[e] ? (n[e] = 0) : (n[e] += t), (this.resCount = n), director.emit("APResUpdate", e);
        }
    }
    decItem(e, t) {
        if ((console.log("dec"), t < 0)) throw new Error("道具:" + e + "消费数量不能小于0, 当前:" + t);
        if (0 !== t) {
            var n = {};
            for (var i in this.resCount) n[i] = this.resCount[i];
            if ((n[e] || (n[e] = 0), n[e] < t)) throw new Error("道具数量不够！");
            (n[e] -= t), (this.resCount = n), director.emit("APResUpdate", e);
        }
    }
}
