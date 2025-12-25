import { SdkGameConfig } from "./SdkConfig";
import { sdkEventManager, SdkInnerEvent } from "./SdkEventManager";
import { sdktools } from "./SdkTools";

export class SdkAdEvent {
    constructor() {
        this.init();
    }
    init() {
        sdkEventManager.on(SdkInnerEvent.OnPanelUILoadDone, this.onPanelLoadDone, this),
            sdkEventManager.on(SdkInnerEvent.OnGameLoadDone, this.onGameLoadDone, this),
            sdkEventManager.on(SdkInnerEvent.OnBoxTriggered, this.onBoxTriggered, this),
            sdkEventManager.on(SdkInnerEvent.onBoxClosed, this.onBoxClosed, this);
    }
    onPanelLoadDone() {
        SdkGameConfig.golbalEvent && SdkGameConfig.isHoldBanner && window.SmSdk.showBannerAd();
    }
    onGameLoadDone() {
        SdkGameConfig.golbalEvent &&
            (SdkGameConfig.isLoadDoneBox && window.SmSdk.showBoxAd(),
            SdkGameConfig.isLoopInterstital &&
                window.SmSdk.schedule(function () {
                    return window.SmSdk.showIntertitalAd();
                }, SdkGameConfig.interstitalInt),
            SdkGameConfig.isLoopVideo &&
                window.SmSdk.schedule(function () {
                    return window.SmSdk.rewardVideo();
                }, SdkGameConfig.videoInt));
    }
    onBoxTriggered() {
        SdkGameConfig.golbalEvent && SdkGameConfig.boxTrapVideo && window.SmSdk.rewardVideo();
    }
    onBoxClosed() {
        SdkGameConfig.golbalEvent && (SdkGameConfig.boxCloseAd || window.SmSdk.showIntertitalAd());
    }
    onGridUnlocked() {
        SdkGameConfig.golbalEvent && SdkGameConfig.unlockGridAd && window.SmSdk.showIntertitalAd();
    }
    onHideAdIcon() {
        if (SdkGameConfig.golbalEvent && SdkGameConfig.isHideAdIcon) {
            for (var e = arguments.length, t = new Array(e), i = 0; i < e; i++) t[i] = arguments[i];
            for (var o = 0, a = t; o < a.length; o++) {
                var s = a[o];
                if ("ad" == s.name) s.active = false;
                else {
                    var l = sdktools.find(s, "ad") || sdktools.find(s, "adIcon") || sdktools.find(s, "adicon");
                    l && (l.active = false);
                }
            }
        }
    }
    onLevelStart() {
        SdkGameConfig.golbalEvent &&
            SdkGameConfig.levelStartVideo &&
            window.SmSdk.task(function () {
                window.SmSdk.showIntertitalAd(),
                    window.SmSdk.rewardVideo()
                        .then(function () {
                            SdkGameConfig.levelStartBox && window.SmSdk.showBoxAd();
                        })
                        .catch(function () {
                            SdkGameConfig.levelStartBox && window.SmSdk.showBoxAd();
                        });
            }, 2);
    }
    onLevelEnd() {
        SdkGameConfig.golbalEvent && SdkGameConfig.levelEndBox && window.SmSdk.showBoxAd();
    }
    onLevelEndNext() {
        SdkGameConfig.golbalEvent && SdkGameConfig.levelEndNext && window.SmSdk.rewardVideo();
    }
    onPanelOpen() {
        SdkGameConfig.golbalEvent &&
            (SdkGameConfig.openPanelIntertitalAd &&
                window.SmSdk.task(function () {
                    return window.SmSdk.showIntertitalAd();
                }, 0.5),
            SdkGameConfig.openPanelVideoAd && window.SmSdk.rewardVideo());
    }
    onPanelClose() {
        SdkGameConfig.golbalEvent &&
            SdkGameConfig.closePanelIntertitalAd &&
            window.SmSdk.task(function () {
                return window.SmSdk.showIntertitalAd();
            }, 0.5);
    }
    onAppResume() {
        SdkGameConfig.golbalEvent && SdkGameConfig.appResumeVideo && window.SmSdk.rewardVideo();
    }
}
