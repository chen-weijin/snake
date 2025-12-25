import { _decorator } from "cc";
import TableData, { RegTable_mini } from "../../start-scene/scripts/TableData";

const { ccclass, property } = _decorator;
@RegTable_mini("arrowsPuzzlee")
@ccclass("TblAPColor")
export class TblAPColor extends TableData {
    static AllColors = {};
    static ColorsPool = [];

    proto_class() {
        return table.APColorDataArray;
    }

    init() {
        TblAPColor.AllColors[this.data().name] = this.data().id;
        TblAPColor.ColorsPool.push(this.data().name);
    }
}
