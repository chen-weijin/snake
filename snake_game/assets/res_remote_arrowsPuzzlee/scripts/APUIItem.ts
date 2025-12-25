import { _decorator, Enum, Component, tween, Vec3 } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { APUIItemType } from "./APEnum";
import { APArrowItem } from "./APArrowItem";

const { ccclass, property } = _decorator;

@ccclass("APUIItem")
export class APUIItem extends Component {
    @property({ type: Enum(APUIItemType) })
    itemType = APUIItemType.None;
    btnClick: any;

    onEnable() {
        this.init();
    }
    init() {
        this.btnClick = smtools.click(this, "btnClick", this.onClick, this);
    }
    onClick() {
        switch (this.itemType) {
            case APUIItemType.Remove:
                this.remove();
                break;
            case APUIItemType.Eraser:
                this.eraser();
                break;
            case APUIItemType.Hint:
                this.hint();
        }
    }
    remove() {
        this.moveArrowsSequentially(3);
    }
    moveArrowsSequentially(e) {
        var t = this;
        if (!(e <= 0)) {
            var n = this.getMovableArrows(window.btl_ap.ctrl.curStageItem.arrows);
            if (0 !== n.length) {
                var i = n[Math.floor(Math.random() * n.length)].getComponent(APArrowItem);
                !i || i.isRemoved || i.isMoving || i.arrowMove(i.grids[0]),
                    this.scheduleOnce(function () {
                        t.moveArrowsSequentially(e - 1);
                    }, 0.1);
            } else console.log("没有可移动的箭头");
        }
    }
    eraser() {
        const e = window.btl_ap.ctrl.curStageItem.arrows;
        if (e.length !== 0) {
            const n = [];
            for (const o of e) {
                const r = o.getComponent(APArrowItem);
                if (r && !r.isRemoved) {
                    n.push(o);
                }
            }

            if (n.length !== 0) {
                const a = n[Math.floor(Math.random() * n.length)];
                const l = a.getComponent(APArrowItem);
                this.scheduleOnce(function () {
                    l.isRemoved = true;
                    const index = window.btl_ap.ctrl.curStageItem.arrows.indexOf(a);
                    if (index !== -1) {
                        window.btl_ap.ctrl.curStageItem.arrows.splice(index, 1);
                    }
                    a.destroy();
                }, 0.3);
            } else {
                console.log("没有可移除的箭头");
            }
        }
    }

    hint() {
        var e = window.btl_ap.ctrl.curStageItem.arrows;
        if (0 !== e.length) {
            var t = this.getMovableArrows(e);
            if (0 !== t.length) {
                var n = t[Math.floor(Math.random() * t.length)];
                this.playHintAnimation(n);
            } else console.log("没有可移动的箭头");
        }
    }
    getMovableArrows(e) {
        const n = [];
        const i = window.btl_ap.ctrl.curStageItem.blockGrid;
        for (const r of e) {
            const a = r.getComponent(APArrowItem);
            if (a && !a.isRemoved && a.debugIsPathBlocked(i).canMove) {
                n.push(r);
            }
        }
        return n;
    }

    playHintAnimation(e) {
        var t = e.scale.clone(),
            n = function () {
                tween(e)
                    .to(0.15, {
                        scale: new Vec3(1.03 * t.x, 1.03 * t.y, t.z),
                    })
                    .to(0.15, {
                        scale: t,
                    })
                    .start();
            };
        n(), this.scheduleOnce(n, 0.5);
    }
}
