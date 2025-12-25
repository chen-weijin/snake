import { director, Director, Canvas, Camera, game, Node } from "cc";

const s = 1048575;

function l(e, t) {
    for (let n = 0, i = e.children.length; n < i; n++) {
        e.children[n].layer = t;
        l(e.children[n], t);
    }
}

director.on(Director.EVENT_AFTER_SCENE_LAUNCH, function () {
    let e, n, a;

    const u = director.getScene()?.children;
    let c = director.getScene()?.getComponentsInChildren(Canvas);

    if (!(c.length <= 1)) {
        c = c.filter(function (e) {
            return !!e.cameraComponent;
        });

        const d = director.getScene()?.getComponentsInChildren(Camera);
        let f = 0;

        d.forEach(function (e) {
            f |= e.visibility & s;
        });

        const h = [];
        for (let m = 0, p = u.length; m < p; m++) {
            const g = u[m];
            if (game.isPersistRootNode(g)) {
                const v = g.getComponentsInChildren(Canvas);
                if (v.length !== 0) {
                    h.push(
                        ...v.filter(function (e) {
                            return !!e.cameraComponent;
                        })
                    );
                }
            }
        }

        h.forEach(function (e) {
            if (
                c.find(function (t) {
                    return t !== e && t.cameraComponent.visibility & e.cameraComponent.visibility & s;
                })
            ) {
                const t = ~f;
                const n = t & ~(t - 1);
                e.cameraComponent.visibility = n | (4293918720 & e.cameraComponent.visibility);
                l(e.node, n);
                f |= t;
            }
        });
    }
});

const oldSetParent = Node.prototype.setParent;

Node.prototype.setParent = function (e, t) {
    oldSetParent.call(this, e, t);

    if (e) {
        const n = (function calcLayer(t) {
            let n = 0;
            const o = t.getComponent(Canvas);

            if (o && o.cameraComponent) {
                n =
                    o.cameraComponent.visibility & o.node.layer
                        ? o.node.layer
                        : o.cameraComponent.visibility & ~(o.cameraComponent.visibility - 1);
            } else {
                if (t.parent) n = calcLayer(t.parent);
            }
            return n;
        })(this);

        if (n) {
            this.layer = n;
            l(this, n);
        }
    }
};
