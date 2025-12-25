import { _decorator, Component, Material, Vec3, CCInteger, CCBoolean, Mat4, v3, warn } from "cc";
import { TrailManager } from "./TrailManager";

const B = new Vec3();
const I = new Vec3();
const L = new Mat4();

const { ccclass, property } = _decorator;
@ccclass("TrailRenderCPU")
export class TrailRenderCPU extends Component {
    @property(Material)
    material: Material = null;

    @property([Vec3])
    vertexs: Vec3[] = [v3(-0.1, 0, 0), v3(0.1, 0, 0)];

    @property(CCInteger)
    length: number = 10;

    @property(CCInteger)
    maxTrailCount: number = 100;

    @property(CCBoolean)
    isUpdate: boolean = true;

    _vbF32: Float32Array = null;
    _iBuffer: Uint16Array = null;
    _trailIndex: number = 0;
    _vertexIndex: number = 0;
    allTimeFrame: number = 0;
    updateRate: number = 1;

    start() {
        this.rebuild();
    }
    onDestroy() {
        (this._vbF32 = null), (this._iBuffer = null);
    }
    rest() {
        if (this._vbF32 && this._vbF32.length > 0) {
            var e = this.vertexs.length;
            this.node.getWorldMatrix(L);
            for (var t = 0; t < this.length; t++)
                for (var n = 0; n < e; n++) {
                    B.set(this.vertexs[n]), B.transformMat4(L);
                    var i = 5 * (t * e + n) + this._vertexIndex;
                    (this._vbF32[i] = B.x), (this._vbF32[i + 1] = B.y), (this._vbF32[i + 2] = B.z);
                }
        }
    }
    rebuild() {
        if (!this.material) return warn("material is null"), void (this.isUpdate = false);
        var e = TrailManager.instance.createModel(this.length, this.vertexs.length, this.material, this.maxTrailCount);
        (this._trailIndex = TrailManager.instance.getBufferIndex(this.material.name)),
            (this._vbF32 = e.vertxBuffer),
            (this._iBuffer = e.indexBuffer);
        var t = this.vertexs.length,
            n = this.length * t * this._trailIndex;
        this._vertexIndex = this.length * t * this._trailIndex * 5;
        var i = (this.length - 1) * (t - 1) * 2 * this._trailIndex * 3;
        this.node.getWorldMatrix(L);
        for (var o = 0; o < this.length; o++)
            for (var r = o / (this.length - 1), a = 0; a < t; a++) {
                B.set(this.vertexs[a]), B.transformMat4(L);
                var s = 5 * (o * t + a) + this._vertexIndex;
                (this._vbF32[s] = B.x), (this._vbF32[s + 1] = B.y), (this._vbF32[s + 2] = B.z);
                var l = a / (t - 1);
                (this._vbF32[s + 3] = r), (this._vbF32[s + 4] = l);
            }
        for (var u = 2 * (t - 1), c = 0; c < this.length - 1; c++)
            for (var d = c, h = c + 1, m = 0; m < t - 1; m++) {
                var g = t * d + m + n,
                    v = t * h + m + n,
                    y = 3 * (d * u + 2 * m) + i;
                (this._iBuffer[y] = g),
                    (this._iBuffer[y + 1] = v),
                    (this._iBuffer[y + 2] = g + 1),
                    (this._iBuffer[y + 3] = v),
                    (this._iBuffer[y + 4] = v + 1),
                    (this._iBuffer[y + 5] = g + 1);
            }
    }
    updateRenderData() {
        this.node.getWorldMatrix(L);
        for (var e = this.vertexs.length, t = 0; t < e; t++) {
            B.set(this.vertexs[t]), B.transformMat4(L);
            var n = 5 * t + this._vertexIndex;
            (this._vbF32[n] = B.x), (this._vbF32[n + 1] = B.y), (this._vbF32[n + 2] = B.z);
        }
        if ((this.allTimeFrame++, this.allTimeFrame % this.updateRate == 0))
            for (var i = this.length - 1; i >= 1; i--)
                for (var o = 0; o < e; o++) {
                    var r = 5 * (e * (i - 1) + o) + this._vertexIndex,
                        a = 5 * (e * i + o) + this._vertexIndex;
                    (B.x = this._vbF32[r]),
                        (B.y = this._vbF32[r + 1]),
                        (B.z = this._vbF32[r + 2]),
                        (I.x = this._vbF32[a]),
                        (I.y = this._vbF32[a + 1]),
                        (I.z = this._vbF32[a + 2]),
                        Vec3.lerp(I, I, B, 1),
                        (this._vbF32[a] = I.x),
                        (this._vbF32[a + 1] = I.y),
                        (this._vbF32[a + 2] = I.z);
                }
    }
    update(e) {
        this.isUpdate && this.updateRenderData();
    }
    play() {
        (this.isUpdate = true), this.rest();
    }
    stop() {
        (this.isUpdate = false), this.rest();
    }
}
