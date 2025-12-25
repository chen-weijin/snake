import { _decorator, Tween, Component, Vec3 } from "cc";
import { APEGuideStep } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APGamePanel } from "./APGamePanel";
import { APGuidePanel } from "./APGuidePanel";

export enum GridDisplayType {
    None = 0,
    LineHorizontal1 = 1,
    LineHorizontal2 = 2,
    LineVertical1 = 3,
    LineVertical2 = 4,
    CornerUpRight1 = 5,
    CornerUpRight2 = 6,
    CornerDownRight1 = 7,
    CornerDownRight2 = 8,
    CornerDownLeft1 = 9,
    CornerDownLeft2 = 10,
    CornerUpLeft1 = 11,
    CornerUpLeft2 = 12,
    ArrowUp = 13,
    ArrowDown = 14,
    ArrowLeft = 15,
    ArrowRight = 16,
    TailHorizontal1 = 17,
    TailHorizontal2 = 18,
    TailVertical1 = 19,
    TailVertical2 = 20,
}

export enum GridColor {
    Normal = "#111433",
    Error = "#FF4B5D",
    Correct = "#3E55BA",
    White = "#D8E4FE",
}

const { ccclass, property } = _decorator;
@ccclass("APGridItem")
export class APGridItem extends Component {
    @property
    displayType = GridDisplayType.None;

    @property
    isReversed = false;

    @property
    test = false;

    @property
    value = new Vec3(0, 0, 0);

    isFirst = true;
    myFather: any;

    initOnce() {
        this.isFirst = false;
    }
    init() {
        this.isFirst && this.initOnce();
    }
    onClick() {
        if (!this.myFather.isRemoved && !this.myFather.isMoving) {
            if ((this.myFather.arrowMove(this), !window.btl_ap.ctrl.curStageItem.startCountDown)) {
                var e;
                window.btl_ap.ctrl.curStageItem.startCountDown = true;
                var t = window.btl_ap.ctrl.curStageItem.levelMaxArrow * APGameConfig.countDownScale;
                null == (e = window.sm.ui.panel(APGamePanel)) || e.startCountdown(t);
            }
            if (window.gm_ap.player.curGuideStep === APEGuideStep.ClickGuide1)
                (window.gm_ap.player.curGuideStep = APEGuideStep.ClickGuide2), window.btl_ap.ctrl.curStageItem.guideLogic();
            else if (window.gm_ap.player.curGuideStep === APEGuideStep.ClickGuide2) {
                var n;
                (window.gm_ap.player.curGuideStep = APEGuideStep.ZoomGuide),
                    console.log("guide2 click"),
                    null == (n = window.sm.ui.panel(APGuidePanel)) || n.setClickGuide(false);
            }
        }
    }
    clear() {
        Tween.stopAllByTarget(this.node);
    }
}
