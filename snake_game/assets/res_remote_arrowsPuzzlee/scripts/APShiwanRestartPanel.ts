import { _decorator } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APPanelId } from "./APEnum";

const { ccclass } = _decorator;
@ccclass("APShiwanRestartPanel")
export class APShiwanRestartPanel extends BasePanel {
    btnRestart: any;
    get layer() {
        return window.sm.ui.layer_top;
    }

    get panelId() {
        return APPanelId.APShiwanRestartPanel;
    }

    init() {
        this.btnRestart = smtools.click(this.node, "btnRestart", this.onRestart, this);
    }

    onRestart() {
        window.btl_ap.ctrl.curStageItem.onRestart();
        this.close();
        console.log("### shibai");
    }
}
