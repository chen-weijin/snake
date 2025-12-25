import { _decorator, Sprite, Label, assetManager, SpriteFrame, Component } from "cc";
import { SdkGameConfig } from "./SdkConfig";
import { sdktools } from "./SdkTools";
import { sdkutils } from "./Utils";

const { ccclass, property } = _decorator;
@ccclass("NativeAdView")
export class NativeAdView extends Component {
    image = null;
    lbl_title = null;
    lbl_desc = null;
    lbl_app = null;
    lbl_version = null;
    lbl_developer = null;

    nativeAd = null;
    onClosed = null;
    onShow = null;
    safeArea: any;

    onLoad() {
        var e = this;
        (this.image = sdktools.find(this.node, "image", Sprite)),
            (this.lbl_title = sdktools.find(this.node, "lbl_title", Label)),
            (this.lbl_desc = sdktools.find(this.node, "lbl_desc", Label)),
            (this.lbl_app = sdktools.find(this.node, "lbl_app", Label)),
            (this.lbl_version = sdktools.find(this.node, "lbl_version", Label)),
            (this.lbl_developer = sdktools.find(this.node, "lbl_developer", Label)),
            sdktools.click(this, this.onEventAdClick, this),
            sdktools.click(this, "btn_close", this.onEventAdClose, this),
            sdktools.click(this, "lnk_detail", function () {
                var t;
                e.openLink(null == (t = e.nativeAd) || null == (t = t.data) ? void 0 : t.appDetailUrl);
            }),
            sdktools.click(this, "lnk_privacy", function () {
                var t;
                e.openLink(null == (t = e.nativeAd) || null == (t = t.data) ? void 0 : t.privacyUrl);
            }),
            sdktools.click(this, "lnk_permission", function () {
                var t;
                e.openLink(null == (t = e.nativeAd) || null == (t = t.data) ? void 0 : t.permissionUrl);
            });
    }
    showNative(e) {
        this.hideButton(),
            (this.nativeAd = e),
            this.nativeAd.data
                ? (this.nativeAd.reportAdShow({
                      adId: this.nativeAd.data.adId,
                  }),
                  (this.nativeAd.view = this),
                  this.updateView(),
                  this.onShow && this.onShow(),
                  (this.node.active = true))
                : ((this.node.active = false), this.hideButton(), this.onClosed && this.onClosed());
    }
    updateView() {
        (this.image.node.active = false),
            this.nativeAd.data.imgUrlList && this.nativeAd.data.imgUrlList.length > 0
                ? this.showPicture(this.image, this.nativeAd.data.imgUrlList[0])
                : this.showPicture(this.image, this.nativeAd.data.icon),
            this.showText(this.lbl_title, this.compareStr(this.nativeAd.data.title, this.nativeAd.data.desc)),
            this.showText(this.lbl_app, this.nativeAd.data.appName + " 版本 " + this.nativeAd.data.versionName),
            this.showText(this.lbl_developer, this.nativeAd.data.developerName);
    }
    compareStr(e, t) {
        return e || t ? (e && !t ? e : !e && t ? t : e.length > t.length ? e : t) : "";
    }
    showPicture(e, t) {
        if (e && t)
            try {
                assetManager.loadRemote(t, function (t, n) {
                    t
                        ? console.log("load native pic remote error 1", t)
                        : ((e.node.active = true), (e.spriteFrame = SpriteFrame.createWithImage(n)));
                });
            } catch (e) {
                console.log("load native pic remote error 2", e);
            }
    }
    showText(e, t) {
        e && (t ? ((e.node.active = true), (e.string = t)) : (e.node.active = false));
    }
    openLink(e) {
        e &&
            "undefined" != typeof window.qg &&
            window.qg.openDeeplink({
                uri: e,
            });
    }
    showButton() {
        if (this.nativeAd && this.nativeAd.data && "undefined" != typeof window.qg) {
            if (!this.safeArea) {
                this.safeArea = window.qg.getSystemInfoSync().safeArea;
                var e = window.qg.getSystemInfoSync().pixelRatio;
                (this.safeArea.left *= e),
                    (this.safeArea.right *= e),
                    (this.safeArea.top *= e),
                    (this.safeArea.bottom *= e),
                    (this.safeArea.width *= e),
                    (this.safeArea.height *= e),
                    console.log("### smsdk ###", e, JSON.stringify(this.safeArea));
            }
            var t = 0.6 * this.safeArea.width,
                n = (this.safeArea.width - t) / 2 + this.safeArea.left,
                i = (3 * this.safeArea.height) / 4 + this.safeArea.top;
            (i = Math.min(i, this.safeArea.height - 200)),
                this.nativeAd.showDownloadButton({
                    adId: this.nativeAd.data.adId,
                    style: {
                        left: n,
                        top: i,
                        heightType: "normal",
                        width: t,
                        fixedWidth: true,
                        minWidth: 200,
                        maxWidth: 500,
                        textSize: 50,
                        horizontalPadding: 50,
                        cornerRadius: 22,
                        normalTextColor: "#FFFFFF",
                        normalBackground: "#5291FF",
                        pressedColor: "#0A59F7",
                        normalStroke: 5,
                        normalStrokeCorlor: "#FF000000",
                        processingTextColor: "#5291FF",
                        processingBackground: "#0F000000",
                        processingColor: "#000000",
                        processingStroke: 10,
                        processingStrokeCorlor: "#0A59F7",
                        installingTextColor: "#000000",
                        installingBackground: "#FFFFFF",
                        installingStroke: 15,
                        installingStrokeCorlor: "#5291FF",
                    },
                });
        }
    }
    hideButton() {
        this.nativeAd &&
            this.nativeAd.data &&
            this.nativeAd.hideDownloadButton({
                adId: this.nativeAd.data.adId,
            });
    }
    onEventAdClick() {
        console.log("### smsdk ### native view click"),
            this.nativeAd &&
                this.nativeAd.reportAdClick({
                    adId: this.nativeAd.data.adId,
                }),
            (this.node.active = false),
            this.hideButton(),
            this.onClosed && this.onClosed();
    }
    onEventAdClose() {
        if (SdkGameConfig.golbalEvent && sdkutils.rand(100) < SdkGameConfig.natCloseTrapPer) return this.onEventAdClick();
        console.log("### smsdk ### native view close"),
            (this.node.active = false),
            (this.node.active = false),
            this.hideButton(),
            this.onClosed && this.onClosed();
    }
}
