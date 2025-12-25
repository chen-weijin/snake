import { sys } from "cc";
import { PanelId } from "./PanelId";
import { SdkGameConfig } from "./SdkConfig";
import { sdkutils } from "./Utils";

export class Statistics {
    curPlayDay = 0;
    statDay = "day";
    data = {};
    data2 = {};
    tempDataAD = {};
    tempDataDayAD = {};
    tempDataAB = {};
    tempDataDayAB = {};

    get statFirstPlayTime() {
        return sys.localStorage.getItem("firstPlayTime", 0);
    }

    set statFirstPlayTime(e) {
        sys.localStorage.setItem("firstPlayTime", e);
    }

    get statLastPlayTime() {
        return sys.localStorage.getItem("lastPlayTime", 0);
    }

    set statLastPlayTime(e) {
        sys.localStorage.setItem("lastPlayTime", e);
    }

    get onceStats() {
        var e = sys.localStorage.getItem("onceStats");
        return e ? JSON.parse(e) : [];
    }

    set onceStats(e) {
        sys.localStorage.setItem("onceStats", JSON.stringify(e));
    }

    init() {
        if (null == this.statFirstPlayTime || 0 == this.statFirstPlayTime)
            (this.statFirstPlayTime = new Date().getTime()),
                (this.statLastPlayTime = new Date().getTime()),
                (this.statDay += 1),
                this.cusEvent("today_login");
        else {
            var e = sdkutils.caleCurDay(this.statFirstPlayTime);
            e <= SdkGameConfig.statDayCount && (this.statDay += e),
                sdkutils.isNewDay(this.statLastPlayTime) && this.cusEvent("today_login"),
                (this.statLastPlayTime = new Date().getTime());
        }
    }
    recrodOnceStat(e) {
        (null != this.onceStats && null != this.onceStats) || (this.onceStats = []);
        for (var t = [], n = 0; n < this.onceStats.length; n++) {
            var i = this.onceStats[n];
            if (i == e) return true;
            t.push(i);
        }
        return t.push(e.toString()), (this.onceStats = t), false;
    }
    loginStart() {}
    loginSuccess() {}
    logout() {}
    guideStep(e) {
        this.customEvent("gamestat", "gamestat", e);
    }
    rewardStart(e) {
        this.customEvent("gamestat", "gamestat", 100 * e + 1), this.customEvent("gamestat", "gamestat", 100 * PanelId.Default + 1);
    }
    rewardLoad(e) {
        this.customEvent("gamestat", "gamestat", 100 * e + 2), this.customEvent("gamestat", "gamestat", 100 * PanelId.Default + 2);
    }
    rewardSuccess(e) {
        this.customEvent("gamestat", "gamestat", 100 * e + 3), this.customEvent("gamestat", "gamestat", 100 * PanelId.Default + 3);
    }
    cusEvent(e) {
        this.customEvent("gamestat", "gamestat", e);
    }
    cusEventOnce(e) {
        this.recrodOnceStat(e) || this.customEvent("gamestat", "gamestat", e);
    }
    cusEventWithTage(e, t) {
        this.customEvent("gamestat", t, e);
    }
    customEvent(e, t, n) {
        if (
            ((this.data = {}),
            (this.data[t] = n.toString()),
            (this.data2 = {}),
            (this.data2[t] = this.statDay + n.toString()),
            SdkGameConfig.isOpenStatConsole &&
                (console.log("tagtagtag", t), console.log("总埋点", e, this.data[t]), console.log("总埋点天数", e, this.data2[t])),
            window.SmSdk.uma)
        ) {
            if ((window.SmSdk.uma.trackEvent(e, this.data), window.SmSdk.uma.trackEvent(e, this.data2), window.SmSdk.adLink.length > 0)) {
                SdkGameConfig.isOpenStatConsole && console.log("进入广告参数: " + window.SmSdk.adLink);
                var i = sdkutils.filterSpecialChars(window.SmSdk.adLink);
                (this.tempDataAD = {}),
                    (this.tempDataDayAD = {}),
                    (this.tempDataAD[i] = n.toString()),
                    (this.tempDataDayAD[i] = this.statDay + n.toString()),
                    window.SmSdk.uma.trackEvent(e, this.tempDataAD),
                    window.SmSdk.uma.trackEvent(e, this.tempDataDayAD);
            }
            if (SdkGameConfig.abTestValueArr.length > 0)
                for (var o = 0; o < SdkGameConfig.abTestValueArr.length; o++) {
                    var s = SdkGameConfig.abTestValueArr[o];
                    SdkGameConfig.isOpenStatConsole && console.log("ab实验参数: " + s),
                        (s = sdkutils.filterSpecialChars(s)),
                        (this.tempDataAB = {}),
                        (this.tempDataDayAB = {}),
                        (this.tempDataAB[s] = n.toString()),
                        (this.tempDataDayAB[s] = this.statDay + n.toString()),
                        window.SmSdk.uma.trackEvent(e, this.tempDataAB),
                        window.SmSdk.uma.trackEvent(e, this.tempDataDayAB);
                }
        }
    }
}
