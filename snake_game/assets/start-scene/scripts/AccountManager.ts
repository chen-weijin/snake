import { smtime } from "./SmTime";
import { BaseGameManager } from "./BaseGameManager";

export class AccountManager extends BaseGameManager {
    get name() {
        return "account";
    }

    get openid() {
        return this.get("openid", "");
    }
    set openid(e) {
        this.save("openid", e);
    }

    get playTimes() {
        return this.get("playTimes", 0);
    }
    set playTimes(e) {
        this.save("playTimes", e);
    }

    get wxPlayDays() {
        return this.get("wxPlayDays", 0);
    }
    set wxPlayDays(e) {
        this.save("wxPlayDays", e);
    }

    get playTimeToday() {
        return this.get("playTimeToday", 0);
    }
    set playTimeToday(e) {
        this.save("playTimeToday", e);
    }

    get playTimeTodayReported() {
        return this.get("playTimeTodayReported", 0);
    }
    set playTimeTodayReported(e) {
        this.save("playTimeTodayReported", e);
    }

    get playTimeDay() {
        return this.get("playTimeDay", "");
    }
    set playTimeDay(e) {
        this.save("playTimeDay", e);
    }

    get playTimeTotal() {
        return this.get("playTimeTotal", 0);
    }
    set playTimeTotal(e) {
        this.save("playTimeTotal", e);
    }

    get firstPlayTime() {
        return this.get("firstPlayTime", 0);
    }
    set firstPlayTime(e) {
        this.save("firstPlayTime", e);
    }

    get lookRewardADCount() {
        return this.get("lookRewardADCount", 0);
    }
    set lookRewardADCount(e) {
        this.save("lookRewardADCount", e);
    }

    get zhichuReportTime() {
        return this.get("zhichuReportTime", "");
    }
    set zhichuReportTime(e) {
        this.save("zhichuReportTime", e);
    }

    get wxSubcribes() {
        return this.get("wxSubcribes", []);
    }
    set wxSubcribes(e) {
        this.save("wxSubcribes", e);
    }

    get soundVolume() {
        return this.get("soundVolume", 1);
    }
    set soundVolume(e) {
        this.save("soundVolume", e);
    }

    get musicVolume() {
        return this.get("musicVolume", 1);
    }
    set musicVolume(e) {
        this.save("musicVolume", e);
    }

    get isVibrate() {
        return this.get("isVibrate", true);
    }
    set isVibrate(e) {
        this.save("isVibrate", e);
    }

    get freePowerPayStartTime() {
        return this.get("freePowerPayStartTime", 0);
    }
    set freePowerPayStartTime(e) {
        this.save("freePowerPayStartTime", e);
    }

    get freePowerPayKeepTime() {
        return this.get("freePowerPayKeepTime", 30);
    }
    set freePowerPayKeepTime(e) {
        this.save("freePowerPayKeepTime", e);
    }

    get freePowerPay() {
        return smtime.now() - this.freePowerPayStartTime < this.freePowerPayKeepTime && 0 != this.freePowerPayStartTime;
    }

    get powerStartResumeTime() {
        return this.get("powerStartResumeTime", 0);
    }
    set powerStartResumeTime(e) {
        this.save("powerStartResumeTime", e);
    }

    init() {}
    updateWxScene(e) {
        var t = this.get("wxScene", e);
        return this.save("wxScene", t), t;
    }
    guideSm(e) {
        this.guide("window.sm", e) || window.SmSdk.stat.guideStep(e);
    }
    guideWx(e) {
        this.guide("wx", e);
    }
    guide(e, t) {
        t = t.toString();
        var n = "guide_" + e,
            i = this.get(n, []);
        return (
            !!i.find(function (e) {
                return e === t;
            }) || (i.push(t), this.save(n, i), false)
        );
    }
}
