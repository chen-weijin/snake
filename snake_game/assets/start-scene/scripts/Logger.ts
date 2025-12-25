import { log, warn, error, sys } from "cc";
import Singleton from './Singleton';
import { smtime } from './SmTime';

enum u {
    None = 0,
    Debug = 1,
    Warn = 2,
    Error = 3,
}

const c = {
    "b-gb1": "background: #255; color: #ff80ff",
    "b-gb": "background: #255; color: #00ffff",
    "b-g": "background: #255; color: #00ff00",
    "w-g": "background: #0; color: #007f00",
};

export class Logger extends Singleton {
    logger_level = u.Debug;
    history = {};

    debug() {
        if (!(this.logger_level > u.Debug)) {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            this.__log(log, t);
        }
    }
    warn() {
        if (!(this.logger_level > u.Warn)) {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            this.__log(warn, t);
        }
    }
    error() {
        if (!(this.logger_level > u.Error)) {
            for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
            this.__log(error, t);
        }
    }
    __log(e, t) {
        (t = this.format_log(e.name, t)), console.log.apply(console.log, t), this.__addHistory(e.name, t), this.__addHistory("all", t);
    }
    __addHistory(e, t) {
        var n = this.history[e];
        n || (n = this.history[e] = []), n.push(t.join("")), n.length > 200 && n.shift();
    }
    format_log(e, t) {
        var n = "##" + e + "##[" + smtime.parseTime(Date.now(), "{m}-{d} {h}:{i}:{s}") + this.scrpit_loc() + "]",
            i = c[t[0]];
        return i
            ? (t.splice(0, 1), "chrome" == sys.browserType ? ((t[0] = "%c" + n + t[0]), t.splice(1, 0, i)) : t.splice(0, 0, n), t)
            : (t.splice(0, 0, n), t);
    }
    scrpit_loc() {
        var e = new Error().stack.split("\n");
        if ((e.shift(), e.length <= 4)) return "";
        var t = e[4].substring(7).split(" ")[0];
        return t.indexOf(".") > 0 ? "|" + t : "";
    }
}
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 https://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 https://web3incubators.com/kefu.html