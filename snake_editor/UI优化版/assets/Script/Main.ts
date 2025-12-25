import MapData from "./MapData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Main extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {}

    start () {
    }

    // update (dt) {}

    onBtnClick01(event, customData) {
        console.log(`onBtnClick: ${customData}`);
        cc.director.loadScene("MapEdit");
    }

    onBtnClick02(event, customData) {
        console.log(`onBtnClick: ${customData}`);
        cc.director.loadScene("MapEditCustom");
    }

    //加载地图数据方法
    onbtnClick03(event, customData) {
        var data_str = "9;15;93,94,103,102,111,112,113,104,95,96,97,106,107|65,66,75,74,83,84,85,86,77,68,67,58,49|60,59,50,41,40,39,38,37,28,19,10,11,2|43,44,35,34,33,42,51,52,61,70,71|25,24,23,22,31,30,29,20,21,12,13,4,3|26,17,16,7,6,15,14|130,129,120,121,122,131,132,123,114,105|56,57,48,47,46,55,54,45,36,27,18|62,53|64,73,72,63|92,91,100,101,110,119|82,81|90,99,108,117,118,127|133,134,125,124,115|98,89,88|87,78,79,80|1,0";
        var obj = MapData.CreateMapDataByStr(data_str);
        cc.log(obj);
    }

}