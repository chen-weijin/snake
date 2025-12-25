import { _decorator, Node, Component, director, Director, gfx, RenderingSubMesh, renderer } from "cc";

const { ccclass, executionOrder } = _decorator;
@ccclass("TrailManager")
@executionOrder(-1)
export class TrailManager extends Component {
    private static _instance: TrailManager = null;
    private _models: any = {};
    private _modelIndexs: any = {};

    static get instance() {
        if (!this._instance) {
            const node = new Node();
            this._instance = node.addComponent(TrailManager);
            director.getScene().addChild(node);
        }
        return this._instance;
    }

    onLoad() {
        (TrailManager._instance = this), this.node.setPosition(0, 0, 0), director.on(Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
    }
    getBufferIndex(e) {
        return this._modelIndexs[e];
    }
    createModel(e, t, n, i) {
        if (this._models[n.name]) return this._modelIndexs[n.name]++, this._models[n.name];
        for (
            var o = new gfx.IndirectBuffer([new gfx.DrawInfo()]),
                a = [
                    new gfx.Attribute(gfx.AttributeName.ATTR_POSITION, gfx.Format.RGB32F),
                    new gfx.Attribute(gfx.AttributeName.ATTR_TEX_COORD, gfx.Format.RG32F),
                ],
                c = 0,
                d = 0,
                f = a;
            d < f.length;
            d++
        ) {
            var h = f[d];
            c += gfx.FormatInfos[h.format].size;
        }
        var m = e * t * i,
            p = (e - 1) * (t - 1) * 2 * i,
            g = director.root.device,
            v = g.createBuffer(
                new gfx.BufferInfo(
                    gfx.BufferUsageBit.VERTEX | gfx.BufferUsageBit.TRANSFER_DST,
                    gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
                    c * m,
                    c
                )
            ),
            y = new ArrayBuffer(c * m),
            k = new Float32Array(y);
        v.update(y);
        var S = g.createBuffer(
                new gfx.BufferInfo(
                    gfx.BufferUsageBit.INDEX | gfx.BufferUsageBit.TRANSFER_DST,
                    gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
                    3 * p * Uint16Array.BYTES_PER_ELEMENT,
                    Uint16Array.BYTES_PER_ELEMENT
                )
            ),
            b = new Uint16Array(3 * p);
        S.update(b);
        var P = g.createBuffer(
            new gfx.BufferInfo(
                gfx.BufferUsageBit.INDIRECT,
                gfx.MemoryUsageBit.HOST | gfx.MemoryUsageBit.DEVICE,
                gfx.DRAW_INFO_SIZE,
                gfx.DRAW_INFO_SIZE
            )
        );
        (o.drawInfos[0].vertexCount = m), (o.drawInfos[0].indexCount = 3 * p), P.update(o);
        var _ = director.root.createModel(renderer.scene.Model),
            T = new RenderingSubMesh([v], a, gfx.PrimitiveMode.TRIANGLE_LIST, S, P);
        return (
            _.initSubModel(0, T, n),
            (_.node = _.transform = this.node),
            this._getRenderScene().addModel(_),
            (this._models[n.name] = {
                model: _,
                vertxBuffer: k,
                indexBuffer: b,
                iaInfo: o,
                iaInfoBuffer: P,
                faceCount: p,
                vertSize: c,
                subMeshData: T,
            }),
            (this._modelIndexs[n.name] = 0),
            this._models[n.name]
        );
    }
    onDestroy() {
        for (var e in ((TrailManager._instance = null), this._models)) {
            var t = this._models[e],
                n = t.model;
            n.scene && n.scene.removeModel(n),
                t.subMeshData.destroy(),
                (t.subMeshData = null),
                director.root.destroyModel(n),
                (t.model = null),
                (this._models[e] = null);
        }
        (this._models = {}), director.off(Director.EVENT_BEFORE_COMMIT, this.beforeRender, this);
    }
    beforeRender() {
        for (var e in this._models) {
            var t = this._models[e],
                n = t.model,
                i = n && n.subModels;
            if (i && i.length > 0) {
                var o = i[0];
                t.iaInfo, o.inputAssembler.vertexBuffers[0].update(t.vertxBuffer), o.inputAssembler.indexBuffer.update(t.indexBuffer);
            }
        }
    }
}
