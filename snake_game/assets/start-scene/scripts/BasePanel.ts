import { _decorator, Sprite, Vec3, tween, Color, Component } from "cc";
import smtools from "./SmTools";
import { PanelId } from "./PanelId";
import { TaskManager } from "./TaskManager";
import PanelManager from "./PanelManager";

export enum BannerType {
    None = 0,
    StanderScreen = 1,
    Always = 2,
}

export enum NativeType {
    None = 0,
    Banner = 1,
    Insert = 2,
}

const { ccclass } = _decorator;
@ccclass("BasePanel")
export default class BasePanel extends Component {
    nativeBtn = null;
    isInClosing = false;

    fadeHolder;

    scaleHolder;

    get layer() {
        return window.sm.ui.layer_panel;
    }

    get panelId(): any {
        return PanelId.Default;
    }

    get bannerType() {
        return BannerType.None;
    }

    get nativeType() {
        return NativeType.None;
    }

    init() {}

    onClose() {}

    onShow() {}

    initialize() {
        var e;
        (this.nativeBtn = smtools.find(this.node, "nativeBtn")),
            this.nativeBtn && window.sm.log.debug("add nativebtn", this.panelId),
            (this.fadeHolder = null == (e = this.node.getChildByName("fadeHolder")) ? void 0 : e.getComponent(Sprite)),
            (this.scaleHolder = this.node.getChildByName("scaleHolder")),
            this.init && this.init();
    }
    close() {
        var e = this;
        this.scaleHolder
            ? ((this.scaleHolder.scale = Vec3.ONE),
              (this.isInClosing = true),
              tween(this.scaleHolder)
                  .to(
                      0.3,
                      {
                          scale: new Vec3(0.2, 0.2, 0.2),
                      },
                      {
                          easing: "cubicIn",
                      }
                  )
                  .call(function () {
                      (e.node.active = false),
                          (e.isInClosing = false),
                          TaskManager.addBattleTimeTask(function () {
                              e.onClose && e.onClose(), PanelManager.instance.refresh();
                          }, 0);
                  })
                  .start())
            : ((this.node.active = false),
              TaskManager.addBattleTimeTask(function () {
                  e.onClose && e.onClose(), PanelManager.instance.refresh();
              }, 0));
    }
    show() {
        this.refresh(),
            (this.node.active = true),
            this.scaleHolder &&
                ((this.scaleHolder.scale = Vec3.ZERO),
                tween(this.scaleHolder)
                    .to(
                        0.3,
                        {
                            scale: Vec3.ONE,
                        },
                        {
                            easing: "cubicOut",
                        }
                    )
                    .start()),
            this.fadeHolder &&
                ((this.fadeHolder.color = new Color(255, 255, 255, 0)),
                tween(this.fadeHolder)
                    .to(1, {
                        color: new Color(255, 255, 255, 255),
                    })
                    .start()),
            this.showBannerAd(),
            this.showNativeAd(),
            this.onShow && this.onShow();
    }
    refresh() {}
    rewardVideo(e, t) {
        window.SmSdk.rewardVideo(this.panelId)
            .then(function () {
                return e && e();
            })
            .catch(function () {
                return t && t();
            });
    }
    showBannerAd() {}
    showNativeAd() {}
}
