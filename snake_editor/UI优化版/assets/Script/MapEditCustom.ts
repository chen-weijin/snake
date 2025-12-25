import MapData from "./MapData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class MapEditCustom extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    default_size_arr = [[9, 15], [15, 25], [21, 35], [30, 50], [42, 70]];
    map_data: MapData = null;
    puzzle_width = 0;
    puzzle_height = 0;

    current_action_type = 0;

    private is_move_action: boolean = false;
    private start_touch_pos: cc.Vec2 = null;
    private selectedIndex: number = -1;

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
        this.node.on(cc.Node.EventType.TOUCH_START, function (event: cc.Event.EventTouch) {
            this.onTouchStart(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_MOVE, function (event: cc.Event.EventTouch) {
            this.onTouchMove(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_END, function (event: cc.Event.EventTouch) {
            this.onTouchEnd(event);
        }, this);

        this.node.on(cc.Node.EventType.TOUCH_CANCEL, function (event: cc.Event.EventTouch) {
            this.onTouchCancel(event);
        }, this);

        this.updateBottomDisplay();
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
            this.puzzle_width = size_arr[0];
            this.puzzle_height = size_arr[1];
            this.map_data = MapData.CreateMapByArgs(size_arr[0], size_arr[1]);
            this.map_data.loadData(false);

            this.current_action_type = -1;
            this.updateBottomDisplay();
            this.updateEditMapDisplay();
        }
    }

    onBtnClick03(event, customData) {
        console.log(`onBtnClick: ${customData}`);
        var index = parseInt(customData);
        this.current_action_type = index;

        if (index == 3) {
            this.map_data.createArrowDataWithUserData();
            this.updateMapDisplay();
            this.map_data.getTargetDataFormatString();
        }
        else if (index == 4) {
            this.current_action_type = -1;
            this.updateEditMapDisplay();
        }

        this.updateBottomDisplay();
    }

    updateEditMapDisplay() {
        this.grapGrid.node.active = true;
        this.grapGrid.clear();

        this.drawLine();
        this.drawGirdPoint();
        this.drawEditData();
        this.drawPathArrow(this.map_data.getEditArrowDataArray());
    }

    updateMapDisplay() {
        this.grapGrid.node.active = true;
        this.grapGrid.clear();

        this.drawGirdPoint();
        this.drawPathArrow(this.map_data.getArrowDataArray());
    }

    updateBottomDisplay() {
        if (this.current_action_type == 3) {
            this.node.getChildByName("bottomNode").getChildByName("btn01").active = false;
            this.node.getChildByName("bottomNode").getChildByName("btn02").active = false;
            this.node.getChildByName("bottomNode").getChildByName("btn03").active = false;
            this.node.getChildByName("bottomNode").getChildByName("btn05").active = true;
        }
        else {
            this.node.getChildByName("bottomNode").getChildByName("btn01").active = true;
            this.node.getChildByName("bottomNode").getChildByName("btn02").active = true;
            this.node.getChildByName("bottomNode").getChildByName("btn03").active = true;
            this.node.getChildByName("bottomNode").getChildByName("btn05").active = false;
        }
    }

    public drawLine() {
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
        var line_width = 3;


        this.grapGrid.strokeColor = darkBlue;
        this.grapGrid.fillColor = cc.Color.YELLOW.clone();
        this.grapGrid.lineWidth = line_width;

        for (var x = 0; x <= num_w; x++) {
            var px = e_w * x + offset_x;
            var py = offset_y;
            var s_x = px + startPos.x;
            var s_y = startPos.y - (py);
            var e_x = s_x;
            var e_y = s_y - e_h * num_h;

            this.grapGrid.moveTo(s_x, s_y + line_width / 2.0);
            this.grapGrid.lineTo(s_x, e_y - line_width / 2.0);
            this.grapGrid.stroke();
        }
        for (var y = 0; y <= num_h; y++) {
            var px = offset_x;
            var py = e_h * y + offset_y;
            var s_x = px + startPos.x;
            var s_y = startPos.y - (py);
            var e_x = s_x + e_w * (num_w);
            var e_y = s_y;

            this.grapGrid.moveTo(s_x - line_width / 2.0, s_y);
            this.grapGrid.lineTo(e_x + line_width / 2.0, s_y);
            this.grapGrid.stroke();
        }
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

        var e_w = Math.min(w * 0.98 / num, w * 0.33);
        var e_h = e_w;
        var g_w = e_w;
        var g_h = e_h;
        var offset_x = (w - e_w * num_w) * 0.5;
        var offset_y = (h - e_h * num_h) * 0.5;
        var startPos = new cc.Vec2(-this.grapGrid.node.width / 2, this.grapGrid.node.height / 2);
        var line_width = 3;



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

    private drawPathArrow(data_arr) {
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

    private drawEditData() {
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
        var line_width = 3;



        this.grapGrid.strokeColor = cc.Color.BLACK.clone();
        this.grapGrid.fillColor = cc.Color.BLACK.clone();
        this.grapGrid.lineWidth = line_width;
        for (var i = 0; i < num_h; i++) {
            for (var j = 0; j < num_w; j++) {
                var px = e_w * (j) + offset_x;
                var py = e_h * (i) + offset_y;
                var s_x = px + startPos.x;
                var s_y = startPos.y - (py);
                var s_r = 3;

                var user_value = this.map_data.getUserData(j, i);
                if (user_value == -1) {
                    this.grapGrid.rect(s_x, s_y - e_h, e_w, e_h);
                    this.grapGrid.fill();
                }
            }
        }
        this.grapGrid.stroke();
    }


    private onTouchStart(event: cc.Event.EventTouch): void {
        if (this.current_action_type > 1)
            return;
        console.log('Mouse onTouchStart:');
        var end_pos = this.grapGrid.node.convertToNodeSpaceAR(event.getLocation()) as cc.Vec2;
        var end_key = this.locationGirdIndex(end_pos);
        this.selectedIndex = end_key;

        this.is_move_action = false;
        this.start_touch_pos = this.node.convertToNodeSpaceAR(event.getLocation()) as cc.Vec2;

        if (this.selectedIndex != -1) {
            this.map_data.userAction(this.selectedIndex, this.current_action_type);
            this.updateEditMapDisplay();
        }

    }

    private onTouchMove(event: cc.Event.EventTouch): void {
        if (this.current_action_type > 1)
            return;
        //console.log('Mouse onTouchMove:');
        this.is_move_action = true;
        var end_pos = this.grapGrid.node.convertToNodeSpaceAR(event.getLocation()) as cc.Vec2;
        var end_key = this.locationGirdIndex(end_pos);

        if (end_key != -1 && end_key != this.selectedIndex) {
            this.map_data.userAction(end_key, this.current_action_type);

            if (this.current_action_type == 1) {//编辑箭头
                this.map_data.userArrowAction(this.selectedIndex, end_key);
            }
            this.selectedIndex = end_key;
            this.updateEditMapDisplay();
        }

    }

    private onTouchEnd(event: cc.Event.EventTouch): void {
        console.log('Mouse onTouchEnd:');
    }

    private onTouchCancel(event: cc.Event.EventTouch): void {
        console.log('Mouse onTouchCancel:');
    }

    public locationGirdIndex(node_pos: cc.Vec2): number {
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

        var px = node_pos.x - startPos.x;
        var py = startPos.y - node_pos.y;
        var x = Math.floor((px - offset_x) / e_w);
        var y = Math.floor((py - offset_y) / e_h);

        if (x >= 0 && x < num_w && y >= 0 && y < num_h) {
            return y * num_w + x;
        }
        return -1;
    }

}//电子邮件puhalskijsemen@gmail.com
//源码网站 开vpn全局模式打开 https://web3incubators.com/
//电报https://t.me/gamecode999
//网页客服 https://web3incubators.com/kefu.html