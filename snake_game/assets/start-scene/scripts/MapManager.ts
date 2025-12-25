import { _decorator, Component } from "cc";
import smtools from "./SmTools";

const { ccclass } = _decorator;
@ccclass("MapManager")
export class MapManager extends Component {
    static __instance;
    itemHolder;
    myBalls;

    static get instance() {
        return MapManager.__instance;
    }

    init() {
        (MapManager.__instance = this),
            (this.itemHolder = smtools.find(this.node, "itemHolder")),
            (this.myBalls = smtools.find(this.node, "myBalls"));
    }
    clearGame() {
        for (var e = this.itemHolder.children.length - 1; e >= 0; e--) {
            var t = this.itemHolder.children[e];
            (t.active = false), window.sm.pool.put(t);
        }
    }
}
