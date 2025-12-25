import { sys } from "cc";
import { SdkGameConfig, SdkPkgConfig } from "./SdkConfig";
import { sdktools } from "./SdkTools";

export class SdkStorage {
    static sdkData = {};
    static managerData = {};
    static remoteData = {
        updatetime: 0,
    };
    static isNeedSaveRemote = false;

    static appid;

    static openid;

    static get storageLocalTime() {
        var e = sys.localStorage.getItem("storageLocalTime");
        return e && e != null && e != null ? parseInt(e) : 0;
    }

    static set storageLocalTime(e) {
        sys.localStorage.setItem("storageLocalTime", e);
    }

    static init() {
        try {
            var e = sys.localStorage.getItem("sdk");
            e && (this.sdkData = JSON.parse(e));
        } catch (e) {
            console.error("解析sdk存储数据失败", e), (this.sdkData = {});
        }
    }
    static saveSdk(e, t) {
        if (this.sdkData[e] !== t) {
            this.sdkData[e] = t;
            try {
                sys.localStorage.setItem("sdk", JSON.stringify(this.sdkData));
            } catch (e) {
                console.error("sdk数据保存失败", e);
            }
        }
    }
    static getSdk(e, t) {
        return void 0 !== this.sdkData[e] ? this.sdkData[e] : (this.init(), void 0 !== this.sdkData[e] ? this.sdkData[e] : t);
    }
    static initMangerData(e) {
        var t = sys.localStorage.getItem(e);
        try {
            t && (this.managerData[e] = JSON.parse(t)),
                SdkGameConfig.isShowDebugLog && console.log("initMangerData", t, this.managerData[e]);
        } catch (n) {
            console.error("解析managerData存储数据失败1,尝试不进行JSON.parse", n);
            try {
                this.managerData[e] = t;
            } catch (e) {
                console.error("解析managerData存储数据完全失败，重置数据", e), (this.managerData = {});
            }
        }
    }
    static saveManagerData(e, t) {
        (this.managerData[e] = t), (this.remoteData[e] = t), (this.isNeedSaveRemote = true);
        try {
            sys.localStorage.setItem(e, JSON.stringify(t));
        } catch (e) {
            console.error("sdk数据保存失败", e);
        }
    }
    static getManagerData(e, t) {
        return void 0 !== this.managerData[e]
            ? this.managerData[e]
            : (this.initMangerData(e), void 0 !== this.managerData[e] ? this.managerData[e] : t);
    }
    static clearSdkData() {
        (this.sdkData = {}), sys.localStorage.removeItem("sdk");
    }
    static save() {}
    static get() {}
    static loadRemoteData(e, t, n) {
        var i = this;
        return SdkGameConfig.isOpenRemoteData
            ? (console.log("获取远程数据, openid:", e, " appid:", t),
              !e || e.length <= 0 || !t || t.length <= 0
                  ? (this.updateStorageLocalTime(), n())
                  : ((this.openid = e),
                    (this.appid = t),
                    sdktools.request2$(
                        SdkGameConfig.LoadRemoteDataUrl,
                        JSON.stringify({
                            appid: this.appid,
                            openid: this.openid,
                            gameid: SdkPkgConfig.gameid,
                        }),
                        function (e) {
                            try {
                                if (
                                    ((i.remoteData = JSON.parse(e)),
                                    i.remoteData.updatetime || (i.remoteData.updatetime = 0),
                                    console.log("加载远程数据完毕, localtime", i.storageLocalTime, " remotetime:", i.remoteData.updatetime),
                                    console.log("远程数据, localtime", i.storageLocalTime, " remotetime:", i.remoteData.updatetime),
                                    i.storageLocalTime < i.remoteData.updatetime)
                                )
                                    for (var t in (console.log("更新本地数据, 更新数据量:", Object.keys(i.remoteData).length),
                                    i.remoteData))
                                        console.log("更新本地数据:", t, i.remoteData[t]),
                                            window.SmSdk.sdkImp.storageSet(t, i.remoteData[t]);
                            } catch (t) {
                                console.log("解析远程数据异常", e, t);
                            }
                            i.updateStorageLocalTime(), n();
                        },
                        function (e, t) {
                            console.log("加载远程数据异常", e, t), i.updateStorageLocalTime(), n();
                        }
                    ),
                    void this.startSyncRemoteData()))
            : n();
    }
    static startSyncRemoteData() {
        var e = this;
        console.log("启动远程数据同步"),
            setInterval(function () {
                if (e.isNeedSaveRemote) {
                    (e.isNeedSaveRemote = false),
                        console.log("开始同步远程数据, localtime", e.storageLocalTime, " remotetime:", e.remoteData.updatetime);
                    var t: any = {};
                    for (var n in e.remoteData) t[n] = e.remoteData[n];
                    (t.updatetime = e.storageLocalTime),
                        console.log("开始同步远程数据", t),
                        sdktools.request2$(
                            SdkGameConfig.SyncRemoteDataUrl,
                            JSON.stringify({
                                appid: e.appid,
                                openid: e.openid,
                                gameid: SdkPkgConfig.gameid,
                                userdata: JSON.stringify(t),
                            }),
                            function (n) {
                                console.log("远程数据同步完毕"), (e.remoteData.updatetime = t.updatetime);
                            },
                            function (e, t) {
                                console.log("同步远程数据异常", e, t);
                            }
                        );
                } else console.log("数据未变更, 不进行远程数据同步");
            }, 1e3 * SdkGameConfig.remoteDataSaveInterval);
    }
    static updateStorageLocalTime() {
        setInterval(function () {
            SdkStorage.storageLocalTime = Date.now();
        }, 1e3);
    }
    resetRemoteData() {
        if (!SdkStorage.openid || SdkStorage.openid.length <= 0 || !SdkStorage.appid || SdkStorage.appid.length <= 0)
            console.log("无远程数据，不需要重置");
        else {
            var t = {
                updatetime: 0,
            };
            for (var n in SdkStorage.remoteData) console.log("清除本地数据:", n), (t[n] = "{}");
            (t[SdkPkgConfig.projectName + "_account"] = "{}"),
                (t.updatetime = 0),
                sdktools.request2$(
                    SdkGameConfig.SyncRemoteDataUrl,
                    JSON.stringify({
                        appid: SdkStorage.appid,
                        openid: SdkStorage.openid,
                        userdata: JSON.stringify(t),
                    }),
                    function (e) {
                        console.log("重置远程数据完毕"), sys.localStorage.clear();
                    },
                    function (e, t) {
                        console.log("同步远程数据异常", e, t);
                    }
                );
        }
    }
}
