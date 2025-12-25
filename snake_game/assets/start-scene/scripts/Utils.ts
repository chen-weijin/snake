export class sdkutils {
    static rand(e, t?) {
        return void 0 === t && ((t = e), (e = 0)), Math.random() * (t - e) + e;
    }
    static randInt(t, n?) {
        return Math.floor(sdkutils.rand(t, n));
    }
    static randInArr(e) {
        return e.length > 0 ? e[this.randInt(e.length)] : null;
    }
    static post(e, t, n, i?) {
        var o = JSON.stringify(t),
            r = new XMLHttpRequest();
        (r.responseType = "text"),
            (r.onload = function () {
                try {
                    var t = JSON.parse(r.response);
                    0 == t.code
                        ? n && n(t.data)
                        : (console.error("### smsdk ### 请求错误:", e, "code:", t.code, "msg:", t.msg, " req data:", o),
                          i && i(t.code, t.msg));
                } catch (t) {
                    console.error("### smsdk ### 请求错误:", e, " http错误:", r.status, " req data:", o, t), i && i(r.status, t);
                }
            }),
            (r.onerror = function () {
                console.error("### smsdk ### ##服务器请求##失败##", e, r.status, r.response), i && i(r.status, r.response);
            }),
            (r.ontimeout = function (t) {
                console.error("### smsdk ### ##服务器请求##超时##", e, r.status, r.response, t), i && i(r.status, r.response);
            }),
            r.open("POST", e, true),
            (r.timeout = 3e3),
            r.setRequestHeader("Content-Type", "application/json"),
            r.send(o);
    }
    static caleCurDay(e) {
        var t = new Date(),
            n = new Date(e).getTime(),
            i = new Date(e),
            o = (86400 - (3600 * i.getHours() + 60 * i.getMinutes() + i.getSeconds())) / 86400,
            r = t.getTime() - n;
        return (r = r / 1e3 / 24 / 60 / 60), Math.ceil(r - o) + 1;
    }
    static isNewDay(e) {
        var t = new Date(),
            n = new Date(e);
        return t.getUTCFullYear() > n.getUTCFullYear() || t.getUTCMonth() > n.getUTCMonth() || t.getUTCDay() > n.getUTCDay();
    }
    static filterSpecialChars(e) {
        return e ? e.replace(/[^a-zA-Z0-9]/g, "") : "";
    }
}
