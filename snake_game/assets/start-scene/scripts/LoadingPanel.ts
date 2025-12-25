import { _decorator, ProgressBar } from "cc";
import smtools from "./SmTools";
import BasePanel from "./BasePanel";
import { PanelId } from "./PanelId";

const { ccclass } = _decorator;
@ccclass("LoadingPanel")
export class LoadingPanel extends BasePanel {
    fadeLoadTime = 2;
    reallyPro = 0;
    progressBar: any;
    callback: any;

    get panelId() {
        return PanelId.LoadingPanel;
    }

    get layer() {
        return window.sm.ui.layer_notice;
    }

    onLoad() {
        this.progressBar = smtools.find(this.node, "loadProgress", ProgressBar);
    }
    onShow() {
        (this.progressBar.progress = 0), (this.fadeLoadTime = 2);
    }
    refreshProgress(e) {
        this.reallyPro = e;
    }
    update(e) {
        (this.fadeLoadTime -= e),
            (this.progressBar.progress = Math.min((2 - this.fadeLoadTime) / 2, this.reallyPro)),
            this.fadeLoadTime <= 0 && (this.callback && this.callback(), (this.callback = null));
    }
    setCallBack(e) {
        this.callback = e;
    }
}
