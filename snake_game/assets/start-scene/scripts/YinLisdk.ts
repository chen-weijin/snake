import { _decorator } from "cc";
import { SysTaskManager } from "./SysTaskManager";
import { SdkPkgConfig } from "./SdkConfig";

const { ccclass } = _decorator;
@ccclass("YinLisdk")
export class YinLisdk {
    static version: string;
    static queueEvent: string[] = [];
    static attributeEvent: string[] = [];
    static valueEvent: any[] = [];

    private static o: any;

    private static r = {
        accessToken: "8EUkSHqvVlhuzo9djWrxCwmvtdAbkz0f",
        autoTrack: {
            appLaunch: true,
            appShow: true,
            appHide: true,
        },
        clientId: "",
        name: "ge",
        debugMode: "none",
    };

    static initialize(t, n) {
        if (SdkPkgConfig.UseGravityEngine && this.r.accessToken) {
            console.log("#### GeMpSdk #### initialize ");
            this.r.clientId = n;
            this.o = new GravityAnalyticsAPI(this.r);

            console.log("----openid:", n);
            this.o
                .initialize({
                    name: n,
                    version: t,
                    openid: n,
                })
                .then((e: any) => {
                    console.log("#### GeMpSdk #### initialize success " + JSON.stringify(e));
                })
                .catch((e: any) => {
                    console.log("#### GeMpSdk #### initialize failed, error is " + JSON.stringify(e));
                });

            this.o.setupAndStart();
            this.checkStatQueue();
        }
    }

    static adshow(e) {
        var t;
        console.log("#### GeMpSdk #### adShowEvent"),
            null == (t = this.o) ||
                t.adShowEvent("reward", e, {
                    custom_param: "",
                });
    }
    static checkStatQueue() {
        var e = this;
        if (this.o) {
            for (var i = 0; i < this.queueEvent.length; i++)
                null == YinLisdk || YinLisdk.stat(this.queueEvent[i], this.attributeEvent[i], this.valueEvent[i]);
            (this.queueEvent = []), (this.attributeEvent = []), (this.valueEvent = []);
        } else
            SysTaskManager.addTimeTask(function () {
                e.checkStatQueue();
            }, 1);
    }
    static stat(e, t, n) {
        if (SdkPkgConfig.UseGravityEngine) {
            if (!this.o) return this.queueEvent.push(e), this.attributeEvent.push(t), void this.valueEvent.push(n);
            var r = {};
            (r[t] = n), this.o.track(e, r), window.SmSdk.stat.cusEventWithTage(e, "yinli");
        }
    }
    static trackEvent(e, t?) {
        var n;
        null == (n = this.o) || n.track(e, t);
    }
    static eventTrack(e) {
        this.trackEvent(e);
    }
    static eventTrack2(e, t) {
        this.trackEvent(e);
    }
    static level_start(e, n) {
        console.log("@@level_start");
        var i = {
            level_id: e,
            mode_id: n,
        };
        this.trackEvent("EnterLevel", i), YinLisdk.levelStart();
    }
    static level_finish(e, t, n) {
        var i = {
            level_id: e,
            n_time: t,
            mode_id: n,
        };
        this.trackEvent("FinishLevel", i), this.trackEvent("Level_Start");
    }
    static level_fail(e, t) {
        var n = {
            level_id: e,
            mode_id: t,
        };
        this.trackEvent("FailLevel", n), this.trackEvent("Level_Start");
    }
    static levelStart() {
        var e;
        console.log("@@Level_Start"), null == (e = this.o) || e.timeEvent("Level_Start");
    }
    static newUserEnterGame(e, n) {
        console.log("@@newUserEnterGame");
        var i = {
            openid: e,
            new_guide: n,
        };
        YinLisdk.eventTrack2("NewUserEnterGame", i);
    }
    static AdWatchFinish(e, t, n) {
        console.log("AdWatchFinish:", e, t, n);
        var i = {
            ad_name: e,
            level_id: t,
            n_time: n,
        };
        this.trackEvent("AdWatchFinish", i);
    }
    static adShow(e, t, n, i) {
        try {
            var o;
            null == (o = window.ccWxSdk) || o.adShow(e, t, n, i);
        } catch (e) {
            console.log("@@@", e);
        }
    }
    static wxReport(e, t, n, i) {
        var o;
        console.log("@@@scene:", e, "videoname", t, "adnum", n, "adsuccessnum", i),
            console.log("@@@wxReport"),
            null == (o = window.ccWxSdk) || o.wxReport(e, t, n, i);
    }
    static AdWatchFinish_gm_ap(e, t) {
        console.log("### AdWatchFinish_gm_ap:", e, t);
        var n = {
            ad_name: e,
            level_id: t,
            version_id: this.version,
        };
        this.trackEvent("AdWatchFinish", n);
    }
    static AdWatchClick_gm_ap(e, t) {
        console.log("### AdWatchClick_gm_ap:", e, t);
        var n = {
            ad_name: e,
            version_id: this.version,
            level_id: t,
        };
        this.trackEvent("AdWatchClick", n);
    }
    static Loading_gm_ap() {
        console.log("### Loading_gm_ap:", this.version);
        var e = {
            version_id: this.version,
        };
        this.trackEvent("Loading", e);
    }
    static NewUserEnterGame_gm_ap() {
        console.log("### NewUserEnterGame_gm_ap:", this.version);
        var e = {
            version_id: this.version,
        };
        this.trackEvent("NewUserEnterGame", e);
    }
    static EnterLevel_gm_ap(e) {
        console.log("### EnterLevel_gm_ap:", e);
        var t = {
            level_id: e,
            version_id: this.version,
        };
        this.trackEvent("EnterLevel", t);
    }
    static FinishLevel_gm_ap(e) {
        console.log("### FinishLevel_gm_ap:", e);
        var t = {
            level_id: e,
            version_id: this.version,
        };
        this.trackEvent("FinishLevel", t);
    }
    static FailLevel_gm_ap(e) {
        console.log("### FailLevel_gm_ap:", e);
        var t = {
            level_id: e,
            version_id: this.version,
        };
        this.trackEvent("FailLevel", t);
    }
    static avtive_days_gm_ap(e) {
        var t;
        console.log("### avtive_days_gm_ap:", e),
            null == (t = this.o) ||
                t.userSet({
                    avtive_days: e,
                });
    }
    static active_hours_gm_ap(e) {
        var t;
        null == (t = this.o) ||
            t.userSet({
                active_hours: e,
            });
    }
}
