import { _decorator, Animation, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";

const { ccclass, property } = _decorator;

@ccclass("APSnackEyeAnim")
export class APSnackEyeAnim extends Component {
    @property
    minDelay = 0;

    @property
    maxDelay = 6;

    @property({ range: [0, 1, 0.1] })
    triggerProbability = 0.3;

    leftEyeAnim = null;
    rightEyeAnim = null;
    eyeLidAnim = null;

    onLoad() {
        this.leftEyeAnim = smtools.find(this.node, "LeftEye", Animation);
        this.rightEyeAnim = smtools.find(this.node, "RightEye", Animation);
        this.eyeLidAnim = smtools.find(this.node, "EyeLid", Animation);
        this.startRandomAnimation();
    }

    startRandomAnimation() {
        var e = this;
        var t = this.getRandomDelay();
        this.scheduleOnce(function () {
            Math.random() < e.triggerProbability && e.playEyeAnimation();
            e.startRandomAnimation();
        }, t);
    }

    getRandomDelay() {
        return this.minDelay + Math.random() * (this.maxDelay - this.minDelay);
    }

    playEyeAnimation() {
        this.leftEyeAnim.play("leftEye");
        this.rightEyeAnim.play("rightEye");
        this.eyeLidAnim.play("Eye");
    }
}
