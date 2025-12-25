export class smrand {
    static rand(e, t) {
        if (t === void 0) {
            t = e;
            e = 0;
        }
        return Math.random() * (t - e) + e;
    }

    static randInt(t, n?) {
        return Math.floor(smrand.rand(t, n));
    }

    static randInArr(e) {
        return e.length > 0 ? e[this.randInt(e.length)] : null;
    }

    static randSome(e, t) {
        return this.shuffle(e.slice()).splice(0, t);
    }

    static shuffle(e) {
        for (var t = e.length - 1; t >= 0; t--) {
            var n = Math.floor(Math.random() * (t + 1));
            var i = e[n];
            e[n] = e[t];
            e[t] = i;
        }
        return e;
    }

    static randWeight(e, n) {
        var i = [];
        if (typeof n === "function") {
            for (var o of e) {
                i.push(n(o));
            }
        } else if (Array.isArray(n)) {
            i = n;
        }

        var s = 0;
        i.forEach(function (v) {
            s += v;
        });

        var l = this.randInt(s);
        var u = 0;
        var c = 0;

        for (var d = 0; d < i.length; d++) {
            if (l < (u += i[d])) {
                c = d;
                break;
            }
        }

        for (var f of e) {
            if (c === 0) return f;
            c--;
        }

        return null;
    }
}
