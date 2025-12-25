import { _decorator, Component, Label, AnimationComponent } from "cc";
import { TaskManager } from "./TaskManager";
import smtools from "./SmTools";

const { ccclass, property } = _decorator;
@ccclass("TipItem")
export class TipItem extends Component {
    @property(Label)
    lbl_tip: Label = null;

    private tipTime: number = 0;
    private playingHide: boolean = false;
    private ani: AnimationComponent = null;

    init(message: string) {
        this.lbl_tip = smtools.find(this.node, "lbl_tip", Label);
        this.tipTime = 0;
        this.lbl_tip.string = message;
        this.node.active = true;
        this.playingHide = false;
        this.ani = this.node.getComponent(AnimationComponent);
        this.ani.play("tipShow");
    }

    update(deltaTime: number) {
        this.tipTime += deltaTime;
        if (this.tipTime >= 3 && !this.playingHide) {
            this.playHideAni();
        }
    }

    private playHideAni() {
        this.playingHide = true;
        this.ani.play("tipHide");

        const state = this.ani.getState("tipHide");
        TaskManager.addBattleTimeTask(() => {
            if (this.isValid) {
                this.node.active = false;
                window.sm.pool.put(this.node);
            }
        }, state.duration / state.speed);
    }
}
