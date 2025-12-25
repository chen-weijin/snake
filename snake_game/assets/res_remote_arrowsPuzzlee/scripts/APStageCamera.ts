import { _decorator, Node, Camera, Vec2, Vec3, input, Input, KeyCode, math, view, Component, tween } from "cc";
import { APGamePanel } from "./APGamePanel";
import { APGuidePanel } from "./APGuidePanel";
import { APBattleCamera } from "./APBattleCamera";

const { ccclass, property } = _decorator;
@ccclass("APStageCamera")
export class APStageCamera extends Component {
    @property(Node)
    blockContainer = null;

    @property(Camera)
    camera = null;

    @property
    boundRatio = 1;

    lastTouchPos = new Vec2();
    lastTouchPos2 = new Vec2();
    lastTouchPos3 = new Vec2();
    containerStartPos = new Vec3();
    moveSpeed = 0.5;
    scaleNum = 2;
    isRecordStartDis = false;
    startOrthoHeight = 100;
    lastDistance = 0;
    startScale = 1;
    isInScaleCamera = false;
    minOrthoHeight = 80;
    maxOrthoHeight = 300;
    cameraTargetPos = new Vec3();
    boundMinX = -500;
    boundMaxX = 500;
    boundMinY = -300;
    boundMaxY = 300;
    focusDuration = 0.5;
    battleCamera: APBattleCamera;

