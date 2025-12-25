export default class Singleton {
    static _instance;
    static instance() {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }
}
