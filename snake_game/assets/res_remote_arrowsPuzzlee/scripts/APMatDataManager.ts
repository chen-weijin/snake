import { _decorator } from "cc";
import { BaseGameManager } from "../../start-scene/scripts/BaseGameManager";
import { TaskManager } from "../../start-scene/scripts/TaskManager";
import { TblAPColor } from "./TblAPColor";

const { ccclass } = _decorator;
@ccclass("APMatDataManager")
export class APMatDataManager extends BaseGameManager {
    AllColors = {};
    ColorsPool = [];
    imageCache_body = {};
    imageCache_tail = {};
    imageCache_tailEnd = {};
    imageCache_head = {};

    get name() {
        return "mat";
    }

    init() {}
    onManagerInit() {
        (this.AllColors = TblAPColor.AllColors), (this.ColorsPool = TblAPColor.ColorsPool);
    }
    loadSkin() {
        for (var e = 0, t = 0; t < this.ColorsPool.length; t++) (e += 0.04), this.loadOneColor(this.ColorsPool[t], e);
    }
    loadOneColor(e, t) {
        var n = this;
        TaskManager.addNormalTimeTask(function () {
            n.getBodyRes(e), n.getTailRes(e), n.getHeadRes(e), n.getTailEndRes(e);
        }, t);
    }
    getOneColorName() {
        return this.ColorsPool[Math.floor(Math.random() * TblAPColor.ColorsPool.length)];
    }

    async getBodyRes(t) {
        var i, o, s;
        i = this.AllColors[t];
        o = window.sm.tbl.find(TblAPColor, i).data().textureBody;
        if (this.imageCache_body[t]) {
            return this.imageCache_body[t];
        }
        s = await window.sm.res.loadSpriteFrame("texture/" + t + "/" + o);
        return (this.imageCache_body[t] = s), s;
    }

    async getTailRes(t) {
        var i, o, s;
        i = this.AllColors[t];
        o = window.sm.tbl.find(TblAPColor, i).data().textureTail;
        if (this.imageCache_tail[t]) {
            return this.imageCache_tail[t];
        }
        s = await window.sm.res.loadSpriteFrame("texture/" + t + "/" + o);
        return (this.imageCache_tail[t] = s), s;
    }

    async getTailEndRes(t) {
        var i, o, s;
        i = this.AllColors[t];
        o = window.sm.tbl.find(TblAPColor, i).data().textureTailEnd;
        if (this.imageCache_tailEnd[t]) {
            return this.imageCache_tailEnd[t];
        }
        s = await window.sm.res.loadSpriteFrame("texture/" + t + "/" + o);
        return (this.imageCache_tailEnd[t] = s), s;
    }

    async getHeadRes(t) {
        var i, o, s;
        i = this.AllColors[t];
        o = window.sm.tbl.find(TblAPColor, i).data().textureHead;
        if (this.imageCache_head[t]) {
            return this.imageCache_head[t];
        }
        s = await window.sm.res.loadSpriteFrame("texture/" + t + "/" + o);
        return (this.imageCache_head[t] = s), s;
    }
}