    onLoad() {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this),
            input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this),
            input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this),
            input.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this),
            (this.battleCamera = this.node.getComponentInChildren(APBattleCamera)),
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    }
    onTouchStart(e) {
        var t = e.getTouches();
        1 === e.getTouches().length
            ? ((this.lastTouchPos = e.getLocation()), (this.containerStartPos = this.blockContainer.position.clone()))
            : 2 === e.getTouches().length &&
              ((this.isInScaleCamera = true),
              (this.lastDistance = this.calcTouchDistance(t)),
              (this.startOrthoHeight = this.camera.orthoHeight));
    }
    onKeyDown(e) {
        e.keyCode === KeyCode.KEY_D ? this.simulatePinch(5) : e.keyCode === KeyCode.KEY_F && this.simulatePinch(-5);
    }
    onTouchMove(e) {
        if (2 !== e.getTouches().length) {
            if (!this.isInScaleCamera && 1 === e.getTouches().length) {
                var t = e.getLocation(),
                    n = new Vec2(t.x - this.lastTouchPos.x, t.y - this.lastTouchPos.y);
                if (Math.abs(n.x) > 5 || Math.abs(n.y) > 5) {
                    var i = new Vec3(
                        this.camera.node.position.x - n.x * this.moveSpeed * window.gm_ap.player.sensitivity,
                        this.camera.node.position.y - n.y * this.moveSpeed * window.gm_ap.player.sensitivity,
                        this.camera.node.position.z
                    );
                    this.cameraTargetPos = this.clampPosition(i);
                }
                this.lastTouchPos = t;
            }
        } else {
            var o;
            if (this.isRecordStartDis) {
                var s,
                    r = this.calcTouchDistance(e.getTouches()),
                    a = r - this.lastDistance;
                if (0 == a) return;
                var l = this.camera.orthoHeight;
                a > 0 ? (l -= 2.5) : (l += 2.5);
                var c = math.clamp(l, this.minOrthoHeight, this.maxOrthoHeight);
                (this.camera.orthoHeight = c),
                    null == (s = window.sm.ui.panel(APGamePanel)) || s.refreshUI_zoomSlider(c),
                    (this.isInScaleCamera = true),
                    (this.lastDistance = r);
            } else
                (this.lastDistance = this.calcTouchDistance(e.getTouches())),
                    (this.startScale = this.blockContainer.scale.x),
                    (this.isRecordStartDis = true);
            null != (o = window.sm.ui.panel(APGuidePanel)) && o.zoomGuideIng && window.sm.ui.panel(APGuidePanel).setZoomGuide(false);
        }
    }
    onTouchEnd(e) {
        e.getAllTouches().length > 0 && (this.lastTouchPos = e.getAllTouches()[0].getLocation()),
            (this.isRecordStartDis = false),
            (this.isInScaleCamera = false);
    }
    update(e) {
        var t = this.camera.node.position.lerp(this.cameraTargetPos, 0.2);
        this.camera.node.position = t;
    }
    calcTouchDistance(e) {
        var t = e[0].getLocation(),
            n = e[1].getLocation();
        return Math.sqrt(Math.pow(n.x - t.x, 2) + Math.pow(n.y - t.y, 2));
    }
    simulatePinch(e = 0) {
        var t = new Vec2(100, 100),
            n = new Vec2(300, 300);
        (this.lastDistance = t.subtract(n).length()), (this.startOrthoHeight = this.camera.orthoHeight);
        var i = n.subtract(t).normalize(),
            o = n.add(i.multiplyScalar(e));
        function s(e) {
            return {
                getLocation: function () {
                    return e;
                },
            };
        }
        var r = {
            getTouches: function () {
                return [s(t), s(o)];
            },
        };
        this.onTouchMove(r), console.log("simulatePinch delta:", e, "orthoHeight:", this.camera.orthoHeight);
    }
    setMoveBounds(e, t, n, i) {
        var o = (e + t) / 2,
            s = (n + i) / 2,
            r = ((t - e) / 2) * this.boundRatio,
            a = ((i - n) / 2) * this.boundRatio;
        (this.boundMinX = o - r),
            (this.boundMaxX = o + r),
            (this.boundMinY = s - a),
            (this.boundMaxY = s + a),
            this.adjustOrthoHeight(e, t);
    }
    adjustOrthoHeight(e, t) {
        var n,
            i = t - e + 50,
            o = view.getVisibleSize(),
            s = i / (o.width / o.height) / 2;
        console.log("adjustOrthoHeight to: " + s),
            (this.maxOrthoHeight = s),
            (this.minOrthoHeight = s - 200),
            (this.camera.orthoHeight = s),
            null == (n = window.sm.ui.panel(APGamePanel)) || n.refreshUI_zoomSlider(s),
            (this.cameraTargetPos = Vec3.ZERO);
    }
    clampPosition(e) {
        var t = Math.min(Math.max(e.x, this.boundMinX), this.boundMaxX),
            n = Math.min(Math.max(e.y, this.boundMinY), this.boundMaxY);
        return new Vec3(t, n, e.z);
    }

    async focusToBlock(t, i = false) {
        var o = this;
        var s = this.clampPosition(new Vec3(t.x, t.y, this.camera.node.position.z));
        if (i) {
            s = new Vec3(t.x, t.y, this.camera.node.position.z);
        }
        this.cameraTargetPos = s;

        await new Promise(function (e) {
            tween(o.camera.node).to(o.focusDuration, { position: s }).call(e).start();
        });

        if (!i) {
            await new Promise(function (e) {
                tween(o.camera)
                    .to(
                        o.focusDuration,
                        {
                            orthoHeight: 100,
                        },
                        { easing: "linear" }
                    )
                    .call(e)
                    .start();
            });
        }
    }

    async focusToBlockOnlyMove(t) {
        var i = this;
        var o = this.clampPosition(new Vec3(t.x, t.y, this.camera.node.position.z));
        this.cameraTargetPos = o;

        await new Promise(function (e) {
            tween(i.camera.node)
                .to(i.focusDuration, {
                    position: o,
                })
                .call(e)
                .start();
        });
    }

    async highCamera() {
        var t = this;
        await new Promise(function (e) {
            tween(t.camera)
                .to(
                    2 * t.focusDuration,
                    {
                        orthoHeight: 200,
                    },
                    { easing: "linear" }
                )
                .call(e)
                .start();
        });
    }

    resetOrthoHeight(e = 200) {
        (this.camera.orthoHeight = e), console.log("orthoheight :" + this.camera.orthoHeight);
    }
}
