import { _decorator, director, Label } from "cc";
import { smtime } from "../../start-scene/scripts/SmTime";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { PanelId } from "../../start-scene/scripts/PanelId";
import { APEResId, APEResConfig, APADCusEvent } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { TblAPConfigParams } from "./TblAPConfigParams";
import { APAdPopPanel } from "./APAdPopPanel";

const { ccclass } = _decorator;
@ccclass("APCommonPanel")
export class APCommonPanel extends BasePanel {
    maxPower = 0;
    payCount = 1;

    lbl_powerCount;
    lbl_powerTime;
    powerNode;
    params;
    maxNode;
    btnAddPower;
    resumeTime;

    get layer() {
        return window.sm.ui.layer_top;
    }

    get panelId() {
        return PanelId.Default;
    }

    init() {
        var e = this;
        director.on(
            "APResUpdate",
            function (t) {
                t === APEResId.Gold || (t === APEResId.Power && e.refreshPower());
            },
            this
        ),
            (this.lbl_powerTime = smtools.find(this.node, "lbl_powerTime", Label)),
            (this.lbl_powerCount = smtools.find(this.node, "lbl_power", Label)),
            (this.powerNode = smtools.find(this.node, "powerNode")),
            (this.powerNode.active = APGameConfig.powerSysOn),
            (this.maxPower = window.sm.tbl.find(TblAPConfigParams, APEResConfig.PowerResumeMax).data().params[0]),
            (this.payCount = window.sm.tbl.find(TblAPConfigParams, APEResConfig.FightPowerCost).data().params[0]),
            (this.params = [APGameConfig.energyReviveTime, APGameConfig.energyReviveCount]),
            (this.maxNode = smtools.find(this.node, "maxNode")),
            (this.btnAddPower = smtools.click(
                this.node,
                "btnAddPower",
                function () {
                    window.sm.ui.open(APAdPopPanel).then(function (e) {
                        return e.setUI(APADCusEvent.AD_AddPower);
                    });
                },
                this
            ));
    }
    onShow() {
        APGameConfig.powerSysOn && 0 == window.gm.account.powerStartResumeTime && (window.gm.account.powerStartResumeTime = smtime.now()),
            this.calResumePower(),
            this.refreshPower();
    }
    update(e) {
        (e = Math.min(e, 0.1)), this.updatePower(e);
    }
    updatePower(e) {
        if (this.lbl_powerTime.node.active) {
            if (((this.resumeTime -= e), this.resumeTime <= 0)) {
                (this.resumeTime = this.params[0]), (window.gm.account.powerStartResumeTime = smtime.now());
                var t = this.maxPower - window.gm_ap.player.itemCount(APEResId.Power),
                    n = Math.min(this.params[1], t);
                window.gm_ap.player.addItem(APEResId.Power, n), this.refreshPower();
            }
            this.refreshPowerTime();
        }
    }
    calResumePower() {
        var e = smtime.now() - window.gm.account.powerStartResumeTime,
            t = Math.floor(e / this.params[0]);
        (this.maxPower = window.sm.tbl.find(TblAPConfigParams, APEResConfig.PowerResumeMax).data().params[0]),
            (t = Math.min(t, this.maxPower - window.gm_ap.player.itemCount(APEResId.Power))) > 0 &&
                (window.gm_ap.player.addItem(APEResId.Power, t),
                window.gm_ap.player.itemCount(APEResId.Power) < this.maxPower &&
                    ((e -= t * this.params[0]), (window.gm.account.powerStartResumeTime = smtime.now() - e))),
            (this.resumeTime = this.params[0] - e),
            this.refreshPower();
    }
    refreshPower() {
        window.gm_ap.player.itemCount(APEResId.Power) >= this.maxPower && (window.gm.account.powerStartResumeTime = 0),
            (this.lbl_powerCount.string = window.gm_ap.player.itemCount(APEResId.Power).toString()),
            this.refreshPowerTime();
    }
    refreshPowerTime() {
        (this.lbl_powerTime.node.active = window.gm_ap.player.itemCount(APEResId.Power) < this.maxPower),
            this.lbl_powerTime.node.active && (this.lbl_powerTime.string = smtime.getTimeBySecond(this.resumeTime));
    }
}
