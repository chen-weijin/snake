export default class TblUtils {
    static lineValue = {};

    constructor(t) {
        TblUtils.lineValue = t;
    }

    static getInt(t) {
        return parseInt(TblUtils.lineValue[t]);
    }

    static getIntArray(t) {
        return TblUtils.lineValue[t].split("|").map(function (e) {
            return parseInt(e);
        });
    }

    static getString(t) {
        return TblUtils.lineValue[t];
    }

    static getBool(t) {
        return TblUtils.lineValue[t].toLowerCase() === "true";
    }
}
