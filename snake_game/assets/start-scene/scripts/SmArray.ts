export class smarray {
    static remove(e, t) {
        var n = e.indexOf(t);
        if (n >= 0) {
            e.splice(n, 1);
        }
    }

    static shuffle(e) {
        var t, n;
        var i = e.length;

        while (i) {
            n = Math.floor(Math.random() * i--);
            t = e[i];
            e[i] = e[n];
            e[n] = t;
        }

        return e;
    }
}
