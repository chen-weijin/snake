import { _decorator, Animation } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { TaskManager } from "../../start-scene/scripts/TaskManager";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APRankSelectBtn } from "./APRankSelectBtn";
import { APRankUIItem } from "./APRankUIItem";
import { APMenuPanel } from "./APMenuPanel";

const { ccclass } = _decorator;
@ccclass("RankShowConfig")
export class RankShowConfig {
    sp = null;
    portrait;
    rank: number;
    openid: any;
    playername: any;
    score: number;

    initSp(e) {
        var t = this;
        this.sp = null;
        TaskManager.addNormalTimeTask(function () {
            smtools.loadPortrait(t.portrait).then(function (e) {
                t.sp = e;
            });
        }, 0.05 * Math.floor(e / 5));
    }
}

@ccclass("APRankPanel")
export default class APRankPanel extends BasePanel {
    btnClose = null;
    type = 0;
    ani: Animation;
    self: any;
    selects: any;

    get layer() {
        return window.sm.ui.layer_top;
    }

    init() {
        var e = this;
        (this.ani = this.node.getComponent(Animation)),
            (this.btnClose = smtools.click(
                this,
                "Exit Button",
                function () {
                    e.close();
                },
                this
            )),
            (this.self = smtools.find(this.node, "selfPaihang", APRankUIItem)),
            (this.selects = smtools.find(this.node, "selectLayout").getComponentsInChildren(APRankSelectBtn)),
            this.selects.forEach(function (e) {
                e.init();
            });
    }
    generateUI() {
        var e = this;
        this.selects.forEach(function (e) {
            e.isGenerate = false;
        }),
            this.selects.forEach(function (t) {
                t.refresh(e.type);
            });
    }
    refreshSelf(e, t) {
        this.type == t && this.self.init2(e, t);
    }
    changeScroll(e) {
        var t = this;
        (this.type = e),
            this.selects.forEach(function (e) {
                e.refresh(t.type);
            });
    }
    onShow() {
        var e, t;
        null == (e = this.ani) || e.play("openPanel"), null == (t = window.sm.ui.panel(APMenuPanel)) || t.refreshCircle();
    }
    onClose() {
        var e, t;
        null == (e = this.ani) || e.play("closePanel"), null == (t = window.sm.ui.panel(APMenuPanel)) || t.refreshCircle();
    }
}
