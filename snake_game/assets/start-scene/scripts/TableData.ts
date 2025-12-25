import TableManager from "./TableManager";

export function RegTable(e) {
    TableManager.instance().regTable(e);
}

export function RegTable_lazy(e) {
    console.log("RegTable_lazy", e);
    return function (t) {
        TableManager.instance().regTable_lazy(t, e);
    };
}

export function RegTable_mini(e) {
    return function (t) {
        TableManager.instance().regTable_mini(t, e);
    };
}

export default class TableData {
    _id;
    _data;
    data() {
        return this._data;
    }

    set(e) {
        this._id = e.id;
        this._data = e;
    }

    init() {}

    get id() {
        return this._id;
    }
}

export class GroupTableData extends TableData {
    add(e) {
        e._data[0].id = this.id;
        this._data.push(e._data[0]);
    }

    set(e) {
        var t = e;
        this._data = [];
        this._id = t.id;
        this._data.push(t);
    }
}
