import { _decorator } from "cc";
import TableData, { RegTable_mini } from "../../start-scene/scripts/TableData";
import { APGameConfig } from "./APGameConfig";

const { ccclass, property } = _decorator;
@RegTable_mini("arrowsPuzzlee")
@ccclass("TblAPShiWan")
export class TblAPShiWan extends TableData {
    static AllLevels: any = {};
    static Levels: any[] = [];

    proto_class() {
        return table.APShiWanDataArray;
    }

    init() {
        if (this.data().shiwanId == APGameConfig.shiWanId) {
            TblAPShiWan.AllLevels[this.data().id] = this.data().name;
            TblAPShiWan.Levels.push(this.data().id);
        }
    }
}
