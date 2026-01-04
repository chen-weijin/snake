import { _decorator } from "cc";
import { SdkPkgConfig, SdkGameConfig } from "./SdkConfig";
import { sdkhttp } from "./SdkHttp";
import { sdkrand } from "./SdkRand";

const { ccclass } = _decorator;
@ccclass("RankManager")
export class RankManager {
    rankConfigs = {};

    init() {
        var e = this;
        !SdkPkgConfig.gameid || SdkPkgConfig.gameid.length <= 0
            ? console.log("没有appid，无法获取排行榜")
            : sdkhttp.requestv3(
                  SdkGameConfig.rankRemoteURL + "rankconfig?appid=" + SdkPkgConfig.gameid,
                  JSON.stringify({
                      appid: SdkPkgConfig.gameid,
                  }),
                  function (n) {
                      window.sm.log.debug("#### rank #### 获取排行榜配置:", n);
                      for (const r of n) {
                          e.rankConfigs[r.rankid] = r;
                      }
                  }
              );
    }
    report(e, t, n = {}) {
        window.sm.log.debug("上传数据:" + e + "," + t);
        var i = this.rankConfigs[e];
        i
            ? "desc" == i.order && t < i.min_score
                ? window.sm.log.error("@@@1分数[" + t + "]低于[" + e + "]排行榜进榜分数[" + i.min_score + "]，不上报排行榜成绩")
                : "asc" == i.order && t > i.min_score
                ? window.sm.log.error("@@@@2分数[" + t + "]高于[" + e + "]排行榜进榜分数[" + i.min_score + "]，不上报排行榜成绩")
                : (console.log("### sc ###"),
                  window.SmSdk.sdkImp.getPlayerInfo(function () {
                      window.sm.log.debug("获取玩家信息结束"),
                          window.sm.log.debug("排行榜数据上报:", e, window.SmSdk.savedOpenid, t, window.SmSdk.savedPlayerName),
                          sdkhttp.requestv3(
                              SdkGameConfig.rankRemoteURL + "rankreport?appid=" + SdkPkgConfig.gameid,
                              JSON.stringify({
                                  appid: SdkPkgConfig.gameid,
                                  rankid: e,
                                  openid: window.SmSdk.savedOpenid,
                                  score: t,
                                  playername: window.SmSdk.savedPlayerName,
                                  portrait: window.SmSdk.savedPortrait,
                                  ext: JSON.stringify(n),
                              }),
                              function (e) {
                                  window.sm.log.debug("排行榜上报成功");
                              }
                          );
                  }))
            : window.sm.log.error("排行榜未初始化，或者没有id为[" + e + "]的排行榜");
    }
    reportDebug(e, t, n = {}) {
        window.sm.log.debug("上传数据:" + e + "," + t);
        var i = this.rankConfigs[e];
        i
            ? ("desc" == i.order && t < i.min_score) ||
              ("asc" == i.order && t > i.min_score) ||
              window.SmSdk.sdkImp.getPlayerInfo(function () {
                  window.sm.log.debug("获取玩家信息结束"),
                      window.sm.log.debug("排行榜数据上报:", e, window.SmSdk.savedOpenid, t, window.SmSdk.savedPlayerName),
                      sdkhttp.requestv3(
                          SdkGameConfig.rankRemoteURL + "rankreport?appid=" + SdkPkgConfig.gameid,
                          JSON.stringify({
                              appid: "wx4bfef138b08d114f",
                              rankid: e,
                              openid: "ooP114xx" + sdkrand.randInt(0, 300) + "fewjd-9InU0pjT88+" + sdkrand.randInt(0, 300),
                              score: t,
                              playername: "debug上传",
                              portrait: window.SmSdk.savedPortrait,
                              ext: JSON.stringify(n),
                          }),
                          function (e) {
                              window.sm.log.debug("排行榜上报成功");
                          }
                      );
              })
            : window.sm.log.error("排行榜未初始化，或者没有id为[" + e + "]的排行榜");
    }
    rankdata(e, t = 0, n = 100, i) {
        sdkhttp.requestv3(
            SdkGameConfig.rankRemoteURL + "rankdata?appid=" + SdkPkgConfig.gameid,
            JSON.stringify({
                appid: SdkPkgConfig.gameid,
                rankid: e,
                openid: "test",
                // openid: window.SmSdk.savedOpenid,
                range_from: t,
                range_to: n,
                ranklevel: 0,
            }),
            function (t) {
                window.sm.log.debug("获取排行榜数据:", e, t), i(t);
            }
        );
    }
}
