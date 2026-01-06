import { _decorator, find, game, Node } from "cc";
import Singleton from './Singleton';
import { NoticeManager } from './NoticeManager';
import PanelManager from './PanelManager';

const { ccclass } = _decorator;

@ccclass("UIManager")
export class UIManager extends Singleton {
    _click_layer: Node = null;
    pnl: PanelManager = null;
    notice: NoticeManager = null;

    get layer_bottom() {
        return this.pnl.layer_bottom;
    }

    get layer_panel() {
        return this.pnl.layer_panel;
    }

    get layer_top() {
        return this.pnl.layer_top;
    }

    get layer_notice() {
        return this.notice.layer;
    }

    get layer_clickUI() {
        return this._click_layer;
    }

    init() {
        const bottomPanel = find("ui_panel_bottom");
        const middlePanel = find("ui_panel_middle");
        const topPanel = find("ui_panel_top");
        const noticeLayer = find("ui_layer_notice");

        this._click_layer = find("ui_layer_clickUI");
        
        // 检查节点是否存在且有效，只有有效节点才添加为持久节点
        const nodesToPersist = [bottomPanel, middlePanel, topPanel, noticeLayer, this._click_layer];
        nodesToPersist.forEach((node, index) => {
            if (node && node.isValid) {
                try {
                    game.addPersistRootNode(node);
                } catch (error) {
                    console.warn(`Failed to add persist root node at index ${index}:`, error);
                }
            } else {
                console.warn(`Node at index ${index} is null or invalid, skipping persist`);
            }
        });

        this.pnl = new PanelManager(bottomPanel, middlePanel, topPanel);
        this.notice = new NoticeManager(noticeLayer);
    }

    panel(panelName: string) {
        return this.pnl.panel(panelName);
    }

    async preload(panelName: string) {
        return await this.pnl.preload(panelName);
    }

    async open(panelName: string) {
        return await this.pnl.open(panelName);
    }

    close(panelName: string) {
        return this.pnl.close(panelName);
    }

    reset() {
        this.pnl.reset();
    }

    tip(message: string, ...args: string[]) {
        for (let i = 0; i < args.length; ++i) {
            message = message.replace(`{${i}}`, args[i]);
        }
        this.notice.tip(message);
    }
}
