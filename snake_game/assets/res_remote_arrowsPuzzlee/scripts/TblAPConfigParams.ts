import { _decorator } from "cc";
import TableData, { RegTable_mini } from "../../start-scene/scripts/TableData";

const { ccclass } = _decorator;
@RegTable_mini("arrowsPuzzlee")
@ccclass("TblAPConfigParams")
export class TblAPConfigParams extends TableData {
    proto_class() {
        return table.APConfigParamsDataArray;
    }
}
