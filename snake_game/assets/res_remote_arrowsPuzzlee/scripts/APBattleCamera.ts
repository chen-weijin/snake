import { _decorator, CameraComponent, tween, Vec3, Component } from "cc";
import { APCameraShake } from "./APCameraShake";

const { ccclass } = _decorator;
@ccclass("APBattleCamera")
export class APBattleCamera extends Component {
    target = null;
    isFocus = false;
    focusTime = 2;
    isMove = false;
    camera: CameraComponent;
    camerashake: APCameraShake;
    startCameraAni: any;
    cameraMove: any;
    lowCamera: any;
    midCamera: any;
    highCamera: any;

    onLoad() {
        this.camera = this.getComponent(CameraComponent);
        this.camerashake = this.node.getComponent(APCameraShake);
    }
    lookat(e) {
        this.target = e;
    }

    free() {
        this.target = null;
    }
    focus(e) {
        (this.node.worldPosition = e.worldPosition), (this.camera.fov = 30), (this.isFocus = true), (this.focusTime = 2);
    }
    focusByTween(e, t = 3) {
        var n = this;
        this.isMove ||
            ((this.target = null),
            tween(this.node)
                .to(0.5, {
                    worldPosition: e.worldPosition,
                })
                .call(function () {
                    (n.target = e), (n.isMove = false);
                })
                .start(),
            (this.isMove = true),
            (this.isFocus = true),
            (this.focusTime = t));
    }
    shake(e, t = 1, n = 5) {
        this.camerashake.shake(e, t, n);
    }
    lookAtStage() {}
    lookAtTown() {}
    lookAtFace() {}
    setCameraTrans(e) {
        (this.camera.node.worldPosition = e.worldPosition), (this.camera.node.worldRotation = e.worldRotation);
    }
    startAni() {
        var e;
        null == (e = this.startCameraAni) || e.stop(),
            (this.startCameraAni = tween(this.camera)
                .to(1, {
                    fov: 30,
                })
                .start());
    }
    changeCameraScale(e) {
        var t;
        null == (t = this.cameraMove) || t.stop(),
            (this.cameraMove = tween(this.camera.node)
                .to(0.5, {
                    position: e.position,
                })
                .start());
    }
    setCameraLow() {
        this.setCameraTrans(this.lowCamera);
    }
    setCameraMid() {
        this.setCameraTrans(this.midCamera);
    }
    setCameraHigh() {
        this.setCameraTrans(this.highCamera);
    }
    changeCameraToLow() {
        this.changeCameraScale(this.lowCamera);
    }
    changeCameraToMid() {
        this.changeCameraScale(this.midCamera);
    }
    changeCameraToHigh() {
        this.changeCameraScale(this.highCamera);
    }
    roadCamerAni() {}
    stopStartAni() {
        var e;
        null == (e = this.startCameraAni) || e.stop();
    }
    setCameraStartFov() {
        this.stopStartAni();
    }
    lateUpdate(e) {
        if ((this.isFocus && ((this.focusTime -= e), this.focusTime <= 0 && (this.isFocus = false)), this.target && this.target.isValid)) {
            var t = Vec3.lerp(new Vec3(), this.node.worldPosition, this.target.worldPosition, 0.05);
            this.node.worldPosition = t;
        }
    }
    getFocus() {
        return this.isFocus;
    }
    startGameTween() {
        tween(this.camera)
            .to(0.3, {
                fov: 50,
            })
            .start();
    }
    setBattleCamerFov() {
        this.camera.fov = 20;
    }
}
