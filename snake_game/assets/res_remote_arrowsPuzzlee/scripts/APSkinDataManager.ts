import { _decorator } from "cc";
import { BaseGameManager } from "../../start-scene/scripts/BaseGameManager";
import { APGameConfig } from "./APGameConfig";

export enum APSkinLockType {
    None = 0,
    Level = 1,
    AD = 2,
}

export class APSkinData {
    buyed = false;
    lockType = APSkinLockType.None;
    id: any;
    unlock: any;

    load(e) {
        this.id = e.id;
        this.unlock = e.unlock;
        this.buyed = e.buyed;
    }

    getSaveData() {
        return {
            id: this.id,
            unlock: this.unlock,
            buyed: this.buyed,
        };
    }
}

const { ccclass } = _decorator;
@ccclass("APSkinDataManager")
export class APSkinDataManager extends BaseGameManager {
    skins = {};

    get name() {
        return "ap_skin";
    }

    get SkinData() {
        return this.skins;
    }

    get curSkinId() {
        return this.get("curSkinId", -1);
    }
    set curSkinId(e) {
        this.save("curSkinId", e);
        console.log("当前皮肤", e);
    }

    get isDarkMode() {
        return this.get("isDarkMode", false);
    }
    set isDarkMode(e) {
        this.save("isDarkMode", e);
    }

    init() {}

    onManagerInit() {
        this.curSkinId < 0 && ((this.curSkinId = APGameConfig.gridResType), (this.isDarkMode = APGameConfig.isDarkMode));
        this.skins = {};
    }

    onload() {}

    unLockSkin(e) {
        this.skins[e].unlock = true;
        this.saveData();
    }

    buySkin(e) {
        this.skins[e].buyed || ((this.skins[e].buyed = true), this.saveData(), window.sm.ui.tip("购买成功"));
    }

    getSkinData(e) {
        return this.skins[e];
    }

    saveData() {
        var e = {};
        for (var t in this.skins) {
            var n = this.skins[t].getSaveData();
            e[t] = n;
        }
        this.save("skins", e);
    }

    checkUnlock() {
        for (var e in this.skins) this.skins[e];
        this.saveData();
    }

    getCurSkinPrefab() {}
}
