import { _decorator, MeshRenderer, instantiate, BatchingUtility, Component } from "cc";

const { ccclass } = _decorator;
@ccclass("AutoMerge")
export class AutoMerge extends Component {
    start() {
        var e = this,
            t = this.node.getComponentsInChildren(MeshRenderer),
            n = [],
            i = {};
        t.forEach(function (e) {
            if (1 == e.sharedMaterials.length) {
                var t = n.indexOf(e.getMaterial(0));
                t > -1 ? i[t].push(e.node) : (n.push(e.getMaterial(0)), (i[n.length - 1] = []), i[n.length - 1].push(e.node));
            }
        });
        for (
            var s = function () {
                    var t = l;
                    window.sm.res.loadPrefab("prefab/mergeHolder").then(function (n) {
                        var o = instantiate(n);
                        for (var s in ((o.parent = e.node), i[t])) i[t][s].setParent(o, true);
                        o.children.length > 1 && BatchingUtility.batchStaticModel(o, o);
                    });
                },
                l = 0;
            l < n.length;
            l++
        )
            s();
    }

    merge() {}

    unlock() {}
}
