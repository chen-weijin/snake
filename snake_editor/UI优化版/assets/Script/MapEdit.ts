import MapData from "./MapData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEdit extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    default_size_arr = [[9, 15], [15, 25], [21, 35], [30, 50], [42, 70]];
    map_data: MapData = null;

    //线条颜色
    arrowColors = [
        new cc.Color().fromHEX("#d8646e"),
        new cc.Color().fromHEX("#85d100ff"),
        new cc.Color().fromHEX("#b759f5ff"),
        new cc.Color().fromHEX("#2ebde8ff"),
        new cc.Color().fromHEX("#dc6e50"),
        new cc.Color().fromHEX("#4576dfff"),
        new cc.Color().fromHEX("#17be91ff")
    ];

    @property(cc.Graphics)
    grapGrid: cc.Graphics = null;

    onLoad() { }

    start() {
        this.onBtnClick02(null, "0");
    }

    // update (dt) {}

    onBtnClick01(event, customData) {
        console.log(`onBtnClick: ${customData}`);
        cc.director.loadScene("Main");
    }

    onBtnClick02(event, customData) {
        console.log(`onBtnClick: ${customData}`);
        var index = parseInt(customData);
        if (index >= 0 && index < this.default_size_arr.length) {
            var size_arr = this.default_size_arr[index];
            this.map_data = MapData.CreateMapByArgs(size_arr[0], size_arr[1]);
            this.map_data.loadData();
            this.updateMapDisplay();
            this.map_data.getTargetDataFormatString();
        }
    }

    updateMapDisplay() {
        this.drawGirdPoint();
        this.drawPathArrow();
    }

    private drawGirdPoint() {
        if (this.grapGrid == null) {
            cc.log("grapGrid is null drawGrid");
            return;
        }

        var darkBlue = new cc.Color().fromHEX("#2EA5FF");
        var num_w = this.map_data.width;
        var num_h = this.map_data.height;

        var num = num_w;
        var w = this.grapGrid.node.width;
        var h = this.grapGrid.node.height;
        cc.log("drawGirdPoint: " + w + ", " + h);

        var e_w = Math.min(w * 0.98 / num, w * 0.33);
        var e_h = e_w;
        var g_w = e_w;
        var g_h = e_h;
        var offset_x = (w - e_w * num_w) * 0.5;
        var offset_y = (h - e_h * num_h) * 0.5;
        var startPos = new cc.Vec2(-this.grapGrid.node.width / 2, this.grapGrid.node.height / 2);
        var line_width = 3;

        this.grapGrid.node.active = true;
        this.grapGrid.clear();

        this.grapGrid.strokeColor = cc.Color.GRAY.clone();
        this.grapGrid.fillColor = cc.Color.GRAY.clone();
        this.grapGrid.lineWidth = line_width;
        for (var i = 0; i < num_h; i++) {
            for (var j = 0; j < num_w; j++) {
                var px = e_w * (j + 0.5) + offset_x;
                var py = e_h * (i + 0.5) + offset_y;
                var s_x = px + startPos.x;
                var s_y = startPos.y - (py);
                var s_r = 3;

                this.grapGrid.circle(s_x, s_y, s_r);
                this.grapGrid.fill();

            }
        }
        this.grapGrid.stroke();
    }

    private drawPathArrow() {
        if (this.grapGrid == null) {
            cc.log("grapGrid is null drawGrid");
            return;
        }

        var darkBlue = new cc.Color().fromHEX("#2EA5FF");
        var num_w = this.map_data.width;
        var num_h = this.map_data.height;

        var num = num_w;
        var w = this.grapGrid.node.width;
        var h = this.grapGrid.node.height;

        var e_w = Math.min(w * 0.98 / num, w * 0.33);
        var e_h = e_w;
        var g_w = e_w;
        var g_h = e_h;
        var offset_x = (w - e_w * num_w) * 0.5;
        var offset_y = (h - e_h * num_h) * 0.5;
        var startPos = new cc.Vec2(-this.grapGrid.node.width / 2, this.grapGrid.node.height / 2);
        var line_width = 5;

        this.grapGrid.lineWidth = line_width;

        var data_arr = this.map_data.getArrowDataArray();
        for (var i = 0; i < data_arr.length; i++) {
            //随机颜色
            var color = this.arrowColors[Math.floor(Math.random() * this.arrowColors.length)];
            this.grapGrid.strokeColor = color.clone();
            this.grapGrid.fillColor = color.clone();

            var arrow_data = data_arr[i];
            var path_arr = arrow_data["path"];
            var direction = arrow_data["direction"];

            for (var j = 0; j < path_arr.length; j++) {
                var point = path_arr[j];
                var x = point[0];
                var y = point[1];
                var px = e_w * (x + 0.5) + offset_x;
                var py = e_h * (y + 0.5) + offset_y;
                var s_x = px + startPos.x;
                var s_y = startPos.y - (py);

                if (j == 0) {
                    this.grapGrid.moveTo(s_x, s_y);
                }
                else {
                    this.grapGrid.lineTo(s_x, s_y);
                }
                this.grapGrid.stroke();

                if (j == path_arr.length - 1) {
                    var arrowPoints = this.calcArrowPoints(direction, new cc.Vec2(s_x, s_y), 10);
                    this.grapGrid.moveTo(s_x, s_y);
                    this.grapGrid.lineTo(arrowPoints[0].x, arrowPoints[0].y);
                    this.grapGrid.lineTo(arrowPoints[1].x, arrowPoints[1].y);
                    this.grapGrid.close();
                    this.grapGrid.fill();
                }

                this.grapGrid.stroke();
            }
        }

        //var str = this.mapdata.getTargetDataFormatString();
        //var obj = DCPMapData.CreateMapDataByStr(str);
        //cc.log(obj);

    }


    private calcArrowPoints(dir, arrowTipPos, arrowSize): Array<cc.Vec2> {
        const p1 = cc.v2(arrowTipPos.x, arrowTipPos.y);
        const p2 = cc.v2(arrowTipPos.x, arrowTipPos.y);
        const halfSize = arrowSize / 2;

        switch (dir) {
            case 0:
                p1.x -= halfSize; p1.y -= arrowSize;
                p2.x += halfSize; p2.y -= arrowSize;
                break;
            case 1:
                p1.x -= arrowSize; p1.y -= halfSize;
                p2.x -= arrowSize; p2.y += halfSize;
                break;
            case 2:
                p1.x -= halfSize; p1.y += arrowSize;
                p2.x += halfSize; p2.y += arrowSize;
                break;
            case 3:
                p1.x += arrowSize; p1.y -= halfSize;
                p2.x += arrowSize; p2.y += halfSize;
                break;
        }
        return [p1, p2];
    }
}//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 https://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 https://web3incubators.com/kefu.html