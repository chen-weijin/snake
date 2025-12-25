import { _decorator } from "cc";
import { ArrowsPuzzleeCtrl } from "./ArrowsPuzzleeCtrl";

const { ccclass } = _decorator;
@ccclass("APBattleGlobal")
export class APBattleGlobal {
    get ctrl() {
        return ArrowsPuzzleeCtrl.instance;
    }
}

window.btl_ap = new APBattleGlobal();
