import { _decorator, Node, ScrollView, Layout, UITransform, instantiate, math, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { SdkGameConfig } from "../../start-scene/scripts/SdkConfig";
import { RankManager } from "../../start-scene/scripts/RankManager";
import APRankPanel, { RankShowConfig } from "./APRankPanel";
import { APRankUIItem } from "./APRankUIItem";

const { ccclass, property } = _decorator;

@ccclass("APRankSelectBtn")
export class APRankSelectBtn extends Component {
    @property(Node)
    rootNode = null;

    @property
    data_name: string = "";

    @property
    type: number = 0;

    cfgs = [];
    rankuiitemArr = [];
    isGenerate = false;
    contentY = 0;
    content: any;
    view: any;
    scrollView: any;
    selectNode: any;
    unselectNode: any;
    sapce: any;
    topPadding: any;
    itemHeight: any;
    canViewHeight: any;
    minHeight: number;
    moveHeight: number;
    retryCount: number = 0;

    init() {
        var e = this;
        (this.content = smtools.find(this.rootNode, "content")),
            (this.view = smtools.find(this.rootNode, "view")),
            (this.scrollView = this.rootNode.getComponent(ScrollView)),
            (this.cfgs = []),
            (this.rankuiitemArr = []),
            (this.retryCount = 0),
            (this.selectNode = smtools.find(this.node, "select")),
            (this.unselectNode = smtools.find(this.node, "unselect")),
            smtools.click(this.node, function () {
                window.sm.ui.panel(APRankPanel).changeScroll(e.type);
            });
    }
    refresh(e) {
        (this.selectNode.active = e == this.type),
            (this.unselectNode.active = e != this.type),
            (this.rootNode.active = false),
            e == this.type && (this.isGenerate ? this.refreshDataTrue() : ((this.retryCount = 0), this.createUI(), (this.isGenerate = true)));
    }
    createUI() {
        var t = this;
        console.log("createUI 开始，type:", this.type, "data_name:", this.data_name);
        
        if (!window.SmSdk.rankManager) {
            console.log("rankManager 未初始化，等待初始化...");
            var retryCount = this.retryCount || 0;
            this.retryCount = retryCount + 1;
            
            if (retryCount < 5) {
                var waitTime = 0.2 + retryCount * 0.1;
                setTimeout(function() {
                    t.createUI();
                }, waitTime * 1000);
            } else {
                console.error("rankManager 初始化超时，使用默认数据");
                t.refreshDataTrue();
            }
            return;
        }
        
        window.SmSdk.rankManager.rankdata(0 == this.type ? "rank_total" : "rank_day", 0, 99, function (e) {
            console.log("获取到排行榜数据:", e);
            
            // requestv3会将data部分传递给回调，所以e就是{ranklist: [...], self: {...}}
            // 处理各种可能的数据格式
            var n = [];
            if (e) {
                if (Array.isArray(e.ranklist)) {
                    n = e.ranklist;
                } else if (Array.isArray(e)) {
                    n = e;
                } else if (e.data && Array.isArray(e.data.ranklist)) {
                    n = e.data.ranklist;
                }
            }
            console.log("排行榜数据条数:", n.length);
            
            // 清空现有配置
            t.cfgs = [];
            
            // 处理排行榜列表数据
            for (var o = 0; o < n.length; o++) {
                var item = n[o];
                if (item) {
                    var r = new RankShowConfig();
                    r.rank = item.rank ? parseInt(item.rank) : (o + 1);
                    r.openid = item.openid || "";
                    r.playername = item.playername || "未知玩家";
                    r.portrait = item.portrait || "";
                    r.score = item.score ? parseInt(item.score) : 0;
                    if (r.openid && r.openid != window.SmSdk.savedOpenid) {
                        r.initSp(o);
                    }
                    t.cfgs.push(r);
                }
            }
            
            // 如果没有排行榜数据，添加一些默认数据以便测试
            if (t.cfgs.length === 0) {
                console.log("没有获取到排行榜数据，添加默认测试数据");
                for (var i = 0; i < 10; i++) {
                    var r = new RankShowConfig();
                    r.rank = i + 1;
                    var testId = "test_user_" + (i < 9 ? "00" : i < 99 ? "0" : "") + (i + 1);
                    r.openid = testId;
                    r.playername = "测试玩家" + (i + 1);
                    r.portrait = "";
                    r.score = 10000 - i * 100;
                    t.cfgs.push(r);
                }
            }
            
            console.log("处理后的排行榜数据条数:", t.cfgs.length);
            t.refreshDataTrue();
        });
    }
    refreshDataTrue() {
        console.log("refreshDataTrue 开始，当前数据条数:", this.cfgs.length);
        this.contentY = this.content.position.y - 1;
        
        // 更新或添加当前玩家数据
        var e = this.cfgs.find(function (e) {
            return e.openid == window.SmSdk.savedOpenid;
        });
        if (e) {
            e.openid = window.SmSdk.savedOpenid;
            e.playername = window.SmSdk.savedPlayerName || "玩家";
            e.portrait = window.SmSdk.savedPortrait || "";
            0 == this.type && (e.score = window.gm_ap.level.levelIdx);
            1 == this.type && (e.score = window.gm_ap.level.dayLevel);
            e.initSp(0);
        } else {
            var t = new RankShowConfig();
            t.openid = window.SmSdk.savedOpenid || "";
            t.playername = window.SmSdk.savedPlayerName || "玩家";
            t.portrait = window.SmSdk.savedPortrait || "";
            t.score = 0 == this.type ? window.gm_ap.level.levelIdx : window.gm_ap.level.dayLevel;
            t.initSp(0);
            this.cfgs.push(t);
        }
        
        // 按分数排序
        this.cfgs = this.cfgs.sort(function (e, t) {
            return t.score - e.score;
        });
        this.cfgs.length > 100 && this.cfgs.splice(100, this.cfgs.length - 100);
        
        // 更新排名
        for (var n = 0; n < this.cfgs.length; n++) {
            this.cfgs[n].rank = n + 1;
        }
        
        this.refreshSelf();
        
        // 计算内容高度和布局
        if (this.content.children.length === 0) {
            console.error("content 没有子节点，无法初始化UI");
            return;
        }
        
        var i = this.content.children[0];
        var o = this.content.getComponent(Layout);
        if (!o || !i) {
            console.error("无法获取Layout或子节点");
            return;
        }
        
        this.sapce = o.spacingY;
        this.topPadding = o.paddingTop;
        this.itemHeight = i.getComponent(UITransform).contentSize.height;
        
        var s = o.paddingTop + o.paddingBottom + this.cfgs.length * (this.sapce + this.itemHeight);
        o.enabled = false;
        this.content.getComponent(UITransform).height = s;
        
        // 计算每个条目的Y位置
        for (var r = 0; r < this.cfgs.length; r++) {
            this.cfgs[r].posY = -(o.paddingTop + this.itemHeight / 2 + (this.itemHeight + this.sapce) * r);
        }
        
        // 计算可见区域能显示多少个条目
        var a = Math.ceil(this.view.getComponent(UITransform).height / (this.sapce + this.itemHeight)) + 2;
        var l = Math.min(a, this.cfgs.length);
        
        // 初始化UI项数组
        if (this.rankuiitemArr.length === 0) {
            this.rankuiitemArr.push(i.getComponent(APRankUIItem));
        }
        
        // 创建足够的UI项
        for (var d = this.rankuiitemArr.length; d < l; d++) {
            var p = instantiate(i);
            p.parent = i.parent;
            this.rankuiitemArr.push(p.getComponent(APRankUIItem));
        }
        
        this.canViewHeight = this.view.getComponent(UITransform).height;
        this.minHeight = this.canViewHeight / 2;
        this.moveHeight = Math.max(0, s - this.canViewHeight);
        
        // 激活根节点
        this.rootNode.active = true;
        
        // 立即更新显示，确保初始状态正确显示
        this.scheduleOnce(function() {
            this.scrollViewUpdate();
        }, 0.1);
        
        console.log("refreshDataTrue 完成，UI项数量:", this.rankuiitemArr.length, "数据条数:", this.cfgs.length);
    }
    refreshSelf() {
        var e = this.cfgs.find(function (e) {
            return e.openid == window.SmSdk.savedOpenid;
        });
        if (e) {
            var t = this.rankuiitemArr.find(function (t) {
                return t.cfg == e;
            });
            t && t.init(e, this.type, false), window.sm.ui.panel(APRankPanel).refreshSelf(e.rank, this.type);
        } else window.sm.ui.panel(APRankPanel).refreshSelf(101, this.type);
    }
    scrollViewUpdate() {
        if (!this.cfgs || this.cfgs.length === 0) {
            console.log("scrollViewUpdate: 没有数据，跳过更新");
            return;
        }
        if (!this.rankuiitemArr || this.rankuiitemArr.length === 0) {
            console.log("scrollViewUpdate: 没有UI项，跳过更新");
            return;
        }
        if (this.moveHeight <= 0) {
            // 如果内容高度小于可见高度，直接显示所有数据
            for (var n = 0; n < this.rankuiitemArr.length && n < this.cfgs.length; n++) {
                var i = this.rankuiitemArr[n];
                if (i && this.cfgs[n]) {
                    i.init(this.cfgs[n], this.type);
                }
            }
            return;
        }
        var e =
            (((this.content.position.y - this.minHeight) / this.moveHeight) * this.moveHeight +
                this.canViewHeight / 2 -
                this.topPadding -
                this.itemHeight / 2 -
                this.canViewHeight / 2) /
            (this.itemHeight + this.sapce);
        e = Math.round(e);
        var t = math.clamp(e, 0, this.cfgs.length - 1);
        t > 0 && t--;
        for (var n = 0; n < this.rankuiitemArr.length; n++) {
            var i = this.rankuiitemArr[n];
            if (i && n + t < this.cfgs.length && this.cfgs[n + t]) {
                i.init(this.cfgs[n + t], this.type);
            }
        }
    }
    lateUpdate(e) {
        this.contentY != this.content.position.y && ((this.contentY = this.content.position.y), this.scrollViewUpdate());
    }
}
