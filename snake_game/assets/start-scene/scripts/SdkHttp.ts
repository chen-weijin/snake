import { _decorator } from "cc";
import { SdkGameConfig } from "./SdkConfig";

export class sdkhttp {
    static request(e, t, n) {
        var i = new XMLHttpRequest();
        (i.responseType = "text"),
            (i.onload = function () {
                var e = {};
                try {
                    e = JSON.parse(i.response);
                } catch (e) {
                    return void n(e);
                }
                t(e);
            }),
            (i.onerror = function (t) {
                console.log(e + "请求失败", i.status), n(t);
            }),
            i.open("GET", e, true),
            i.send();
    }
    static requestv3(e, t, i, o?) {
        var r = new XMLHttpRequest();
        (r.responseType = "text"),
            SdkGameConfig.isShowDebugLog && console.log("##服务器请求##开始##", e, t),
            (r.onload = function () {
                SdkGameConfig.isShowDebugLog && console.log("##服务器请求##成功##", e, t, r.response),
                console.log("HTTP状态码:", r.status),
                console.log("完整响应内容:", r.response),
                console.log("响应类型:", typeof r.response);
                try {
                    var a = JSON.parse(r.response);
                    0 == a.code
                        ? i(a.data)
                        : (console.error("请求错误:", e, "code:", a.code, "msg:", a.msg, " req data:", t), o && o(a.code, a.msg));
                } catch (n) {
                    console.error("请求错误:", e, " http错误:", r.status, " req data:", t, n), o && o(r.status, n);
                }
            }),
            (r.onerror = function () {
                console.error("##服务器请求##失败##", e, r.status, r.response), o && o(r.status, r.response);
            }),
            (r.ontimeout = function (t) {
                console.error("##服务器请求##超时##", e, r.status, r.response, t), o && o(r.status, r.response);
            }),
            r.open("POST", e, true),
            (r.timeout = 5e3),
            r.setRequestHeader("Content-Type", "application/json"),
            console.log("完整请求URL:", e),
            console.log("请求头:", { "Content-Type": "application/json" }),
            console.log("请求体:", t),
            r.send(t);
    }
    static request$(e, t, i, o) {
        var r = new XMLHttpRequest();
        (r.responseType = "text"),
            (r.onload = function () {
                SdkGameConfig.isShowDebugLog && console.log("##服务器请求##成功##", e, t, r.response);
                try {
                    var a = JSON.parse(r.response);
                    0 == a.code ? i(a.data) : o && o(a.code, a.data);
                } catch (e) {
                    o && o(r.status, e);
                }
            }),
            (r.onerror = function () {
                o && o(r.status, r.response);
            }),
            (r.ontimeout = function (e) {
                o && o(r.status, r.response);
            }),
            r.open("POST", e, true),
            (r.timeout = 5e3),
            r.setRequestHeader("Content-Type", "application/json"),
            r.send(t);
    }
    static request2$(e, t, n, i) {
        var o = new XMLHttpRequest();
        (o.responseType = "text"),
            (o.onload = function () {
                try {
                    var e = JSON.parse(o.response);
                    0 == e.code ? n(e.message) : i && i(e.code, e.message);
                } catch (e) {
                    i && i(o.status, e);
                }
            }),
            (o.onerror = function () {
                i && i(o.status, o.response);
            }),
            (o.ontimeout = function (e) {
                i && i(o.status, o.response);
            }),
            o.open("POST", e, true),
            (o.timeout = 5e3),
            o.setRequestHeader("Content-Type", "application/json"),
            o.send(t);
    }
    static requestv4(e, t, n?) {
        var i = new XMLHttpRequest();
        (i.responseType = "text"),
            window.sm.log.debug("@@@请求##开始##", e),
            (i.onload = function () {
                window.sm.log.debug("@@@请求##成功##", e, i.response);
                try {
                    var o;
                    try {
                        o = JSON.parse(i.response);
                    } catch (e) {
                        o = i.response;
                    }
                    t(o);
                } catch (t) {
                    window.sm.log.error("@@@请求错误:", e, " http错误:", i.status, t), n && n(i.status, t);
                }
            }),
            (i.onerror = function () {
                window.sm.log.error("@@@请求##失败##", e, i.status, i.response), n && n(i.status, i.response);
            }),
            (i.ontimeout = function (t) {
                window.sm.log.error("@@@请求##超时##", e, i.status, i.response, t), n && n(i.status, i.response);
            }),
            i.open("GET", e, true),
            (i.timeout = 5e3),
            i.send();
    }
}
