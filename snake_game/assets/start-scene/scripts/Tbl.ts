import { js } from "cc";
import Singleton from './Singleton';
import TableManager from './TableManager';

export class Tbl extends Singleton {
    table(e) {
        var t = TableManager.instance().getTable(e);
        if (t == null) {
            throw new Error("配表" + e + "未定义");
        }
        return t;
    }

    find(e, t) {
        var n = js.getClassName(e);
        var o = this.table(n).find(t);

        if (o == null) {
            throw new Error("配表" + n + "不存在数据" + t);
        }

        return o;
    }

    keys(e) {
        var t = js.getClassName(e);
        return this.table(t).keys();
    }

    all(e) {
        var t = js.getClassName(e);
        return this.table(t).all();
    }

    randId(e) {
        var t = js.getClassName(e);
        return this.table(t).randId();
    }

    rand(e) {
        var t = js.getClassName(e);
        return this.table(t).rand();
    }
}
