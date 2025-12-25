import { _decorator, AnimationComponent, UIOpacity, tween } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import BasePanel from "../../start-scene/scripts/BasePanel";
import { APEGuideStep, APPanelId } from "./APEnum";

const { ccclass } = _decorator;
@ccclass("APGuidePanel")
export class APGuidePanel extends BasePanel {
    zoomGuideIng = false;
    zoomGuide;
    clickGuide;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId() {
        return APPanelId.APGuidePanel;
    }

    init() {
        (this.zoomGuide = smtools.find(this.node, "zoomGuide")),
            (this.zoomGuide.active = false),
            (this.clickGuide = smtools.find(this.node, "clickGuide"));
    }
    setZoomGuide(e = true, t = true) {
        var n = this;
        if (((this.zoomGuideIng = e), e)) (this.zoomGuide.active = e), this.zoomGuide.getComponent(AnimationComponent).play("zoomguide");
        else {
            var i = this.zoomGuide.getComponent(UIOpacity);
            i
                ? tween(i)
                      .to(0.5, {
                          opacity: 0,
                      })
                      .call(function () {
                          (n.zoomGuide.active = false), (i.opacity = 255), t && (window.gm_ap.player.curGuideStep = APEGuideStep.End);
                      })
                      .start()
                : ((this.zoomGuide.active = false), t && (window.gm_ap.player.curGuideStep = APEGuideStep.End));
        }
    }
    setClickGuide(e = true) {
        (this.clickGuide.active = e), (window.btl_ap.ctrl.curStageItem.clickNode.active = e);
    }
}
