import { _decorator } from "cc";
import { sdktools } from "./SdkTools";
import { SmSdkBasePanel } from "./SmSdkBasePanel";

const { ccclass } = _decorator;
@ccclass("AdConfirmPanel")
export class AdConfirmPanel extends SmSdkBasePanel {
    btnGet: any;
    successCallback: any;
    failCallback: any;
    btnClose: any;

    init() {
        var e = this;

        this.btnGet = sdktools.click(
            this.node,
            "btnGet",
            function () {
                window.SmSdk.rewardVideoByAdConfirm().then(
                    function () {
                        e.successCallback && e.successCallback();
                        window.SmSdk.sdkPanel.closePanel(AdConfirmPanel);
                    },
                    function () {
                        e.failCallback && e.failCallback();
                    }
                );
            },
            this
        );

        this.btnClose = sdktools.click(
            this.node,
            "btnClose",
            function () {
                window.SmSdk.sdkPanel.closePanel(AdConfirmPanel);
            },
            this
        );
    }

    setCallBack(e, t?) {
        this.successCallback = e;
        this.failCallback = t;
    }
}
