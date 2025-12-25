import { _decorator, director, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";

const { ccclass, property } = _decorator;

@ccclass("APSkinUIItem")
export class APSkinUIItem extends Component {
    @property
    skinId = 0;

    unlock = false;
    price = 0;
    isInitOnce = false;
    panel: any;
    darkPanel: any;
    skinName: any;
    skinIcon: any;
    darkSkinIcon: any;
    selected: any;
    selectedTip: any;
    btnClick: any;

    init(e) {
        this.initOnce();
        this.skinId = e;
        smtools.click(this.node, "btnClick", this.onClick, this);
        smtools.click(this.node, "skinIcon", this.onClick, this);
        smtools.click(this.node, "darkSkinIcon", this.onClick, this);
        this.refreshUI();
    }

    initOnce() {
        if (!this.isInitOnce) {
            this.isInitOnce = true;
            this.panel = smtools.find(this.node, "panel");
            this.darkPanel = smtools.find(this.node, "darkPanel");
            this.skinName = smtools.find(this.node, "skinName");
            this.skinIcon = smtools.find(this.node, "skinIcon");
            this.darkSkinIcon = smtools.find(this.node, "darkSkinIcon");
            this.selected = smtools.find(this.node, "selected");
            this.selectedTip = smtools.find(this.node, "selected");
            this.btnClick = smtools.find(this.node, "btnClick");
        }
    }

    onClick() {
        director.emit("selectSkin", this.skinId);
    }

    refreshUIBtn(e) {
        this.btnClick.active = true;
        this.selectedTip.active = true;
        e ? (this.btnClick.active = false) : (this.selectedTip.active = false);
    }

    refreshUI() {
        var e = window.gm_ap.skin.curSkinId;
        var t = this.skinId === e;
        this.refreshUIBtn(t);

        var n = window.gm_ap.skin.isDarkMode;
        var i = 0 === this.skinId;

        this.darkPanel.active = n;
        this.panel.active = !n || !i;

        if (i) {
            this.darkSkinIcon.active = n;
            this.skinIcon.active = !n;
        }
    }
}
