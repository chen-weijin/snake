import { _decorator, Enum, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { APFeedType } from "./APEnum";

const { ccclass, property } = _decorator;
@ccclass("APFeedUIItem")
export class APFeedUIItem extends Component {
    @property({ type: Enum(APFeedType) })
    type = APFeedType.FeedType1;

    isChose = false;

    mark;

    init() {
        var e = this;
        (this.mark = smtools.find(this.node, "mark")),
            smtools.click(this.node, function () {
                (e.isChose = !e.isChose), (e.mark.active = e.isChose);
            });
    }

    reset() {
        (this.isChose = false), (this.mark.active = this.isChose);
    }
}
