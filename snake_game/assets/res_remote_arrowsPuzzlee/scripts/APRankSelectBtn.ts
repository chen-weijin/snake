import { _decorator, Node, ScrollView, Layout, UITransform, instantiate, math, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
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

    init() {
        var e = this;
        (this.content = smtools.find(this.rootNode, "content")),
            (this.view = smtools.find(this.rootNode, "view")),
            (this.scrollView = this.rootNode.getComponent(ScrollView)),
            (this.cfgs = []),
            (this.rankuiitemArr = []),
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
            e == this.type && (this.isGenerate ? this.refreshDataTrue() : (this.createUI(), (this.isGenerate = true)));
    }
    createUI() {
        var e,
            t = this;
        console.log("createUI"),
            null == (e = window.SmSdk.rankManager) ||
                e.rankdata("rank_" + this.data_name, 1, 100, function (e) {
                    for (
                        var n = e.rank_data,
                            i = function () {
                                var e = n[o],
                                    i = e.openid,
                                    s = t.cfgs.find(function (e) {
                                        return e.openid == i;
                                    });
                                if (s)
                                    (s.rank = parseInt(e.rank)),
                                        (s.openid = e.openid),
                                        (s.playername = e.playername),
                                        s.portrait != e.portrait &&
                                            s.openid != window.SmSdk.savedOpenid &&
                                            ((s.portrait = e.portrait), s.initSp(o)),
                                        (s.score = parseInt(e.score));
                                else {
                                    var r = new RankShowConfig();
                                    console.log("新排行数据"),
                                        (r.rank = parseInt(e.rank)),
                                        (r.openid = e.openid),
                                        (r.playername = e.playername),
                                        (r.portrait = e.portrait),
                                        r.openid != window.SmSdk.savedOpenid && r.initSp(o),
                                        (r.score = parseInt(e.score)),
                                        t.cfgs.push(r);
                                }
                            },
                            o = 0;
                        o < n.length;
                        o++
                    )
                        i();
                    t.refreshDataTrue();
                });
    }
    refreshDataTrue() {
        this.contentY = this.content.position.y - 1;
        var e = this.cfgs.find(function (e) {
            return e.openid == window.SmSdk.savedOpenid;
        });
        if (e)
            (e.openid = window.SmSdk.savedOpenid),
                (e.playername = window.SmSdk.savedPlayerName),
                (e.portrait = window.SmSdk.savedPortrait),
                0 == this.type && (e.score = window.gm_ap.level.levelIdx),
                1 == this.type && (e.score = window.gm_ap.level.dayLevel),
                e.initSp(0);
        else {
            var t = new RankShowConfig();
            (t.openid = window.SmSdk.savedOpenid),
                (t.playername = window.SmSdk.savedPlayerName),
                (t.portrait = window.SmSdk.savedPortrait),
                (t.score = window.gm_ap.level.levelIdx),
                t.initSp(0),
                this.cfgs.push(t);
        }
        (this.cfgs = this.cfgs.sort(function (e, t) {
            return t.score - e.score;
        })),
            this.cfgs.length > 100 && this.cfgs.splice(100, this.cfgs.length - 100);
        for (var n = 0; n < this.cfgs.length; n++) this.cfgs[n].rank = n + 1;
        this.refreshSelf();
        var i = this.content.children[0],
            o = this.content.getComponent(Layout);
        (this.sapce = o.spacingY), (this.topPadding = o.paddingTop), (this.itemHeight = i.getComponent(UITransform).contentSize.height);
        var s = o.paddingTop + o.paddingTop + this.cfgs.length * (this.sapce + this.itemHeight);
        (o.enabled = false), (this.content.getComponent(UITransform).height = s);
        for (var r = 0; r < this.cfgs.length; r++)
            this.cfgs[r].posY = -(o.paddingTop + this.itemHeight / 2 + (this.itemHeight + this.sapce) * r);
        var a = Math.ceil(this.view.getComponent(UITransform).height / (this.sapce + this.itemHeight)) + 2,
            l = Math.min(a, this.cfgs.length);
        0 == this.rankuiitemArr.length && this.rankuiitemArr.push(i.getComponent(APRankUIItem));
        for (var d = this.rankuiitemArr.length; d < l; d++) {
            var p = instantiate(i);
            (p.parent = i.parent), this.rankuiitemArr.push(p.getComponent(APRankUIItem));
        }
        (this.canViewHeight = this.view.getComponent(UITransform).height),
            (this.minHeight = this.canViewHeight / 2),
            (this.moveHeight = s - this.canViewHeight),
            (this.rootNode.active = true);
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
        var e =
            (((this.content.position.y - this.minHeight) / this.moveHeight) * this.moveHeight +
                this.canViewHeight / 2 -
                this.topPadding -
                this.itemHeight / 2 -
                this.canViewHeight / 2) /
            (this.itemHeight + this.sapce);
        e = Math.round(e);
        var t = (e = math.clamp(e, 0, this.cfgs.length - 1));
        t > 0 && t--;
        for (var n = 0; n < this.rankuiitemArr.length; n++) {
            var i = this.rankuiitemArr[n];
            n + t < this.cfgs.length && i.init(this.cfgs[n + t], this.type);
        }
    }
    lateUpdate(e) {
        this.contentY != this.content.position.y && ((this.contentY = this.content.position.y), this.scrollViewUpdate());
    }
}
