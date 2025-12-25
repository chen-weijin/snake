import { setDisplayStats } from "cc";
import { AudioManager } from "./AudioManager";
import { EventManager } from "./EventManager";
import { Logger } from "./Logger";
import { PoolManager } from "./PoolManager";
import { ResManager } from "./ResManager";
import { TaskManager } from "./TaskManager";
import { Tbl } from "./Tbl";
import { UIManager } from "./UIManager";

export class ShangMang {
    inited = false;

    get tbl() {
        return Tbl.instance();
    }

    get event() {
        return EventManager.instance();
    }

    get task() {
        return TaskManager;
    }

    get res() {
        return ResManager.instance();
    }

    get ui() {
        return UIManager.instance();
    }

    get audio() {
        return AudioManager.instance;
    }

    get pool() {
        return PoolManager.instance();
    }

    get log() {
        return Logger.instance();
    }

    get project() {
        return "moneyBounce";
    }

    baseInit(e) {
        window.SmSdk.init(function () {
            console.log("===开始初始化第三方平台框架");
            window.SmSdk.load(function () {
                e && e();
            });
        });
    }

    init() {
        window.sm.ui.init();
        this.inited = true;
        setDisplayStats(false);
    }
}

window.sm = new ShangMang();
//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 https://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 https://web3incubators.com/kefu.html