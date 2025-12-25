import { js } from "cc";
import { smrand } from "./SmRand";

export class Table {
    _datas = {};
    _keys = [];

    load(e, t) {
        t = t.items;
        window.sm.log.warn("加载配表" + js.getClassName(e));

        for (var n in t) {
            var o = new e();
            o.set(t[n]);
            this.addData(o);
        }
    }

    init() {
        for (var e in this._datas) {
            this._datas[e].init();
        }
    }

    addData(e) {
        this._datas[e.id] = e;
        this._keys.push(e.id);
    }

    find(e) {
        return this._datas[e];
    }

    keys() {
        return this._keys;
    }

    all() {
        var self = this;
        return this._keys.map(function (t) {
            return self._datas[t];
        });
    }

    rand() {
        return this._datas[smrand.randInArr(this._keys)];
    }

    randId() {
        return smrand.randInArr(this._keys);
    }
}

export class GroupTable extends Table {
    last;

    addData(e) {
        if (e.isKeyEmpty()) {
            this.last.add(e);
        } else {
            this.last = e;
            this._datas[e.id] = e;
            this._keys.push(e.id);
        }
    }
}
