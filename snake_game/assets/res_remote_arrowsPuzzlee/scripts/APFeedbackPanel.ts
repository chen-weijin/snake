import { _decorator, EditBox } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { PanelId } from "../../start-scene/scripts/PanelId";
import { APFeedUIItem } from "./APFeedUIItem";

const { ccclass } = _decorator;
@ccclass("APFeedbackPanel")
export class APFeedbackPanel extends BasePanel {
    editBox;
    feeds;
    btn_up;

    get panelId() {
        return PanelId.APFeedbackPanel;
    }

    get layer() {
        return window.sm.ui.layer_top;
    }

    onLoad() {
        var e = this;
        (this.editBox = smtools.find(this.node, "EditBox", EditBox)),
            (this.feeds = smtools.find(this.node, "layout").getComponentsInChildren(APFeedUIItem)),
            this.feeds.forEach(function (e) {
                e.init();
            }),
            (this.btn_up = smtools.click(
                this.node,
                "btn_up",
                function () {
                    window.gm_ap.level.feedCount > 10 && window.sm.ui.tip("今日反馈已达上限");
                    var t = e.editBox.string,
                        n = "";
                    e.feeds.forEach(function (e) {
                        e.isChose && (n += "," + e.type);
                    }),
                        "无" == (n = n.length > 0 ? n.substring(1) : "无") && "" == t
                            ? window.sm.ui.tip("请选择反馈类型")
                            : (window.sm.ui.tip("提交成功，感谢反馈！"), window.gm_ap.level.feedCount++, e.close());
                },
                this
            )),
            smtools.click(this.node, "btnClose", this._onCloseButton, this);
    }
    onShow() {
        this.reset();
    }
    reset() {
        (this.editBox.string = ""),
            this.feeds.forEach(function (e) {
                e.reset();
            });
    }
    _onCloseButton() {
        this.close();
    }
}
