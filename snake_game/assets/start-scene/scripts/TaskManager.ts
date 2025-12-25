import { _decorator } from "cc";

export enum CommonTaskType {
    None = 10000,
    NativeADLoopCreate = 10001,
    PushADAutoFreash = 10002,
    AddGoldAni = 10003,
    WoodUIRefresh = 10004,
}

export enum UUIDTaskType {
    None = 20000,
    ClearEnemy = 20001,
    HPBarChange = 20002,
    HPAutoRecover = 20003,
    HideHP = 20004,
}

class TaskItem {
    isBattle = false;
    taskID = -1;
    delay = 0;
    isPause = false;
    destTime = 0;
    curTime = 0;
    callback;
    nameString;
    constructor(e, t, n, i, o = -1, r = "", a = true) {
        this.callback = e;
        this.taskID = o;
        this.nameString = r;
        this.delay = t;
        this.destTime = n;
        this.curTime = i;
        this.isBattle = a;
    }
}

export class TaskManager {
    static timeTaskArr = new Array();
    static battleTimeTaskArr = new Array();
    static tempDelTimeArr = new Array();

    static CommonTaskType = CommonTaskType;
    static UUIDTaskType = UUIDTaskType;

    static update2(e) {
        if (this.tempDelTimeArr.length > 0)
            for (var t = this.tempDelTimeArr.length - 1; t >= 0; t--)
                this.removeElement(this.timeTaskArr, this.tempDelTimeArr[t]),
                    this.removeElement(this.tempDelTimeArr, this.tempDelTimeArr[t]);
        for (var n = this.timeTaskArr.length - 1; n >= 0; n--)
            if (
                (this.timeTaskArr[n].isPause || (this.timeTaskArr[n].curTime += e),
                this.timeTaskArr[n].curTime >= this.timeTaskArr[n].destTime)
            ) {
                var i = this.timeTaskArr[n];
                try {
                    this.timeTaskArr[n].callback(), this.removeElement(this.timeTaskArr, i);
                } catch (e) {
                    this.removeElement(this.timeTaskArr, i), console.error(e);
                }
            }
        if (!window.btl.ctrl.paused)
            for (var o = this.battleTimeTaskArr.length - 1; o >= 0; o--)
                if (
                    (this.battleTimeTaskArr[o].isPause || (this.battleTimeTaskArr[o].curTime += e),
                    this.battleTimeTaskArr[o].curTime >= this.battleTimeTaskArr[o].destTime)
                ) {
                    var r = this.battleTimeTaskArr[o];
                    try {
                        this.battleTimeTaskArr[o].callback(), this.removeElement(this.battleTimeTaskArr, r);
                    } catch (e) {
                        this.removeElement(this.battleTimeTaskArr, r), console.error(e);
                    }
                }
    }
    static removeElement(e, t) {
        var n = e.indexOf(t);
        n >= 0 && e.splice(n, 1);
    }
    static addBattleTimeTask(e, t, n = -1) {
        this.battleTimeTaskArr.push(new TaskItem(e, t, t, 0, n, "", true));
    }
    static addBattleTimeTaskWithString(e, t, n = "") {
        this.battleTimeTaskArr.push(new TaskItem(e, t, t, 0, -1, n, true));
    }
    static addNormalTimeTask(e, t, n = -1) {
        this.timeTaskArr.push(new TaskItem(e, t, t, 0, n, "", false));
    }
    static addNormalTimeTaskWithString(e, t, n = "") {
        this.timeTaskArr.push(new TaskItem(e, t, t, 0, -1, n, false));
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
        for (var n = 0; n < this.battleTimeTaskArr.length; n++)
            this.battleTimeTaskArr[n].nameString == e && this.battleTimeTaskArr.push(this.battleTimeTaskArr[n]);
    }
    static clearBattleTimeTask() {
        TaskManager.battleTimeTaskArr = [];
    }
    static deleteAllTimeTask() {
        (this.timeTaskArr = []), (this.battleTimeTaskArr = []), (this.tempDelTimeArr = []);
    }
}
