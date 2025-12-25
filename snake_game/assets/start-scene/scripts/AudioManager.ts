import { _decorator, AudioSourceComponent, AudioClip, loader, Component } from "cc";

class c {
    acName = "";
    asc: AudioSourceComponent;
}

class d {
    acName = "";
    asc: AudioSourceComponent;
}

class f {
    acName = "";
    asc: AudioSourceComponent;
}

const { ccclass } = _decorator;
@ccclass("AudioManager")
export class AudioManager extends Component {
    _audioDict = {};
    baseClickName = "click";
    maxQuickPoolSize = 5;
    static instance: AudioManager;
    curBGAC: AudioSourceComponent;
    bgACArr: any[];
    loopAudioArr: any[];
    shotClipACArr: any[];
    quickShotClipACArr: any[];
    onLoad() {
        AudioManager.instance = this;
        var e = this.node.getComponent(AudioSourceComponent);
        e && (this.curBGAC = e), (this.bgACArr = []), (this.loopAudioArr = []), (this.shotClipACArr = []), (this.quickShotClipACArr = []);
    }
    playMusic(e, t, n = 0) {
        var i = "audio/music/" + e,
            o = this._audioDict[e],
            r = window.gm.account.musicVolume;
        return o ? this._playMusicClip(r, n, o) : this._loadAudioClip(i, e, this._playMusicClip.bind(this, r, n)), !o;
    }
    playLoopAudioByName(e) {
        for (var t = this, n = 0; n < this.loopAudioArr.length; n++)
            if (this.loopAudioArr[n].acName == e) return void this.playloopAC(this.loopAudioArr[n].asc);
        window.sm.res.loadAudioClip("audio/sound/" + e).then(function (n) {
            var i = new c();
            (i.acName = e),
                (i.asc = t.node.addComponent(AudioSourceComponent)),
                (i.asc.clip = n),
                t.loopAudioArr.push(i),
                t.playloopAC(i.asc);
        });
    }
    stopLoopAudioByName(e) {
        for (var t = 0; t < this.loopAudioArr.length; t++) this.loopAudioArr[t].acName == e && this.loopAudioArr[t].asc.stop();
    }
    playloopAC(e) {
        e.play(), (e.volume = window.gm.account.soundVolume), (e.loop = true);
    }
    _loadAudioClip(e, t, n) {
        var i = this;
        window.sm.res.findBundle(e).load(e, AudioClip, function (e, o) {
            e ? window.sm.log.error(e) : ((i._audioDict[t] = o), n(o));
        });
    }
    _playMusicClip(e, t, n) {
        this.curBGAC && this.curBGAC.stop();
        for (var i = 0; i < this.bgACArr.length; i++)
            if (this.bgACArr[i].acName == n.name && !this.bgACArr[i].asc.playing)
                return (
                    this.bgACArr[i].asc.play(),
                    (this.bgACArr[i].asc.volume = e * window.gm.account.musicVolume),
                    void (this.curBGAC = this.bgACArr[i].asc)
                );
        var r = new f(),
            a = this.node.addComponent(AudioSourceComponent);
        (a.clip = n),
            (a.loop = true),
            (a.volume = e * window.gm.account.musicVolume),
            a.play(),
            (r.acName = n.name),
            (r.asc = a),
            (this.curBGAC = a),
            this.bgACArr.push(r);
    }
    setMusicVolume(e) {
        this.curBGAC && (this.curBGAC.volume = e);
    }
    playSound(e, t = 1) {
        if (0 != window.gm.account.soundVolume) {
            var n = "audio/sound/" + e,
                i = this._audioDict[e];
            i ? this._playSoundClip(t, i) : this._loadAudioClip(n, e, this._playSoundClip.bind(this, t));
        }
    }
    playSound_quickTimes(e, t = 1) {
        if (0 != window.gm.account.soundVolume) {
            var n = "audio/sound/" + e,
                i = this._audioDict[e];
            i ? this._playSoundClip_quick(t, i) : this._loadAudioClip(n, e, this._playSoundClip_quick.bind(this, t));
        }
    }
    playBtnClick() {}
    playSoundOneClip(e, t = 1) {
        if (0 != window.gm.account.soundVolume) {
            var n = "audio/sound/" + e,
                i = this._audioDict[e];
            i ? this._playSoundClip(t, i) : this._loadAudioClip(n, e, this._playSoundClip.bind(this, t));
        }
    }
    _playSoundClip(e, t) {
        for (var n = 0; n < this.shotClipACArr.length; n++)
            if (this.shotClipACArr[n].acName == t.name && !this.shotClipACArr[n].asc.playing)
                return this.shotClipACArr[n].asc.play(), void (this.shotClipACArr[n].asc.volume = e * window.gm.account.soundVolume);
        var i = new d(),
            r = this.node.addComponent(AudioSourceComponent);
        (r.clip = t),
            (r.loop = false),
            (r.volume = e * window.gm.account.soundVolume),
            r.play(),
            (i.acName = t.name),
            (i.asc = r),
            this.shotClipACArr.push(i);
    }
    _playSoundClip_quick(e, t) {
        for (var n = 0; n < this.quickShotClipACArr.length; n++)
            if (this.quickShotClipACArr[n].acName == t.name && !this.quickShotClipACArr[n].asc.playing)
                return (
                    this.quickShotClipACArr[n].asc.play(), void (this.quickShotClipACArr[n].asc.volume = e * window.gm.account.soundVolume)
                );
        if (!(this.quickShotClipACArr.length >= this.maxQuickPoolSize)) {
            var i = new d(),
                r = this.node.addComponent(AudioSourceComponent);
            (r.clip = t),
                (r.loop = false),
                (r.volume = e * window.gm.account.soundVolume),
                r.play(),
                (i.acName = t.name),
                (i.asc = r),
                this.quickShotClipACArr.push(i);
        }
    }
    pauseMusic() {
        this.curBGAC && this.curBGAC.pause();
    }
    static offPlay() {}
    resumeMusic() {
        this.curBGAC && this.curBGAC.play(), this.curBGAC && (this.curBGAC.volume = window.gm.account.musicVolume);
    }
    stopMusic() {
        this.curBGAC && this.curBGAC.stop();
    }
    releaseAudioClip() {
        for (var e = 0, t = Object.keys(this._audioDict); e < t.length; e++) {
            var n = t[e],
                i = this._audioDict[n];
            loader.release(i);
        }
        this.curBGAC && this.curBGAC.destroy();
    }
}
