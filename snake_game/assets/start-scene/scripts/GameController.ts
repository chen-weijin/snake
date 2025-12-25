import { _decorator, game, Component } from "cc";
import { SysTaskManager } from "./SysTaskManager";
import { TaskManager } from "./TaskManager";

const { ccclass } = _decorator;
@ccclass("GameController")
export class GameController extends Component {
    start() {
        game.addPersistRootNode(this.node);
    }
    update(e) {
        e = Math.min(0.1, e);
        try {
            TaskManager.update2(e);
            SysTaskManager.update2(e);
        } catch (e) {
            console.error("全局定时器触发异常", e);
        }
        try {
            window.btl.ctrl.update2(e);
            window.sm.pool.update2(e);
        } catch (e) {
            console.error("战斗定时器出异常", e);
        }
    }
}
