import { Button, EventHandler } from "cc";

Button.prototype._onTouchEnded = function (e) {
    console.log(`%csmile---xxxx---> `, "color: red; font-size:16px");
    let i,
        o = e.currentTarget.getComponent(Button),
        r = (new Date().getTime(), o.clickAudio);

    (i = window.sm) == null || (i = i.audio) == null || i.playSound(r || "click");

    o._pressed && (EventHandler.emitEvents(o.clickEvents, e), o.node.emit(Button.EventType.CLICK, o));

    o._pressed = false;
    o._updateState();

    e && (e.propagationStopped = true);
};
