import { _decorator, Label, Sprite, Vec3, UITransform, Component } from "cc";
import smtools from "../../start-scene/scripts/SmTools";

const { ccclass } = _decorator;
@ccclass("APRankUIItem")
export class APRankUIItem extends Component {
    isInitUI = false;
    isCreateClickEvent = false;
    isCreateClickEvent2 = false;
    lbl_paimiang: any;
    lbl_name: any;
    lbl_count: any;
    icon: any;
    icon_paiming: any;
    cfg: any;

    initUI() {
        this.isInitUI ||
            ((this.isInitUI = true),
            (this.lbl_paimiang = smtools.find(this.node, "lbl_paiming", Label)),
            (this.lbl_name = smtools.find(this.node, "lbl_name", Label)),
            (this.lbl_count = smtools.find(this.node, "lbl_count", Label)),
            (this.icon = smtools.find(this.node, "icon", Sprite)),
            (this.icon_paiming = smtools.find(this.node, "icon_paiming", Sprite)));
    }
    init(e, t, n = true) {
        var i = this;
        if (!this.cfg || this.cfg != e || !n) {
            (this.cfg = e),
                this.initUI(),
                (this.lbl_name.string = e.playername),
                (this.lbl_count.string = e.score.toString()),
                e.rank <= 3
                    ? ((this.icon_paiming.node.active = true),
                      (this.lbl_paimiang.string = ""),
                      window.sm.res.loadSpriteFrame("texture/ui/ph_p" + e.rank).then(function (e) {
                          e && (i.icon_paiming.spriteFrame = e);
                      }))
                    : ((this.icon_paiming.node.active = false), (this.lbl_paimiang.string = e.rank.toString())),
                this.setSp();
            var o = new Vec3(this.node.position.x, e.posY, this.node.position.z);
            (this.node.position = o),
                false == this.isCreateClickEvent &&
                    ((this.isCreateClickEvent = true), smtools.click(this.node, this.node.name, function () {}, this));
        }
    }
    setSp() {
        var e = this;
        if (this.cfg.sp) {
            this.icon.spriteFrame = this.cfg.sp;
            var t = this.icon.getComponent(UITransform);
            t && smtools.setSuitSize(t, 73, this.icon.spriteFrame);
        } else
            this.scheduleOnce(function () {
                e.setSp();
            }, 0.1);
    }
    init2(e, t) {
        var n = this;
        (this.lbl_paimiang = smtools.find(this.node, "lbl_paiming", Label)),
            (this.lbl_name = smtools.find(this.node, "lbl_name", Label)),
            (this.lbl_count = smtools.find(this.node, "lbl_count", Label)),
            (this.icon = smtools.find(this.node, "icon", Sprite)),
            (this.icon_paiming = smtools.find(this.node, "icon_paiming", Sprite)),
            0 == t && (this.lbl_count.string = window.gm_ap.level.levelIdx.toString()),
            1 == t && (this.lbl_count.string = window.gm_ap.level.dayLevel.toString()),
            (this.lbl_name.string = window.SmSdk.savedPlayerName),
            e <= 3
                ? ((this.icon_paiming.node.active = true),
                  (this.lbl_paimiang.string = ""),
                  window.sm.res.loadSpriteFrame("texture/ui/ph_p" + e).then(function (e) {
                      e && (n.icon_paiming.spriteFrame = e);
                  }))
                : ((this.icon_paiming.node.active = false), (this.lbl_paimiang.string = e <= 100 ? e.toString() : "100+")),
            window.gm_ap.player.playerSp
                ? (this.icon.spriteFrame = window.gm_ap.player.playerSp)
                : smtools.setPortrait(window.SmSdk.savedPortrait, this.icon, 75).then(function (e) {
                      (window.gm_ap.player.playerSp = e), (n.icon.spriteFrame = window.gm_ap.player.playerSp);
                  });
    }
}
