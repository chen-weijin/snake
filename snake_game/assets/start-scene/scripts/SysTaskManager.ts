import { game } from "cc";

export enum CommonTaskType {}

export enum UUIDTaskType {
    None = 20000,
    ClearEnemy = 20001,
    HPBarChange = 20002,
    HPAutoRecover = 20003,
    HideHP = 20004,
    FireAutoHide = 20005,
    WxBannerRefresh = 20006,
    WxBannerRecreate = 20007,
    StayTimeLog = 20008,
}

class SysTaskItem {
    taskID = -1;
    delay = 0;
    isPause = false;
    destTime = 0;
    curTime = 0;
    callback;
    nameString;
    constructor(e, t, n, i, o = -1, r = "") {
        this.callback = e;
        this.taskID = o;
        this.nameString = r;
        this.delay = t;
        this.destTime = n;
        this.curTime = i;
    }
}

export class SysTaskManager {
    static timeTaskArr = new Array();
    static tempDelTimeArr = new Array();

    static update2(e) {
        if (this.tempDelTimeArr.length > 0)
            for (var t = this.tempDelTimeArr.length - 1; t >= 0; t--)
                this.removeElement(this.timeTaskArr, this.tempDelTimeArr[t]),
                    this.removeElement(this.tempDelTimeArr, this.tempDelTimeArr[t]);
        for (var n = this.timeTaskArr.length - 1; n >= 0; n--)
            this.timeTaskArr[n].isPause || (this.timeTaskArr[n].curTime += e),
                this.timeTaskArr[n].curTime >= this.timeTaskArr[n].destTime &&
                    (this.timeTaskArr[n].callback(), this.removeElement(this.timeTaskArr, this.timeTaskArr[n]));
    }
    static removeElement(e, t) {
        var n = e.indexOf(t);
        n >= 0 && e.splice(n, 1);
    }
    static addTimeTask(e, t, n = -1) {
        var r = 0.001 * game.deltaTime;
        this.timeTaskArr.push(new SysTaskItem(e, t, t + r, r, n));
    }
    static addTimeTaskWithString(e, t, n = "") {
        var r = 0.001 * game.deltaTime;
        this.timeTaskArr.push(new SysTaskItem(e, t, t + r, r, -1, n));
    }
    static pauseTaskByID(e) {
        for (var t = 0; t < this.timeTaskArr.length; t++)
            if (this.timeTaskArr[t].taskID == e) {
                this.timeTaskArr[t].isPause = true;
                break;
            }
    }
    static pauseAllTask() {
        for (var e = 0; e < this.timeTaskArr.length; e++) this.timeTaskArr[e].isPause = true;
    }
    static continueAllTask() {
        for (var e = 0; e < this.timeTaskArr.length; e++) this.timeTaskArr[e].isPause = false;
    }
    static deleteTimeTaskByID(e) {
        for (var t = 0; t < this.timeTaskArr.length; t++) this.timeTaskArr[t].taskID == e && this.tempDelTimeArr.push(this.timeTaskArr[t]);
    }
    static deleteTimeTaskByName(e) {
        for (var t = 0; t < this.timeTaskArr.length; t++)
            this.timeTaskArr[t].nameString == e && this.tempDelTimeArr.push(this.timeTaskArr[t]);
    }
    static deleteAllTimeTask() {
        (this.timeTaskArr = []), (this.tempDelTimeArr = []);
    }
}
