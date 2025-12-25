import { _decorator } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { TaskManager } from "../../start-scene/scripts/TaskManager";
import BasePanel, { BannerType } from "../../start-scene/scripts/BasePanel";
import { sdkEventManager, SdkInnerEvent } from "../../start-scene/scripts/SdkEventManager";
import { APFreeGiftUIItem } from "./APFreeGiftUIItem";
import { APMenuPanel } from "./APMenuPanel";

const { ccclass, property } = _decorator;

@ccclass("APFreePanel")
export class APFreePanel extends BasePanel {
    btnClose = null;
    freeUIItems: any;
    btn_circle: any;

    get bannerType() {
        return BannerType.Always;
    }

    init() {
        (this.btnClose = smtools.click(this, "Exit Button", this.close, this)),
            (this.freeUIItems = smtools.find(this.node, "layout").getComponentsInChildren(APFreeGiftUIItem)),
            (this.btn_circle = smtools.find(this.node, "Circle")),
            this.freeUIItems.forEach(function (e) {
                e.init(), e.node.active;
            }),
            sdkEventManager.on(SdkInnerEvent.OnRefreshLoginState, this.refreshUI, this);
    }
    show() {
        var t;
        super.show.call(this),
            this.createCircleButton(),
            this.refreshUI(),
            null == (t = window.sm.ui.panel(APMenuPanel)) || t.refreshCircle();
    }
    createCircleButton() {
        var e = this;
        TaskManager.addNormalTimeTask(function () {
            0 == window.SmSdk.sdkImp.circlePro &&
                window.SmSdk.createGameClubButton(e.node, e.btn_circle, function () {
                    (window.SmSdk.sdkImp.circlePro = 1), window.SmSdk.destroyGameClubButton();
                });
        }, 0.5);
    }
    refreshUI() {
        this.freeUIItems.forEach(function (e) {
            e.refreshUI();
        });
    }
    close() {
        var e;
        window.SmSdk.destroyGameClubButton(),
            (this.node.active = false),
            null == (e = window.sm.ui.panel(APMenuPanel)) || e.refreshCircle();
    }
}
