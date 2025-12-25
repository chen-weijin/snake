import { _decorator } from "cc";
import TableData, { RegTable_mini } from "../../start-scene/scripts/TableData";

const { ccclass } = _decorator;
@RegTable_mini("arrowsPuzzlee")
@ccclass("TblAPLevel")
export class TblAPLevel extends TableData {
    static AllLevels: any = {};
    static Levels: any[] = [];

    proto_class() {
        return table.APLevelDataArray;
    }

    init() {
        TblAPLevel.AllLevels[this.data().id] = this.data().name;
        TblAPLevel.Levels.push(this.data().id);
    }
}
