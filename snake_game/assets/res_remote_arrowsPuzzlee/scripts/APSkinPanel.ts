import { _decorator, director } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APPanelId } from "./APEnum";
import { APSkinUIItem } from "./APSkinUIItem";
import { APMenuPanel } from "./APMenuPanel";

const { ccclass } = _decorator;
@ccclass("APSkinPanel")
export class APSkinPanel extends BasePanel {
    skinUIItem = [];
    ids = [];
    skinItem = [];
    skinContent: any;
    btnDark: any;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APSettingPanel;
    }

    init() {
        director.on("selectSkin", this.onSelectSkin, this);

        this.skinItem = this.node.getComponentsInChildren(APSkinUIItem);
        this.skinContent = smtools.find(this.node, "skinContent");
        this.skinUIItem = this.skinContent.getComponentsInChildren(APSkinUIItem);

        for (var e = 0; e < this.skinItem.length; e++) {
            this.skinItem[e].init(e);
        }

        this.btnDark = smtools.find(this.node, "btnDark");

        smtools.click(this.node, "btnClose", this.close, this);
        smtools.click(this.node, "btnDark", this.onDarkMode, this);
    }

    onShow() {
        var e;
        this.updateDarkBtn(window.gm_ap.skin.isDarkMode);
        null == (e = window.sm.ui.panel(APMenuPanel)) || e.refreshCircle();
    }

    onClose() {
        var e;
        null == (e = window.sm.ui.panel(APMenuPanel)) || e.refreshCircle();
    }

    onSelectSkin(e) {
        window.gm_ap.skin.curSkinId = e;
        for (var t = 0; t < this.skinItem.length; t++) {
            this.skinItem[t].refreshUI();
        }
    }

    preloadSkin(e) {}

    onDarkMode() {
        window.gm_ap.skin.isDarkMode = !window.gm_ap.skin.isDarkMode;
        this.updateDarkBtn(window.gm_ap.skin.isDarkMode);
    }

    updateDarkBtn(e) {
        this.btnDark.children[0].active = !e;
        this.btnDark.children[1].active = e;
        this.skinUIItem.forEach(function (e) {
            e.refreshUI();
        });
    }
}
