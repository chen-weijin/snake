import { _decorator, Component, UIOpacity, Label, tween, v3 } from "cc";
import smtools from "./SmTools";

const { ccclass, property } = _decorator;
@ccclass("Tip")
export class Tip extends Component {
    private _opacityComp: UIOpacity = null;
    private _tipLbl: Label = null;
    private _scaleAnim: any = null;
    private _fadeOutAnim: any = null;

    onLoad() {
        this._opacityComp = this.node.addComponent(UIOpacity);
        this._tipLbl = smtools.find(this.node, "tipLbl", Label);
    }

    show(message: string) {
        this.node.setScale(0.75, 0.75, 1);
        this._opacityComp.opacity = 255;
        this._tipLbl.string = message;
        if (this._scaleAnim) this._scaleAnim.stop();
        if (this._fadeOutAnim) this._fadeOutAnim.stop();
        this._playScaleAnim();
    }

    private _playScaleAnim() {
        this._scaleAnim = tween(this.node)
            .to(0.05, { scale: v3(1, 1, 1) }, { easing: "sineIn" })
            .delay(1)
            .call(this._playFadeOutAnim.bind(this))
            .start();
    }

    private _playFadeOutAnim() {
        this._fadeOutAnim = tween(this._opacityComp)
            .to(0.5, { opacity: 0 })
            .call(() => {
                window.sm.pool.put(this.node);
            })
            .start();
    }
}
