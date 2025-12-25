import { resources, js, assetManager } from "cc";
import { SdkGameConfig } from "./SdkConfig";
import { GroupTable, Table } from "./Table";
import TableData, { GroupTableData } from "./TableData";

export default class TableManager {
    static _instance: TableManager;
    static instance(): TableManager {
        if (!this._instance) {
            this._instance = new this();
        }
        return this._instance;
    }

    static DataLoadedEvent = "DataLoaded";

    tables = {};
    registry = {};
    registry_mini = {};
    registry_lazy = {};
    loadingLazy = {};
    curMiniName: any;
    miniLoadedAll: number;
    miniLoadedCount: number;

    loadData() {
        var e = Object.keys(this.registry);
        window.sm.log.debug("###开始加载配表, 总数:" + e.length), e.length <= 0 && window.sm.event.emit(TableManager.DataLoadedEvent, 1, 1);
        for (var t = 0; t < e.length; t++) this.loadTable(e[t]);
    }
    loadTable(e) {
        var t = this,
            o = this.registry[e],
            r = e.replace(/^Tbl/, "");
        resources.load("data/" + r, function (e, i) {
            if (e) window.sm.log.debug("读取错误", e);
            else {
                console.log(`%csmile---1111---> `, "color: red; font-size:16px");
                var r = o.prototype.proto_class().decode(new Uint8Array(i.buffer()));
                t.parseData(o, r);
                var a = Object.keys(t.tables).length,
                    s = Object.keys(t.registry).length;
                a >= s && t.initTables(), window.sm.event.emit(TableManager.DataLoadedEvent, a, s);
            }
        });
    }
    initTables() {
        for (var e in this.tables) this.tables[e].init();
    }
    parseData(e, t) {
        var n;
        if (js.isChildClassOf(e, GroupTableData)) n = new GroupTable();
        else {
            if (!js.isChildClassOf(e, TableData)) throw new Error("配表加载初始化, 无法创建" + js.getClassName(e) + "对应的Table类");
            n = new Table();
        }
        return n.load(e, t), (this.tables[js.getClassName(e)] = n), n;
    }
    regTable(e) {
        this.registry[js.getClassName(e)] = e;
    }
    getTable(e) {
        return this.tables[e];
    }
    regTable_mini(e, t) {
        this.getRegistryMini(t)[js.getClassName(e)] = e;
    }
    regTable_lazy(e, t) {
        this.registry_lazy[t] || (this.registry_lazy[t] = {}), (this.registry_lazy[t][js.getClassName(e)] = e);
    }
    getRegistryMini(e) {
        return this.registry_mini[e] || (this.registry_mini[e] = {}), this.registry_mini[e];
    }
    loadData_mini(e, t) {
        console.log("loadData_mini~~~~~~~~~", e);
        var n = Object.keys(this.getRegistryMini(e));
        window.sm.log.debug("###开始加载小游戏配表, 总数:" + n.length),
            n.length <= 0 && window.sm.event.emit(t, 1, 1),
            (this.curMiniName = e),
            (this.miniLoadedAll = n.length),
            (this.miniLoadedCount = 0);
        for (var i = 0; i < n.length; i++) this.loadRemoteTable_mini(n[i], t);
    }
    loadTable_mini(e, t) {
        var self = this;
        var i = this.getRegistryMini(this.curMiniName)[e];
        var o = e.replace(/^Tbl/, "");

        console.log(`smile---"data/" + o---> `, "data/" + o);

        let obj = {
            APConfigParams: {
                items: [
                    { params: [1001, 0, 1002, 5], id: 10001, name: "基础资源" },
                    { params: [5], id: 10002, name: "体力上限" },
                    { params: [1], id: 10003, name: "每次体力扣除" },
                    { params: [300, 1], id: 10004, name: "体力恢复（时间s+恢复值）" },
                    { params: [20], id: 10005, name: "体力存储上限" },
                    { params: [5], id: 10006, name: "每天可广告获取体力次数" },
                    { params: [2], id: 10007, name: "每次广告获取体力数" },
                    { params: [] },
                    { params: [] },
                    { params: [] },
                    { params: [] },
                    { params: [] },
                    { params: [] },
                ],
            },
            APLevel: {
                items: [
                    { id: 70001, name: "07-07_[8x10]_[6]_[Loopy, Country]", sortId: 1 },
                    { id: 70002, name: "06-30_[25x38]_[69]_[Spaghetti, Aztec]", sortId: 2 },
                    { id: 70003, name: "06-30_[31x44]_[121]_[Loopy, Snake]", sortId: 3 },
                    { id: 70004, name: "07-02_[20x21]_[47]_[Snake, Basic]", sortId: 4 },
                    { id: 70005, name: "06-30_[30x50]_[119]_[Spaghetti, Aztec]", sortId: 5 },
                    { id: 70006, name: "07-02_[20x22]_[36]_[Loopy]", sortId: 6 },
                    { id: 70007, name: "06-30_[25x38]_[101]_[Spaghetti, Aztec]", sortId: 7 },
                    { id: 70008, name: "06-30_[31x47]_[129]_[Loopy, Snake]", sortId: 8 },
                    { id: 70009, name: "06-30_[25x38]_[66]_[Aztec]", sortId: 9 },
                    { id: 70010, name: "06-30_[38x63]_[196]_[Loopy, Snake]", sortId: 10 },
                    { id: 70011, name: "07-02_[20x24]_[46]_[Snake, Aztec]", sortId: 11 },
                    { id: 70012, name: "07-02_[20x25]_[24]_[Aztec]", sortId: 12 },
                    { id: 70013, name: "06-30_[39x57]_[176]_[Spaghetti, Aztec]", sortId: 13 },
                    { id: 70014, name: "07-02_[27x37]_[128]_[Spaghetti, Spaghetti]", sortId: 14 },
                    { id: 70015, name: "06-30_[25x38]_[77]_[Spaghetti, Aztec]", sortId: 15 },
                    { id: 70016, name: "07-02_[25x40]_[120]_[Basic, Snake]", sortId: 16 },
                    { id: 70017, name: "06-30_[25x38]_[72]_[Spaghetti, Aztec]", sortId: 17 },
                    { id: 70018, name: "06-30_[37x48]_[184]_[Loopy, Snake]", sortId: 18 },
                    { id: 70019, name: "06-30_[25x38]_[73]_[Spaghetti, Aztec]", sortId: 19 },
                    { id: 70020, name: "06-30_[25x38]_[80]_[Spaghetti, Aztec]", sortId: 20 },
                    { id: 70021, name: "06-30_[41x53]_[158]_[Loopy, Snake]", sortId: 21 },
                    { id: 70022, name: "07-02_[20x27]_[47]_[Aztec, Basic]", sortId: 22 },
                    { id: 70023, name: "07-02_[27x41]_[132]_[Basic, Snake]", sortId: 23 },
                    { id: 70024, name: "06-30_[25x38]_[90]_[Spaghetti, Aztec]", sortId: 24 },
                    { id: 70025, name: "07-02_[27x43]_[115]_[Aztec, Basic]", sortId: 25 },
                    { id: 70026, name: "06-30_[25x38]_[88]_[Spaghetti, Aztec]", sortId: 26 },
                    { id: 70027, name: "07-02_[27x43]_[122]_[Loopy, Country]", sortId: 27 },
                    { id: 70028, name: "07-02_[20x26]_[39]_[Country]", sortId: 28 },
                    { id: 70029, name: "07-02_[28x46]_[134]_[Snake, Basic]", sortId: 29 },
                    { id: 70030, name: "07-02_[28x46]_[122]_[Aztec, Basic]", sortId: 30 },
                    { id: 70031, name: "06-30_[27x28]_[70]_[Spaghetti, Aztec]", sortId: 31 },
                    { id: 70032, name: "06-30_[27x28]_[58]_[Loopy, Snake]", sortId: 32 },
                    { id: 70033, name: "07-02_[20x28]_[49]_[Aztec]", sortId: 33 },
                    { id: 70034, name: "06-30_[27x28]_[57]_[Loopy, Snake]", sortId: 34 },
                    { id: 70035, name: "07-02_[20x27]_[53]_[Basic, Aztec, Aztec]", sortId: 35 },
                    { id: 70036, name: "07-02_[28x45]_[136]_[Spaghetti, Aztec]", sortId: 36 },
                    { id: 70037, name: "06-30_[42x45]_[167]_[Loopy, Snake]", sortId: 37 },
                    { id: 70038, name: "07-02_[20x31]_[42]_[Basic]", sortId: 38 },
                    { id: 70039, name: "07-02_[29x37]_[111]_[Basic, Snake]", sortId: 39 },
                    { id: 70040, name: "07-02_[29x44]_[125]_[Loopy, Country]", sortId: 40 },
                    { id: 70041, name: "07-02_[29x46]_[146]_[Aztec, Basic]", sortId: 41 },
                    { id: 70042, name: "07-02_[20x31]_[47]_[Spaghetti, Aztec]", sortId: 42 },
                    { id: 70043, name: "06-30_[30x34]_[82]_[Spaghetti, Aztec]", sortId: 43 },
                    { id: 70044, name: "07-02_[32x42]_[182]_[Basic, Aztec]", sortId: 44 },
                    { id: 70045, name: "07-02_[20x31]_[68]_[Basic, Snake]", sortId: 45 },
                    { id: 70046, name: "07-02_[20x31]_[66]_[Basic, Snake]", sortId: 46 },
                    { id: 70047, name: "07-02_[20x32]_[52]_[Aztec, Spaghetti]", sortId: 47 },
                    { id: 70048, name: "07-02_[21x24]_[39]_[Aztec]", sortId: 48 },
                    { id: 70049, name: "07-02_[30x41]_[112]_[Snake, Basic]", sortId: 49 },
                    { id: 70050, name: "07-02_[20x32]_[60]_[Basic, Snake]", sortId: 50 },
                    { id: 70051, name: "07-02_[20x32]_[61]_[Basic, Aztec, Aztec]", sortId: 51 },
                    { id: 70052, name: "07-02_[20x32]_[63]_[Basic, Snake]", sortId: 52 },
                    { id: 70053, name: "07-02_[32x47]_[166]_[Basic, Snake]", sortId: 53 },
                    { id: 70054, name: "07-02_[29x48]_[129]_[Aztec, Basic]", sortId: 54 },
                    { id: 70055, name: "07-02_[30x35]_[126]_[Basic, Aztec]", sortId: 55 },
                    { id: 70056, name: "07-02_[22x23]_[52]_[Aztec, Spaghetti]", sortId: 56 },
                    { id: 70057, name: "07-02_[30x41]_[126]_[Snake, Basic]", sortId: 57 },
                    { id: 70058, name: "07-02_[32x47]_[187]_[Basic, Snake]", sortId: 58 },
                    { id: 70059, name: "07-02_[20x32]_[75]_[Basic, Snake]", sortId: 59 },
                    { id: 70060, name: "07-02_[20x32]_[71]_[Basic, Snake]", sortId: 60 },
                    { id: 70061, name: "07-02_[22x26]_[49]_[Aztec, Basic]", sortId: 61 },
                    { id: 70062, name: "07-02_[20x32]_[69]_[Basic, Snake]", sortId: 62 },
                    { id: 70063, name: "07-02_[30x41]_[113]_[Snake, Basic]", sortId: 63 },
                    { id: 70064, name: "07-02_[30x41]_[133]_[Basic, Snake]", sortId: 64 },
                    { id: 70065, name: "07-02_[30x41]_[148]_[Snake, Basic]", sortId: 65 },
                    { id: 70066, name: "07-02_[30x41]_[143]_[Snake, Basic]", sortId: 66 },
                    { id: 70067, name: "07-02_[22x26]_[64]_[Aztec, Spaghetti]", sortId: 67 },
                    { id: 70068, name: "07-02_[22x29]_[55]_[Aztec, Basic]", sortId: 68 },
                    { id: 70069, name: "07-02_[30x41]_[136]_[Basic, Snake]", sortId: 69 },
                    { id: 70070, name: "07-02_[20x32]_[84]_[Basic, Snake]", sortId: 70 },
                    { id: 70071, name: "07-02_[21x29]_[71]_[Aztec, Spaghetti]", sortId: 71 },
                    { id: 70072, name: "07-02_[32x49]_[186]_[Basic, Snake]", sortId: 72 },
                    { id: 70073, name: "07-02_[20x33]_[80]_[Basic, Aztec, Basic]", sortId: 73 },
                    { id: 70074, name: "07-02_[23x23]_[48]_[Country, Loopy]", sortId: 74 },
                    { id: 70075, name: "07-02_[30x42]_[109]_[Basic, Snake]", sortId: 75 },
                    { id: 70076, name: "07-02_[21x34]_[66]_[Loopy]", sortId: 76 },
                    { id: 70077, name: "07-02_[30x47]_[117]_[Loopy]", sortId: 77 },
                    { id: 70078, name: "07-02_[21x34]_[65]_[Loopy]", sortId: 78 },
                    { id: 70079, name: "07-02_[30x49]_[157]_[Aztec, Spaghetti]", sortId: 79 },
                    { id: 70080, name: "07-02_[33x50]_[187]_[Basic, Snake]", sortId: 80 },
                    { id: 70081, name: "07-02_[23x23]_[55]_[Country, Loopy]", sortId: 81 },
                    { id: 70082, name: "07-02_[21x30]_[79]_[Basic, Basic]", sortId: 82 },
                    { id: 70083, name: "07-02_[31x31]_[130]_[Basic, Snake]", sortId: 83 },
                    { id: 70084, name: "07-02_[21x34]_[72]_[Loopy]", sortId: 84 },
                    { id: 70085, name: "07-02_[21x34]_[67]_[Loopy]", sortId: 85 },
                    { id: 70086, name: "07-02_[23x29]_[39]_[Loopy]", sortId: 86 },
                    { id: 70087, name: "07-02_[31x31]_[126]_[Basic, Snake]", sortId: 87 },
                    { id: 70088, name: "07-02_[22x23]_[53]_[Snake, Spaghetti]", sortId: 88 },
                    { id: 70089, name: "07-02_[23x23]_[60]_[Country, Loopy]", sortId: 89 },
                    { id: 70090, name: "07-02_[30x50]_[110]_[Snake, Aztec]", sortId: 90 },
                    { id: 70091, name: "07-02_[33x53]_[182]_[Spaghetti, Spaghetti]", sortId: 91 },
                    { id: 70092, name: "07-02_[31x40]_[132]_[Aztec, Spaghetti]", sortId: 92 },
                    { id: 70093, name: "07-02_[34x52]_[188]_[Basic]", sortId: 93 },
                    { id: 70094, name: "07-02_[22x26]_[70]_[Basic, Snake]", sortId: 94 },
                    { id: 70095, name: "07-02_[22x27]_[66]_[Basic]", sortId: 95 },
                    { id: 70096, name: "07-02_[31x31]_[139]_[Basic, Snake]", sortId: 96 },
                    { id: 70097, name: "07-02_[31x39]_[151]_[Basic, Aztec]", sortId: 97 },
                    { id: 70098, name: "07-02_[23x29]_[43]_[Loopy]", sortId: 98 },
                    { id: 70099, name: "07-02_[22x27]_[72]_[Aztec, Basic]", sortId: 99 },
                    { id: 70100, name: "07-02_[23x29]_[54]_[Basic, Aztec]", sortId: 100 },
                ],
            },
            APShiWan: {
                items: [
                    {
                        id: 70001,
                        name: "07-07_[8x10]_[6]_[Loopy, Country]",
                        sortId: 1,
                        skinId: 1,
                        shiwanId: 1,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70002,
                        name: "06-30_[25x38]_[69]_[Spaghetti, Aztec]",
                        sortId: 2,
                        skinId: 1,
                        shiwanId: 1,
                        limitHeart: true,
                        isDarkMode: false,
                    },
                    {
                        id: 70003,
                        name: "06-30_[31x44]_[121]_[Loopy, Snake]",
                        sortId: 3,
                        skinId: 0,
                        shiwanId: 1,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70004,
                        name: "07-02_[20x21]_[47]_[Snake, Basic]",
                        sortId: 4,
                        skinId: 1,
                        shiwanId: 1,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70005,
                        name: "06-30_[30x50]_[119]_[Spaghetti, Aztec]",
                        sortId: 5,
                        skinId: 2,
                        shiwanId: 1,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70006,
                        name: "07-02_[20x22]_[36]_[Loopy]",
                        sortId: 6,
                        skinId: 1,
                        shiwanId: 1,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70007,
                        name: "06-30_[25x38]_[101]_[Spaghetti, Aztec]",
                        sortId: 7,
                        skinId: 0,
                        shiwanId: 2,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70008,
                        name: "06-30_[31x47]_[129]_[Loopy, Snake]",
                        sortId: 8,
                        skinId: 1,
                        shiwanId: 2,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70009,
                        name: "06-30_[25x38]_[66]_[Aztec]",
                        sortId: 9,
                        skinId: 1,
                        shiwanId: 2,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70010,
                        name: "06-30_[38x63]_[196]_[Loopy, Snake]",
                        sortId: 10,
                        skinId: 1,
                        shiwanId: 2,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70011,
                        name: "07-02_[20x24]_[46]_[Snake, Aztec]",
                        sortId: 11,
                        skinId: 1,
                        shiwanId: 2,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70012,
                        name: "07-02_[20x25]_[24]_[Aztec]",
                        sortId: 12,
                        skinId: 1,
                        shiwanId: 2,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70013,
                        name: "06-30_[39x57]_[176]_[Spaghetti, Aztec]",
                        sortId: 13,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70014,
                        name: "07-02_[27x37]_[128]_[Spaghetti, Spaghetti]",
                        sortId: 14,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70015,
                        name: "06-30_[25x38]_[77]_[Spaghetti, Aztec]",
                        sortId: 15,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70016,
                        name: "07-02_[25x40]_[120]_[Basic, Snake]",
                        sortId: 16,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70017,
                        name: "06-30_[25x38]_[72]_[Spaghetti, Aztec]",
                        sortId: 17,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70018,
                        name: "06-30_[37x48]_[184]_[Loopy, Snake]",
                        sortId: 18,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70019,
                        name: "06-30_[25x38]_[73]_[Spaghetti, Aztec]",
                        sortId: 19,
                        skinId: 1,
                        shiwanId: 3,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70020,
                        name: "06-30_[25x38]_[80]_[Spaghetti, Aztec]",
                        sortId: 20,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70021,
                        name: "06-30_[41x53]_[158]_[Loopy, Snake]",
                        sortId: 21,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70022,
                        name: "07-02_[20x27]_[47]_[Aztec, Basic]",
                        sortId: 22,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70023,
                        name: "07-02_[27x41]_[132]_[Basic, Snake]",
                        sortId: 23,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70024,
                        name: "06-30_[25x38]_[90]_[Spaghetti, Aztec]",
                        sortId: 24,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70025,
                        name: "07-02_[27x43]_[115]_[Aztec, Basic]",
                        sortId: 25,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70026,
                        name: "06-30_[25x38]_[88]_[Spaghetti, Aztec]",
                        sortId: 26,
                        skinId: 1,
                        shiwanId: 4,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70027,
                        name: "07-02_[27x43]_[122]_[Loopy, Country]",
                        sortId: 27,
                        skinId: 0,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70028,
                        name: "07-02_[20x26]_[39]_[Country]",
                        sortId: 28,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70029,
                        name: "07-02_[28x46]_[134]_[Snake, Basic]",
                        sortId: 29,
                        skinId: 2,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70030,
                        name: "07-02_[28x46]_[122]_[Aztec, Basic]",
                        sortId: 30,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70031,
                        name: "06-30_[27x28]_[70]_[Spaghetti, Aztec]",
                        sortId: 31,
                        skinId: 0,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70032,
                        name: "06-30_[27x28]_[58]_[Loopy, Snake]",
                        sortId: 32,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70033,
                        name: "07-02_[20x28]_[49]_[Aztec]",
                        sortId: 33,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70034,
                        name: "06-30_[27x28]_[57]_[Loopy, Snake]",
                        sortId: 34,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70035,
                        name: "07-02_[20x27]_[53]_[Basic, Aztec, Aztec]",
                        sortId: 35,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70036,
                        name: "07-02_[28x45]_[136]_[Spaghetti, Aztec]",
                        sortId: 36,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70037,
                        name: "06-30_[42x45]_[167]_[Loopy, Snake]",
                        sortId: 37,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70038,
                        name: "07-02_[20x31]_[42]_[Basic]",
                        sortId: 38,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70039,
                        name: "07-02_[29x37]_[111]_[Basic, Snake]",
                        sortId: 39,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70040,
                        name: "07-02_[29x44]_[125]_[Loopy, Country]",
                        sortId: 40,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70041,
                        name: "07-02_[29x46]_[146]_[Aztec, Basic]",
                        sortId: 41,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70042,
                        name: "07-02_[20x31]_[47]_[Spaghetti, Aztec]",
                        sortId: 42,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70043,
                        name: "06-30_[30x34]_[82]_[Spaghetti, Aztec]",
                        sortId: 43,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70044,
                        name: "07-02_[32x42]_[182]_[Basic, Aztec]",
                        sortId: 44,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: false,
                        isDarkMode: false,
                    },
                    {
                        id: 70045,
                        name: "07-02_[20x31]_[68]_[Basic, Snake]",
                        sortId: 45,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70046,
                        name: "07-02_[20x31]_[66]_[Basic, Snake]",
                        sortId: 46,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    {
                        id: 70047,
                        name: "07-02_[20x32]_[52]_[Aztec, Spaghetti]",
                        sortId: 47,
                        skinId: 1,
                        shiwanId: 5,
                        limitHeart: true,
                        isDarkMode: true,
                    },
                    { id: 70048, name: "07-02_[21x24]_[39]_[Aztec]", sortId: 48, skinId: 0, shiwanId: 5 },
                    { id: 70049, name: "07-02_[30x41]_[112]_[Snake, Basic]", sortId: 49, skinId: 1, shiwanId: 5 },
                    { id: 70050, name: "07-02_[20x32]_[60]_[Basic, Snake]", sortId: 50, skinId: 2, shiwanId: 5 },
                    { id: 70051, name: "07-02_[20x32]_[61]_[Basic, Aztec, Aztec]", sortId: 51, skinId: 1, shiwanId: 5 },
                    { id: 70052, name: "07-02_[20x32]_[63]_[Basic, Snake]", sortId: 52, skinId: 0, shiwanId: 5 },
                    { id: 70053, name: "07-02_[32x47]_[166]_[Basic, Snake]", sortId: 53, skinId: 1, shiwanId: 5 },
                    { id: 70054, name: "07-02_[29x48]_[129]_[Aztec, Basic]", sortId: 54, skinId: 1, shiwanId: 5 },
                    { id: 70055, name: "07-02_[30x35]_[126]_[Basic, Aztec]", sortId: 55, skinId: 1, shiwanId: 5 },
                    { id: 70056, name: "07-02_[22x23]_[52]_[Aztec, Spaghetti]", sortId: 56, skinId: 1, shiwanId: 5 },
                    { id: 70057, name: "07-02_[30x41]_[126]_[Snake, Basic]", sortId: 57, skinId: 1, shiwanId: 5 },
                    { id: 70058, name: "07-02_[32x47]_[187]_[Basic, Snake]", sortId: 58, skinId: 1, shiwanId: 5 },
                    { id: 70059, name: "07-02_[20x32]_[75]_[Basic, Snake]", sortId: 59, skinId: 1, shiwanId: 5 },
                    { id: 70060, name: "07-02_[20x32]_[71]_[Basic, Snake]", sortId: 60, skinId: 1, shiwanId: 5 },
                    { id: 70061, name: "07-02_[22x26]_[49]_[Aztec, Basic]", sortId: 61, skinId: 1, shiwanId: 5 },
                    { id: 70062, name: "07-02_[20x32]_[69]_[Basic, Snake]", sortId: 62, skinId: 1, shiwanId: 5 },
                    { id: 70063, name: "07-02_[30x41]_[113]_[Snake, Basic]", sortId: 63, skinId: 1, shiwanId: 5 },
                    { id: 70064, name: "07-02_[30x41]_[133]_[Basic, Snake]", sortId: 64, skinId: 1, shiwanId: 5 },
                    { id: 70065, name: "07-02_[30x41]_[148]_[Snake, Basic]", sortId: 65, skinId: 1, shiwanId: 5 },
                    { id: 70066, name: "07-02_[30x41]_[143]_[Snake, Basic]", sortId: 66, skinId: 1, shiwanId: 5 },
                    { id: 70067, name: "07-02_[22x26]_[64]_[Aztec, Spaghetti]", sortId: 67, shiwanId: 5 },
                    { id: 70068, name: "07-02_[22x29]_[55]_[Aztec, Basic]", sortId: 68, shiwanId: 5 },
                    { id: 70069, name: "07-02_[30x41]_[136]_[Basic, Snake]", sortId: 69, shiwanId: 5 },
                    { id: 70070, name: "07-02_[20x32]_[84]_[Basic, Snake]", sortId: 70, shiwanId: 5 },
                    { id: 70071, name: "07-02_[21x29]_[71]_[Aztec, Spaghetti]", sortId: 71, shiwanId: 5 },
                    { id: 70072, name: "07-02_[32x49]_[186]_[Basic, Snake]", sortId: 72, shiwanId: 5 },
                    { id: 70073, name: "07-02_[20x33]_[80]_[Basic, Aztec, Basic]", sortId: 73, shiwanId: 5 },
                    { id: 70074, name: "07-02_[23x23]_[48]_[Country, Loopy]", sortId: 74, shiwanId: 5 },
                    { id: 70075, name: "07-02_[30x42]_[109]_[Basic, Snake]", sortId: 75, shiwanId: 5 },
                    { id: 70076, name: "07-02_[21x34]_[66]_[Loopy]", sortId: 76, shiwanId: 5 },
                    { id: 70077, name: "07-02_[30x47]_[117]_[Loopy]", sortId: 77, shiwanId: 5 },
                    { id: 70078, name: "07-02_[21x34]_[65]_[Loopy]", sortId: 78, shiwanId: 5 },
                    { id: 70079, name: "07-02_[30x49]_[157]_[Aztec, Spaghetti]", sortId: 79, shiwanId: 5 },
                    { id: 70080, name: "07-02_[33x50]_[187]_[Basic, Snake]", sortId: 80, shiwanId: 5 },
                    { id: 70081, name: "07-02_[23x23]_[55]_[Country, Loopy]", sortId: 81, shiwanId: 5 },
                    { id: 70082, name: "07-02_[21x30]_[79]_[Basic, Basic]", sortId: 82, shiwanId: 5 },
                    { id: 70083, name: "07-02_[31x31]_[130]_[Basic, Snake]", sortId: 83, shiwanId: 5 },
                    { id: 70084, name: "07-02_[21x34]_[72]_[Loopy]", sortId: 84, shiwanId: 5 },
                    { id: 70085, name: "07-02_[21x34]_[67]_[Loopy]", sortId: 85, shiwanId: 5 },
                    { id: 70086, name: "07-02_[23x29]_[39]_[Loopy]", sortId: 86, shiwanId: 5 },
                    { id: 70087, name: "07-02_[31x31]_[126]_[Basic, Snake]", sortId: 87, shiwanId: 5 },
                    { id: 70088, name: "07-02_[22x23]_[53]_[Snake, Spaghetti]", sortId: 88, shiwanId: 5 },
                    { id: 70089, name: "07-02_[23x23]_[60]_[Country, Loopy]", sortId: 89, shiwanId: 5 },
                    { id: 70090, name: "07-02_[30x50]_[110]_[Snake, Aztec]", sortId: 90, shiwanId: 5 },
                    { id: 70091, name: "07-02_[33x53]_[182]_[Spaghetti, Spaghetti]", sortId: 91, shiwanId: 5 },
                    { id: 70092, name: "07-02_[31x40]_[132]_[Aztec, Spaghetti]", sortId: 92, shiwanId: 5 },
                    { id: 70093, name: "07-02_[34x52]_[188]_[Basic]", sortId: 93, shiwanId: 5 },
                    { id: 70094, name: "07-02_[22x26]_[70]_[Basic, Snake]", sortId: 94, shiwanId: 5 },
                    { id: 70095, name: "07-02_[22x27]_[66]_[Basic]", sortId: 95, shiwanId: 5 },
                    { id: 70096, name: "07-02_[31x31]_[139]_[Basic, Snake]", sortId: 96, shiwanId: 5 },
                    { id: 70097, name: "07-02_[31x39]_[151]_[Basic, Aztec]", sortId: 97, shiwanId: 5 },
                    { id: 70098, name: "07-02_[23x29]_[43]_[Loopy]", sortId: 98, shiwanId: 5 },
                    { id: 70099, name: "07-02_[22x27]_[72]_[Aztec, Basic]", sortId: 99, shiwanId: 5 },
                    { id: 70100, name: "07-02_[23x29]_[54]_[Basic, Aztec]", sortId: 100, shiwanId: 5 },
                ],
            },
            APColor: {
                items: [
                    {
                        id: 30001,
                        name: "cyan blue",
                        textureBody: "CYAN BLUE BODY TEXTURE",
                        textureHead: "CYAN BLUE HEAD TEXTURE",
                        textureTail: "CYAN BLUE TAIL TEXTURE",
                        textureTailEnd: "CYAN BLUE TAIL END TEXTURE",
                    },
                    {
                        id: 30002,
                        name: "black gray",
                        textureBody: "BLACK GREY BODY TEXTURE",
                        textureHead: "BLACK GREY HEAD TEXTURE",
                        textureTail: "BLACK GREY TAIL TEXTURE",
                        textureTailEnd: "BLACK GREY TAIL END TEXTURE",
                    },
                    {
                        id: 30003,
                        name: "blue",
                        textureBody: "BLUE BODY TEXTURE",
                        textureHead: "BLUE HEAD TEXTURE",
                        textureTail: "BLUE TAIL TEXTURE",
                        textureTailEnd: "BLUE TAIL END TEXTURE",
                    },
                    {
                        id: 30004,
                        name: "dark green",
                        textureBody: "DARK GREEN BODY TEXTURE",
                        textureHead: "DARK GREEN HEAD TEXTURE",
                        textureTail: "DARK GREEN TAIL TEXTURE",
                        textureTailEnd: "DARK GREEN TAIL END TEXTURE",
                    },
                    {
                        id: 30005,
                        name: "fuchsia",
                        textureBody: "FUCHSIA BODY TEXTURE",
                        textureHead: "FUCHSIA HEAD TEXTURE",
                        textureTail: "FUCHSIA TAIL TEXTURE",
                        textureTailEnd: "FUCHSIA TAIL END TEXTURE",
                    },
                    {
                        id: 30006,
                        name: "gray",
                        textureBody: "GRAY BODY TEXTURE",
                        textureHead: "GRAY HEAD TEXTURE",
                        textureTail: "GRAY TAIL TEXTURE",
                        textureTailEnd: "GRAY TAIL END TEXTURE",
                    },
                    {
                        id: 30007,
                        name: "green",
                        textureBody: "GREEN BODY TEXTURE",
                        textureHead: "GREEN HEAD TEXTURE",
                        textureTail: "GREEN TAIL TEXTURE",
                        textureTailEnd: "GREEN TAIL END TEXTURE",
                    },
                    {
                        id: 30008,
                        name: "light gray",
                        textureBody: "LIGHT GREY BODY TEXTURE",
                        textureHead: "LIGHT GREY HEAD TEXTURE",
                        textureTail: "LIGHT GREY TAIL TEXTURE",
                        textureTailEnd: "LIGHT GREY TAIL END TEXTURE",
                    },
                    {
                        id: 30009,
                        name: "light green",
                        textureBody: "LIGHT GREEN BODY TEXTURE",
                        textureHead: "LIGHT GREEN HEAD TEXTURE",
                        textureTail: "LIGHT GREEN TAIL TEXTURE",
                        textureTailEnd: "LIGHT GREEN TAIL END TEXTURE",
                    },
                    {
                        id: 30010,
                        name: "mint green",
                        textureBody: "MINT GREEN BODY TEXTURE",
                        textureHead: "MINT GREEN HEAD TEXTURE",
                        textureTail: "MINT GREEN TAIL TEXTURE",
                        textureTailEnd: "MINT GREEN TAIL END TEXTURE",
                    },
                    {
                        id: 30011,
                        name: "orange",
                        textureBody: "ORANGE BODY TEXTURE",
                        textureHead: "ORANGE HEAD TEXTURE",
                        textureTail: "ORANGE TAIL TEXTURE",
                        textureTailEnd: "ORANGE TAIL END TEXTURE",
                    },
                    {
                        id: 30012,
                        name: "pink",
                        textureBody: "PINK BODY TEXTURE",
                        textureHead: "PINK HEAD TEXTURE",
                        textureTail: "PINK TAIL TEXTURE",
                        textureTailEnd: "PINK TAIL END TEXTURE",
                    },
                    {
                        id: 30013,
                        name: "purple",
                        textureBody: "PURPLE BODY TEXTURE",
                        textureHead: "PURPLE HEAD TEXTURE",
                        textureTail: "PURPLE TAIL TEXTURE",
                        textureTailEnd: "PURPLE TAIL END TEXTURE",
                    },
                    {
                        id: 30014,
                        name: "red",
                        textureBody: "RED BODY TEXTURE",
                        textureHead: "RED HEAD TEXTURE",
                        textureTail: "RED TAIL TEXTURE",
                        textureTailEnd: "RED TAIL END TEXTURE",
                    },
                    {
                        id: 30015,
                        name: "rust",
                        textureBody: "RUST BODY TEXTURE",
                        textureHead: "RUST HEAD TEXTURE",
                        textureTail: "RUST TAIL TEXTURE",
                        textureTailEnd: "RUST TAIL END TEXTURE",
                    },
                    {
                        id: 30016,
                        name: "turquoise",
                        textureBody: "TURQUOISE BODY TEXTURE",
                        textureHead: "TURQUOISE HEAD TEXTURE",
                        textureTail: "TURQUOISE TAIL TEXTURE",
                        textureTailEnd: "TURQUOISE TAIL END TEXTURE",
                    },
                    {
                        id: 30017,
                        name: "vivid orange",
                        textureBody: "VIVID ORANGE BODY TEXTURE",
                        textureHead: "VIVID ORANGE HEAD TEXTURE",
                        textureTail: "VIVID ORANGE TAIL TEXTURE",
                        textureTailEnd: "VIVID ORANGE TAIL END TEXTURE",
                    },
                    {
                        id: 30018,
                        name: "yellow",
                        textureBody: "YELLOW BODY TEXTURE",
                        textureHead: "YELLOW HEAD TEXTURE",
                        textureTail: "YELLOW TAIL TEXTURE",
                        textureTailEnd: "YELLOW TAIL END TEXTURE",
                    },
                ],
            },
        };

        window.sm.res.findBundle("data/" + o).load("data/" + o, function (e, res) {
            if (e) {
                window.sm.log.debug("读取错误", e);
            } else {
                console.log(`%csmile---2222---> `, "color: red; font-size:16px");

                console.log(`smile---i.prototype---> `, i.prototype);

                // var r = i.prototype.proto_class().decode(new Uint8Array(res.buffer()));

                var r = obj[o];

                self.parseData(i, r);

                self.miniLoadedCount++;

                if (self.miniLoadedCount >= self.miniLoadedAll) {
                    for (var a in self.registry_mini[self.curMiniName]) self.tables[a].init();
                    window.sm.event.emit(t, self.miniLoadedCount, self.miniLoadedAll);
                }
            }
        });
    }
    loadRemoteTable_mini(e, t) {
        var n = this,
            i = this.getRegistryMini(this.curMiniName)[e],
            o = e.replace(/^Tbl/, ""),
            s = "",
            l = false;
        if (SdkGameConfig.isLoadRemoteLevelTable && "APLevel" == o)
            switch (((l = true), SdkGameConfig.remoteLevelChose)) {
                case 1:
                    s = SdkGameConfig.remoteLevelTableUrl1;
                    break;
                case 2:
                    s = SdkGameConfig.remoteLevelTableUrl2;
                    break;
                case 3:
                    s = SdkGameConfig.remoteLevelTableUrl3;
                    break;
                case 4:
                    s = SdkGameConfig.remoteLevelTableUrl4;
                    break;
                default:
                    s = SdkGameConfig.remoteLevelTableUrl1;
            }
        l
            ? assetManager.loadRemote(
                  s,
                  {
                      ext: ".bin",
                  },
                  function (r, a) {
                      if (r) return n.loadTable_mini(e, t), void window.sm.log.debug("读取错误", r);
                      try {
                          console.log(`%csmile---3333---> `, "color: red; font-size:16px");

                          var s = i.prototype.proto_class().decode(new Uint8Array(a.buffer()));
                          if ((n.parseData(i, s), n.miniLoadedCount++, n.miniLoadedCount >= n.miniLoadedAll)) {
                              for (var l in n.registry_mini[n.curMiniName]) n.tables[l].init();
                              window.sm.event.emit(t, n.miniLoadedCount, n.miniLoadedAll);
                          }
                      } catch (i) {
                          window.sm.log.debug("解析表格数据时出错: " + o, i, "改为读取本地"), n.loadTable_mini(e, t);
                      }
                  }
              )
            : this.loadTable_mini(e, t);
    }
    loadTable_lazy(e, t) {
        var n = this;
        if (this.tables[t])
            return (
                console.log("已解析防止重复解析"),
                Promise.resolve({
                    alreadyLoaded: true,
                })
            );
        if ((this.loadingLazy[e] || (this.loadingLazy[e] = {}), this.loadingLazy[e][t])) return this.loadingLazy[e][t];
        var i = this.registry_lazy[e];
        if (!i || !i[t]) return window.sm.log.debug("按需加载失败：未找到表格 " + t + "，miniName: " + e), Promise.resolve();
        var o = i[t],
            r = t.replace(/^Tbl/, ""),
            a = new Promise<void>(function (i, a) {
                window.sm.res.findBundle("data/" + r).load("data/" + r, function (r, s) {
                    if (r) return window.sm.log.debug("按需加载表格 " + t + " 失败", r), delete n.loadingLazy[e][t], void a(r);
                    try {
                        console.log(`%csmile---4444---> `, "color: red; font-size:16px");

                        var l = o.prototype.proto_class().decode(new Uint8Array(s.buffer()));
                        n.parseData(o, l), n.tables[t].init(), window.sm.log.debug("按需加载表格 " + t + " 成功"), i();
                    } catch (e) {
                        window.sm.log.debug("解析表格数据时出错: " + t, e), a(e);
                    } finally {
                        delete n.loadingLazy[e][t];
                    }
                });
            });
        return (this.loadingLazy[e][t] = a), a;
    }
}
