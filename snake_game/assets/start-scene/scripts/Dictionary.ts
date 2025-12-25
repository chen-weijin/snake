export default class Dictionary {
    items = {};

    has(e) {
        return this.items.hasOwnProperty(e);
    }

    set(e, t) {
        this.items[e] = t;
    }

    delete(e) {
        return this.has(e) && delete this.items[e], false;
    }

    get(e) {
        return this.has(e) ? this.items[e.toString()] : void 0;
    }

    values() {
        const e = [];
        for (let t in this.items) {
            if (this.has(t)) e.push(this.items[t]);
        }
        return e;
    }
}
