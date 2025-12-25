import { _decorator, Label } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APADCusEvent, APEResConfig, APEResId, APPanelId } from "./APEnum";
import { TblAPConfigParams } from "./TblAPConfigParams";

const { ccclass } = _decorator;
@ccclass("APAdPopPanel")
export class APAdPopPanel extends BasePanel {
    adsType = APADCusEvent.AD_AddPower;

    addCount = 1;

    adGetBtn: any;

    lbl_addcount: any;

    addPowerNode: any;

    get layer() {
        return window.sm.ui.layer_top;
    }

    get panelId() {
        return APPanelId.APAdPopPanel;
    }

    init() {
        smtools.click(this.node, "btnClose", this.close, this);
        this.adGetBtn = smtools.click(this.node, "btnAdGet", this.onAdGetBtn, this);
        this.lbl_addcount = smtools.find(this.node, "lbl_addcount", Label);
        this.addPowerNode = smtools.find(this.node, "AddPowerNode");
    }
    onShow() {
        window.SmSdk.gameResultPolicy();
    }
    setUI(e) {
        this.adsType = e;
        this.addPowerNode.active = e === APADCusEvent.AD_AddPower;
        e === APADCusEvent.AD_AddPower &&
            (this.addCount = window.sm.tbl.find(TblAPConfigParams, APEResConfig.PowerADPerAdd).data().params[0]),
            (this.lbl_addcount.string = "+" + this.addCount);
    }
    onAdGetBtn() {
        var e = this;
        switch (this.adsType) {
            case APADCusEvent.AD_AddPower:
                window.SmSdk.rewardVideo(this.adsType).then(function () {
                    window.gm_ap.player.addItem(APEResId.Power, e.addCount);
                });
        }
        this.close();
    }
}
