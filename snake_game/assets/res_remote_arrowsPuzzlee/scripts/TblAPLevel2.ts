import { _decorator } from "cc";
import TableData, { RegTable_lazy } from "../../start-scene/scripts/TableData";
import { TblAPLevel } from "./TblAPLevel";

const { ccclass } = _decorator;

@ccclass("TblAPLevel2")
@RegTable_lazy("arrowsPuzzlee")
export class TblAPLevel2 extends TableData {
    proto_class() {
        return table.APLevel2DataArray;
    }

    init() {
        TblAPLevel.AllLevels[this.data().id] = this.data().name;
        TblAPLevel.Levels.push(this.data().id);
    }
}
