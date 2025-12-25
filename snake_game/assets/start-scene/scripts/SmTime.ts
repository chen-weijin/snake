import { smmath } from './SmMath';

export class smtime {
    static nowms() {
        return Date.now();
    }

    static now() {
        return Math.floor(Date.now() / 1000);
    }

    static parseTime(e, t?) {
        if (arguments.length === 0) return "";

        var n = t || "{y}-{m}-{d} {h}:{i}:{s}";
        var i = new Date(e < 1e11 ? e * 1000 : e);

        var o = {
            y: i.getFullYear(),
            m: i.getMonth() + 1,
            d: i.getDate(),
            h: i.getHours(),
            i: i.getMinutes(),
            s: i.getSeconds(),
            a: i.getDay(),
        };

        var r = n.replace(/{([ymdhisa])+}/g, function (_, t2) {
            var n2 = o[t2];
            return t2 === "a" ? ["日", "一", "二", "三", "四", "五", "六"][n2] : n2 < 10 ? "0" + n2 : n2.toString();
        });

        return r;
    }

    static dateStamp() {
        return new Date(new Date().toLocaleDateString()).getTime() / 1000;
    }

    static getDateStruct(e) {
        if (typeof e === "number" && e.toString().length === 10) {
            e *= 1000;
        }

        var t = new Date(e);
        return {
            y: t.getFullYear(),
            m: t.getMonth() + 1,
            d: t.getDate(),
            h: t.getHours(),
            i: t.getMinutes(),
            s: t.getSeconds(),
            a: t.getDay(),
        };
    }

    static formatTime(e, n?) {
        if (("" + e).length === 10) {
            e *= 1000;
        }

        var i = new Date(e).getTime();
        var o = (Date.now() - i) / 1000;

        if (o < 30) return "刚刚";
        if (o < 3600) return Math.ceil(o / 60) + "分钟前";
        if (o < 86400) return Math.ceil(o / 3600) + "小时前";
        if (o < 172800) return "1天前";
        if (n) return this.parseTime(e, n);

        var r = new Date(e);
        return r.getMonth() + 1 + "月" + r.getDate() + "日" + r.getHours() + "时" + r.getMinutes() + "分";
    }

    static getTimeBySecond(e) {
        e = Math.floor(e);
        smmath.prefixFill(Math.round((e - 1800) / 3600), 2);

        var t = Math.round((e - 30) / 60) % 60;
        var i = e % 60;

        return (t > 0 ? (t >= 10 ? (t % 100) + ":" : "0" + t + ":") : "00:") + (i > 0 ? (i >= 10 ? i % 100 : "0" + i) : "00");
    }

    static getTimeBySecond2(e) {
        e = Math.floor(e);

        var t = Math.round((e - 1800) / 3600);
        var n = Math.round((e - 30) / 60) % 60;
        var i = e % 60;

        return (
            (t > 0 ? (t >= 10 ? (t % 100) + ":" : "0" + t + ":") : "00:") +
            (n > 0 ? (n >= 10 ? (n % 100) + ":" : "0" + n + ":") : "00:") +
            (i > 0 ? (i >= 10 ? i % 100 : "0" + i) : "00")
        );
    }
}
