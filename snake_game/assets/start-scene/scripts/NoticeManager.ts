import { Tip } from "./Tip";

export class NoticeManager {
    _layer;
    tip_root;
    tip_prefab;
    last_msg;
    last_node;

    constructor(e) {
        const t = this;
        this._layer = e;
        this.tip_root = e.getChildByName("tip_root");

        window.sm.res.loadPrefab("prefab/ui/tip").then(function (e) {
            t.tip_prefab = e;
        });
    }

    tip(e) {
        let t;
        t =
            this.last_node && this.last_node.node.parent != null && this.last_msg == e
                ? this.last_node
                : window.sm.pool.get(this.tip_prefab, this.tip_root).getComponent(Tip);

        t.show(e);

        this.last_msg = e;
        this.last_node = t;
    }

    get layer() {
        return this._layer;
    }
}
