import { _decorator, Component } from "cc";
import { SdkGameConfig, SdkConfig } from "../../start-scene/scripts/SdkConfig";
import { sdkEventManager, SdkInnerEvent } from "../../start-scene/scripts/SdkEventManager";
import { SysTaskManager } from "../../start-scene/scripts/SysTaskManager";

export function RegConfig(e) {
    sdkEventManager.on(SdkInnerEvent.OnRemoteConfigLoadDone, function (t) {
        SdkGameConfig.isShowDebugLog && console.log("====触发OnRemoteConfigLoadDone事件派发，输出远程配置", t),
            SdkConfig.merge(APGameConfig, t),
            SdkConfig.print(APGameConfig);
    }),
        SdkGameConfig.isShowDebugLog &&
            console.log("====本地脚本初始化成功，触发OnRemoteConfigLoadDone事件派发，输出远程配置", SdkConfig.remodeConfigData),
        SdkConfig.remodeConfigData &&
            SysTaskManager.addTimeTask(function () {
                SdkConfig.merge(APGameConfig, SdkConfig.remodeConfigData), SdkConfig.print(APGameConfig);
            }, 0.1);
}

const { ccclass } = _decorator;
@ccclass("APGameConfig")
export class APGameConfig extends Component {
    static gameCountDownOn = true;
    static countDownScale = 5;
    static reviveCountDown = 120;
    static powerSysOn = true;
    static reviveHp = 1;
    static loadNextLevel = 5;
    static gridResType = 0;
    static isDarkMode = false;
    static energyReviveTime = 300;
    static energyReviveCount = 1;
    static isOpenPool = true;
    static isMenuPanelOpen = false;
    static maxDis = 1;
    static moveLength = 4;
    static loadAni = 4;
    static shiWanId = 0;

    static get isShiWan() {
        return this.shiWanId > 0;
    }
}
