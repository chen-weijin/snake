import { SdkStorage } from "./SdkStorage";

export class BaseGameManager {
    static _instance: BaseGameManager;

    data = {};

    static instance() {
        if (!this._instance) {
            this._instance = new this();
            this._instance.load && this._instance.load();
        }
        return this._instance;
    }

    get fullName() {
        return window.sm.project + "_" + this.name;
    }

    loadData() {
        try {
            var e = SdkStorage.getManagerData(this.fullName, "");
            if ("" != e) this.data = e;
            else {
                var t = SdkStorage.getSdk(this.fullName, "");
                "" != t && (this.data = JSON.parse(t));
            }
        } catch (e) {
            window.sm.log.debug("解析新的sdk存储数据失败", e), (this.data = {});
        }
    }
    set(e, t) {
        return !((this.data[e] && this.data[e] === t) || ((this.data[e] = t), 0));
    }
    get(e, t) {
        return void 0 !== this.data[e] ? this.data[e] : (this.loadData(), void 0 !== this.data[e] ? this.data[e] : t);
    }
    save(e?, t?) {
        if (!e || this.set(e, t))
            try {
                SdkStorage.saveManagerData(this.fullName, this.data);
            } catch (e) {
                window.sm.log.error(this.fullName, "数据保存报错", e);
            }
        else window.sm.log.debug(this.fullName, "@@@@@数据没有修改，不保存");
    }
    clear() {
        (this.data = {}), this.save();
    }
}
