import { _decorator, input, Input, UITransform, Vec2, Vec3 } from "cc";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APPanelId } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APArrowItem } from "./APArrowItem";
import { APGamePanel } from "./APGamePanel";

const { ccclass } = _decorator;
@ccclass("APClickPanel")
export class APClickPanel extends BasePanel {
    lastTouchStartPos = new Vec2();
    lastTouchStartTime = 0;
    isTouchMoved = false;
    touchStartTime = 0;
    isTouching = false;
    touchInterval = null;
    touchThreshold = 300;
    maxDis = 20;
    touchStartPos = new Vec3();
    v3Tmp2 = new Vec3();
    camera;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APClickPanel;
    }

    init() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
    }
    onMouseWheel(e) {
        var t = e.getScrollY();
        t > 0
            ? (console.log("向上滚动"), window.sm.ui.panel(APGamePanel).changeSlider(0.1))
            : t < 0 && (console.log("向下滚动"), window.sm.ui.panel(APGamePanel).changeSlider(-0.1));
    }
    onShow() {
        this.camera = window.btl_ap.ctrl.curStageItem.stageCamera.camera;
    }
    executeTouchLogic(e) {}
    onTouchStart(e) {
        var t = this;
        window.btl_ap.ctrl.curStageItem.ready &&
            !window.btl_ap.ctrl.curStageItem.isFail &&
            ((this.lastTouchStartPos = e.getLocation().clone()),
            (this.lastTouchStartTime = Date.now()),
            (this.isTouchMoved = false),
            (this.touchStartTime = Date.now()),
            (this.isTouching = true),
            (this.touchInterval = setInterval(function () {
                Date.now() - t.touchStartTime >= t.touchThreshold && t.executeTouchLogic(e);
            }, 100)));
    }
    onTouchMove(e) {
        window.btl_ap.ctrl.curStageItem.ready &&
            !window.btl_ap.ctrl.curStageItem.isFail &&
            (e.getLocation().subtract(this.lastTouchStartPos).length() > 10 && (this.isTouchMoved = true),
            (this.isTouching = false),
            this.touchInterval &&
                (window.btl_ap.ctrl.curStageItem.setLongPress(true), clearInterval(this.touchInterval), (this.touchInterval = null)));
    }
    onTouchEnd(e) {
        if (window.btl_ap.ctrl.curStageItem.ready && !window.btl_ap.ctrl.curStageItem.isFail) {
            var t = e.getLocation().subtract(this.lastTouchStartPos).length(),
                n = Date.now() - this.lastTouchStartTime;
            if (!this.isTouchMoved && t < 10 && n < 300) {
                var i = this.getAp(e);
                i && i.onClick();
            }
            (this.isTouching = false),
                this.touchInterval &&
                    (window.btl_ap.ctrl.curStageItem.setLongPress(true), clearInterval(this.touchInterval), (this.touchInterval = null));
        } else window.btl_ap.ctrl.curStageItem.ready || window.sm.ui.tip("关卡生成中");
    }
    refreshDis(e) {
        var t = e.grids,
            n = t[0],
            i = t[1],
            o = this.camera.convertToUINode(n.node.worldPosition, this.node),
            s = this.camera.convertToUINode(i.node.worldPosition, this.node);
        this.maxDis = o.clone().subtract(s).length() * APGameConfig.maxDis;
    }
    getAp(e) {
        var t = this,
            n = window.btl_ap.ctrl.curStageItem.arrowParent.getComponentsInChildren(APArrowItem);
        n = n.filter(function (e) {
            return 0 == e._ingore;
        });
        var i = null;
        if (n.length > 0) {
            this.refreshDis(n[0]);
            var o = n.flatMap(function (e) {
                    return e.grids;
                }),
                s = this.maxDis,
                r = this.getTouchPos(e);
            o.forEach(function (e) {
                var n = t.camera.convertToUINode(e.node.worldPosition, t.node);
                n.z = 0;
                var o = n.clone().subtract(r).length();
                o < s && ((s = o), (i = e));
            });
        }
        return i;
    }
    getTouchPos(e) {
        var t;
        return (
            this.touchStartPos.set(0, 0, 0),
            e.getUILocation(this.touchStartPos),
            null == (t = this.node.getComponent(UITransform)) || t.convertToNodeSpaceAR(this.touchStartPos, this.v3Tmp2),
            this.v3Tmp2
        );
    }
}
