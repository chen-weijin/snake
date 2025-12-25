import { _decorator } from "cc";
import { APLevelDataManager } from "./APLevelDataManager";
import { APMatDataManager } from "./APMatDataManager";
import { APPlayerDataManager } from "./APPlayerDataManager";
import { APSkinDataManager } from "./APSkinDataManager";

const { ccclass } = _decorator;
@ccclass("GameManager_ArrowsPuzzlee")
export class GameManager_ArrowsPuzzlee {
    constructor() {}

    get level() {
        return APLevelDataManager.instance();
    }

    get player() {
        return APPlayerDataManager.instance();
    }

    get mat() {
        return APMatDataManager.instance();
    }

    get skin() {
        return APSkinDataManager.instance();
    }
}

window.gm_ap = new GameManager_ArrowsPuzzlee();
