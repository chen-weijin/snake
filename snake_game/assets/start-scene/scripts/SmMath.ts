import { Vec3 } from "cc";

const o = ["K", "M", "B", "T"];
const r = "a".charCodeAt(0);

export class smmath {
    static prefixFill(e, t = 2, n = "0") {
        return (Array(t).join(n) + e).slice(-t);
    }

    static GetBezierPoint(e, t, i, o2) {
        return Vec3.multiplyScalar(new Vec3(), t, (1 - e) * (1 - e))
            .add3f(2 * e * (1 - e) * i.x, 2 * e * (1 - e) * i.y, 2 * e * (1 - e) * i.z)
            .add3f(e * e * o2.x, e * e * o2.y, e * e * o2.z);
    }

    static reduceNum(e) {
        e = Math.floor(e);
        if (e < 10) return e.toString();

        var t = "";
        while (e > 0) {
            t = (e % 10) + t;
            e = Math.floor(e / 10);
        }

        var n = Math.floor((t.length - 1) / 3);
        if (n <= 0) return t;

        var i = (function (e2) {
            if (e2 <= 0) return "";
            e2 -= 1;
            if (e2 < o.length) return o[e2];
            e2 -= o.length;
            return String.fromCharCode(r + Math.floor(e2 / 26)) + String.fromCharCode(r + (e2 % 26));
        })(n);

        if (t.length % 3 == 0) {
            return t[0] + t[1] + t[2] + i;
        } else if (t.length % 3 == 1) {
            return t[0] + "." + +t[1] + t[2] + i;
        } else {
            return t[0] + t[1] + "." + t[2] + i;
        }
    }

    static formatNumber(e) {
        function trimZero(str) {
            if (str.includes(".")) {
                str = str.replace(/0+$/, "");
                str = str.replace(/\.$/, "");
            }
            return str;
        }

        return e >= 1e6
            ? trimZero((e / 1e6).toFixed(2).toString()) + "M"
            : e >= 1e3
            ? trimZero((e / 1e3).toFixed(2).toString()) + "K"
            : e.toString();
    }
}
