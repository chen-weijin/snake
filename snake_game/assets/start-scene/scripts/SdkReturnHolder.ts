import { _decorator, Component } from "cc";
import { ChannelEnum } from "./PlatConst";
import { SdkPkgConfig } from "./SdkConfig";
import { sdktools } from "./SdkTools";

const { ccclass } = _decorator;

@ccclass("SdkReturnHolder")
export class SdkReturnHolder extends Component {
    btnDesk: any;
    btnEnter: any;
    btnSide: any;
    start() {
        (this.btnDesk = sdktools.click(this.node, "btnDesk", function () {
            window.SmSdk.addShortcut();
        })),
            (this.btnEnter = sdktools.click(this.node, "btnEnter", function () {
                window.SmSdk.addCommonUse();
            })),
            SdkPkgConfig.Channel == ChannelEnum.Kuaishou ? (this.btnEnter.active = true) : (this.btnEnter.active = false),
            (this.btnSide = sdktools.click(
                this.node,
                "btnSide",
                function () {
                    window.SmSdk.sdkImp.showSidebar();
                },
                this
            )),
            (this.btnSide.active = window.SmSdk.isSidebarExist);
    }
}
