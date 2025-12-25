import { _decorator, Enum, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { GiftType } from "../../start-scene/scripts/BaseSdk";
import { APEResId } from "./APEnum";
import APGiftPanel from "./APGiftPanel";

const { ccclass, property } = _decorator;

@ccclass("APFreeGiftUIItem")
export class APFreeGiftUIItem extends Component {
    @property({ type: Enum(GiftType) })
    type = GiftType.share;

    p = 0;
    btn_click: any;
    btn_gift: any;
    getNode: any;

    init() {
        (this.btn_click = smtools.click(this.node, "btn_click", this.goClick, this)),
            (this.btn_gift = smtools.click(this.node, "btn_gift", this.giftClick, this)),
            (this.getNode = smtools.find(this.node, "getNode"));
    }
    goClick() {
        var e = this;
        this.type == GiftType.share &&
            window.SmSdk.sdkImp.shareAppMessage(
                function () {
                    window.SmSdk.sdkImp.setGiftPro(e.type, 1),
                        e.scheduleOnce(function () {
                            e.refreshUI();
                        }, 1);
                },
                function () {}
            ),
            (this.type != GiftType.fromApp && this.type != GiftType.table) ||
                window.sm.ui.open(APGiftPanel).then(function (t) {
                    t.setType(e.type);
                });
    }
    giftClick() {
        window.gm_ap.player.addItem(APEResId.Power, 1), window.SmSdk.sdkImp.setGiftPro(this.type, 2), this.refreshUI();
    }
    refreshUI() {
        (this.p = window.SmSdk.sdkImp.getCurGiftPro(this.type)),
            0 == this.p
                ? ((this.btn_click.active = true), (this.btn_gift.active = false), (this.getNode.active = false))
                : 1 == this.p
                ? ((this.btn_click.active = false), (this.btn_gift.active = true), (this.getNode.active = false))
                : ((this.btn_click.active = false), (this.btn_gift.active = false), (this.getNode.active = true));
    }
}
