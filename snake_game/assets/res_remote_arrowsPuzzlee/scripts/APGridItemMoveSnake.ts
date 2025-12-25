import { _decorator, Enum, Sprite, Color } from "cc";
import smtools from "../../start-scene/scripts/SmTools";
import { ApBodyType } from "./APEnum";
import { APGameConfig } from "./APGameConfig";
import { APGridItemMove } from "./APGridItemMove";

const { ccclass, property } = _decorator;

@ccclass("APGridItemMoveSnake")
export class APGridItemMoveSnake extends APGridItemMove {
    @property({ type: Enum(ApBodyType) })
    bodyType = ApBodyType.Body;
    eyeSP: any;
    bodySp: Sprite;

    init(e) {
        1 === window.gm_ap.skin.curSkinId &&
            ((this.eyeSP = smtools.find(this.node, "EyeLid", Sprite)),
            (this.bodySp = this.node.getComponent(Sprite)),
            this.loadColorByRes(e),
            this.bodyType == ApBodyType.Head && this.changeEyeColor(e));
    }

    async loadColorByRes(t) {
        if (!APGameConfig.moveLength) return;

        if (this.bodyType == ApBodyType.Body) {
            this.bodySp.spriteFrame = await window.gm_ap.mat.getBodyRes(t);
        }

        if (this.bodyType == ApBodyType.Tail) {
            this.bodySp.spriteFrame = await window.gm_ap.mat.getTailRes(t);
        }

        if (this.bodyType == ApBodyType.TailEnd) {
            this.bodySp.spriteFrame = await window.gm_ap.mat.getTailEndRes(t);
        }

        if (this.bodyType == ApBodyType.Head) {
            this.bodySp.spriteFrame = await window.gm_ap.mat.getHeadRes(t);
        }
    }

    changeEyeColor(e) {
        var t;
        switch (e) {
            case "cyan blue":
            case "blue":
                t = new Color().fromHEX("#0068f5");
                break;
            case "black":
                t = new Color().fromHEX("#1a1a1a");
                break;
            case "black gray":
                t = new Color().fromHEX("#8088a0");
                break;
            case "dark green":
                t = new Color().fromHEX("#007b00");
                break;
            case "fuchsia":
                t = new Color().fromHEX("#c3008a");
                break;
            case "gray":
                t = new Color().fromHEX("#719dc2");
                break;
            case "green":
                t = new Color().fromHEX("#01bd08");
                break;
            case "light gray":
                t = new Color().fromHEX("#c6c6c6");
                break;
            case "light green":
                t = new Color().fromHEX("#b0cf00");
                break;
            case "mint green":
                t = new Color().fromHEX("#00a09c");
                break;
            case "orange":
                t = new Color().fromHEX("#f68800");
                break;
            case "pink":
                t = new Color().fromHEX("#ee4883");
                break;
            case "purple":
                t = new Color().fromHEX("#990bf2");
                break;
            case "red":
                t = new Color().fromHEX("#cf1913");
                break;
            case "rust":
                t = new Color().fromHEX("#a93001");
                break;
            case "turquoise":
                t = new Color().fromHEX("#00bfde");
                break;
            case "vivid orange":
                t = new Color().fromHEX("#f85c00");
                break;
            case "yellow":
                t = new Color().fromHEX("#f2cd00");
        }
        this.eyeSP.color = t;
    }
}
