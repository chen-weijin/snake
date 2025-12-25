import { _decorator, Vec3 } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel, { BannerType } from "../../start-scene/scripts/BasePanel";
import { GiftType } from "../../start-scene/scripts/BaseSdk";
import { APFreePanel } from "./APFreePanel";

const { ccclass } = _decorator;
@ccclass("APGiftPanel")
export default class APGiftPanel extends BasePanel {
    btnClose = null;
    lbl_app: any;
    lbl_table: any;
    lbl_collect: any;
    hand: any;

    get bannerType() {
        return BannerType.Always;
    }

    init() {
        (this.btnClose = smtools.click(this, "Exit Button", this.close, this)),
            (this.lbl_app = smtools.find(this, "lbl_app")),
            (this.lbl_table = smtools.find(this, "lbl_table")),
            (this.lbl_collect = smtools.find(this, "lbl_collect")),
            (this.hand = smtools.find(this.node, "hand"));
    }
    setType(e) {
        (this.lbl_app.active = e == GiftType.fromApp),
            (this.lbl_table.active = e == GiftType.table),
            e == GiftType.fromApp && (this.hand.position = new Vec3(-62.343, -187.151222, 0)),
            e == GiftType.table && (this.hand.position = new Vec3(169.134, -187.151222, 0));
    }
    show() {
        super.show.call(this), window.SmSdk.destroyGameClubButton();
    }
    close() {
        window.sm.ui.panel(APFreePanel).createCircleButton(), (this.node.active = false);
    }
}
