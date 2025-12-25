
const { ccclass, property } = cc._decorator;

@ccclass
export default class MapData {
    //[x: string]: any;

    public width: number = 0;
    public height: number = 0;

    currentDataString: string = "";
    max_arrow_lenght: number = -1;
    user_data: Array<any> = [];
    default_data: Array<any> = new Array();
    arrowDataArray: Array<any> = [];


    //地图自定义编辑时候使用
    current_selected_arrow_index = -1
    eidtArrowDataArray: Array<any> = [];


    //把关卡字符串数据转换为地图对象数据
    public static CreateMapDataByStr(data_str: string): Object {
        if (data_str.length < 1)
            return null;

        var arr = data_str.split(";");
        if (arr.length == 3) {
            var width = parseInt(arr[0]);
            var height = parseInt(arr[1]);
            var arrow_arr = new Array();
            var v_arr = arr[2].split("|");
            for (var i = 0; i < v_arr.length; i++) {
                var t_arr = v_arr[i].split(",");
                if (t_arr.length > 0) {
                    var path_arr = new Array();
                    for (var j = 0; j < t_arr.length; j++) {
                        var index = parseInt(t_arr[j]);
                        var x = Math.floor(index % width);
                        var y = Math.floor(index / width);
                        path_arr.push([x, y]);
                    }
                    arrow_arr.push(path_arr);
                }
            }

            return {
                width: width,
                height: height,
                arrow_arr: arrow_arr,
            }
        }
        return null;
    }


    public static CreateMapByArgs(w: number, h: number,  max_arrow_lenght: number = -1): MapData {
        //console.log("CreateMapBySize: " + w + ', ' + h);
        var mm = new MapData();
        mm.currentDataString = "";

        mm.width = w;
        mm.height = h;
        mm.max_arrow_lenght = max_arrow_lenght;
        if (mm.max_arrow_lenght < 0) {
            mm.max_arrow_lenght = (w + h) / 2;
        }

        //mm.loadData();
        return mm;
    }

    public loadData(is_auto_create_arrow: boolean = true): void {
        var puzzle_width = this.width;
        var puzzle_height = this.height;

        this.user_data = new Array();
        this.default_data = new Array(); //标注当前地图哪些可用
        this.arrowDataArray = new Array();//最终生成的箭头数据
        this.eidtArrowDataArray = new Array();//编辑时候使用

        for (var y = 0; y < this.height; y++) {
            this.user_data.push([]);
            this.default_data.push([]);
            for (var x = 0; x < this.width; x++) {
                this.user_data[y].push(0);
                this.default_data[y].push(0);
            }
        }

        if (is_auto_create_arrow) {
            this.createArrowData();
        }

        //cc.log("loadData: " + puzzle_width + ", " + puzzle_height);

    }



    private isViablePosition(x: number, y: number): boolean {
        if (x >= 0 && x < this.width && y >= 0 && y < this.height) {
            return true;
        }
        return false;
    }

    private isViablePositionIndex(index: number): boolean {
        if (index >= 0 && index < this.width * this.height) {
            return true;
        }
        return false;
    }


    private printData(): void {
        cc.log("user_data: " + this.user_data);
    }

    private printArray(arr: Array<Array<number>>): void {
        cc.log("=====printArray====");
        for (var y = 0; y < arr.length; y++) {
            cc.log(arr[y]);
        }
    }


    private isConnect(x1: number, y1: number, x2: number, y2: number): boolean {
        if (x1 == x2 && y1 == y2) {
            return false;
        }
        if (x1 == x2 || y1 == y2) {
            return true;
        }
        return false;
    }

    public userAction(index: number, actionType: number): boolean {
        var x = Math.floor(index % this.width);
        var y = Math.floor(index / this.width);
        
        if (actionType >=-1 && actionType <= 0) {
            this.user_data[y][x] = actionType;
            this.checkUserArrowValid(index, actionType);
        }
        else if (actionType == 1) {
            this.user_data[y][x] = actionType;
        }

        return false;
    }

    public userArrowAction(first_index:number, second_index:number) {
        var first_x = Math.floor(first_index % this.width);
        var first_y = Math.floor(first_index / this.width);
        var second_x = Math.floor(second_index % this.width);
        var second_y = Math.floor(second_index / this.width);   

        if(!this.isConnect(first_x, first_y, second_x, second_y)) {
            return;
        }
        for (var i = 0; i < this.eidtArrowDataArray.length; i++) {
            let path_arr = this.eidtArrowDataArray[i]["path"];
            let direction = this.eidtArrowDataArray[i]["direction"];

            if (path_arr.length == 0) {
                continue;
            }
            var start_point = path_arr[0];
            var s_x = start_point[0];
            var s_y = start_point[1];
            var last_point = path_arr[path_arr.length - 1];
            var l_x = last_point[0];
            var l_y = last_point[1];

            if (s_x == first_x && s_y == first_y) {
                path_arr.unshift([second_x, second_y]);
                return;
            }   
            if (l_x == first_x && l_y == first_y) {
                path_arr.push([second_x, second_y]);
                direction = this.getDirection(path_arr[path_arr.length - 2], path_arr[path_arr.length - 1]);
                if (direction != -1) {
                    this.eidtArrowDataArray[i]["direction"] = direction;
                }
                return;
            }
            for (var j = 1; j < path_arr.length - 1; j++) {
                var point = path_arr[j];
                var p_x = point[0];
                var p_y = point[1];
                if (p_x == first_x && p_y == first_y) {
                    return;
                }
            }
        }
        
        let new_arr = [
            [first_x, first_y],
            [second_x, second_y]
        ];
        let direction2 = this.getDirection(new_arr[0], new_arr[1]);
        if (direction2 != -1) {
            this.eidtArrowDataArray.push({
                path: new_arr,
                direction: direction2,
            });
        }
        return;

    }

    private checkUserArrowValid(index: number, actionType: number) {
        if (actionType == 0 || actionType == -1) {
            var first_x = Math.floor(index % this.width);
            var first_y = Math.floor(index / this.width);

            for (var i = 0; i < this.eidtArrowDataArray.length; i++) {
                let path_arr = this.eidtArrowDataArray[i]["path"];
                let direction = this.eidtArrowDataArray[i]["direction"];

                for (var j = 0; j < path_arr.length; j++){
                    var point = path_arr[j];
                    var p_x = point[0];
                    var p_y = point[1];
                    if (p_x == first_x && p_y == first_y) {
                        path_arr.splice(0, j+1);
                        if (path_arr.length == 1) {
                            this.eidtArrowDataArray.splice(i, 1);
                        }
                        break;
                    }
                }
                
            }
        }
    }

    public getUserData(x: number, y: number): number{
        if (this.isViablePosition(x, y)) {
            return this.user_data[y][x];
        }
        return 0;
    }


    

    public getTargetDataFormatString(): string {
        var user_arr = new Array();
        var data_arr = new Array();
        for (var i = 0; i < this.arrowDataArray.length; i++) {
            var arrow_data = this.arrowDataArray[i];
            var path_arr = arrow_data["path"];
            var direction = arrow_data["direction"];
            var tmp_arr = new Array();
            for (var j = 0; j < path_arr.length; j++) {
                var point = path_arr[j];
                var x = point[0];
                var y = point[1];
                var index = y * this.width + x;
                tmp_arr.push(index.toString());
            }
            data_arr.push(tmp_arr.join(","));
        }

        var output_str = "" + this.width + ";" + this.height + ";" + data_arr.join("|");
        cc.log("========== getTargetDataFormatString: " + output_str);
        return output_str;
    }



    public getArrowDataArray(): Array<Array<number>> {
        return this.arrowDataArray;
    }

    public getEditArrowDataArray(): Array<Array<number>> {
        return this.eidtArrowDataArray;
    }

    //拷贝用户编辑版数据到正式生成地图数据
    public createArrowDataWithUserData(): void {
        this.default_data = this.copyData(this.user_data);
        this.arrowDataArray = new Array();
        for (var i = 0; i < this.eidtArrowDataArray.length; i++) {
            let path_arr = this.eidtArrowDataArray[i]["path"];
            let direction = this.eidtArrowDataArray[i]["direction"];

            if (path_arr.length == 0) {
                continue;
            }
            var new_path = new Array();
            var has_right_path = true;
            for (var j = 0; j < path_arr.length; j++) {
                var point = path_arr[j];
                if (point && point.length == 2) {
                    let x = point[0];
                    let y = point[1];
                    new_path.push([x, y]);

                }
                else {
                    has_right_path = false;
                    break;
                }
            }
            if (!has_right_path) {
                continue;
            }
            var arrow_data = {
                path: new_path,
                direction: direction
            }

            this.arrowDataArray.push(arrow_data);
        }
        
        var arr = new Array();
        for (let y = 0; y < this.height; y++) {
            arr.push([]);
            for (let x = 0; x < this.width; x++) {
                if (this.user_data[y][x] <= 0) {
                    arr[y].push(this.user_data[y][x]);
                }
                else {
                    arr[y].push(0);
                }
            }
        }

        for (var i = 0; i < this.arrowDataArray.length; i++) {
            let path_arr = this.arrowDataArray[i]["path"];
            let direction = this.arrowDataArray[i]["direction"];

            if (path_arr.length == 0) {
                continue;
            }
            for (var j = 0; j < path_arr.length; j++) {
                var point = path_arr[j];
                if (point && point.length == 2) {
                    let x = point[0];
                    let y = point[1];
                    
                    arr[y][x] = 1;
                }
            }

        }
        this.default_data = arr;
        this.createArrowData();
    }

    //生成箭头数据
    private createArrowData():void {

        var empty_count = 0;
        while (true) {
            var one_line_data = this.createOneLineData();
            if (one_line_data == null) {
                empty_count++;
                if (empty_count > 5000) {
                    break;
                }
            }
            else {
                var path = one_line_data["path"];
                var new_data = one_line_data["new_data"];
                var direction = one_line_data["direction"];

                var arrow_data = {
                    path: path,
                    direction: direction
                }

                var left_count = this.testCurrentData(new_data, arrow_data, this.arrowDataArray);

                if (left_count == 0) {

                    this.arrowDataArray.push(arrow_data);
                    this.default_data = new_data;
                    //cc.log("left_count: " + left_count + ", arrow count: " + this.arrowDataArray.length);
                }
            }
        }
    }

    //测试当前数据是否可以继续生成箭头
    private testCurrentData(data: Array<Array<number>>, arrow_data: any, all_arrow_data: Array<Array<number>>): number {
        var new_data = this.copyData(data);
        var new_arrow_data = new Array();
        new_arrow_data.push(arrow_data);
        for (let i = 0; i < all_arrow_data.length; i++) {
            new_arrow_data.push(all_arrow_data[i]);
        }

        while (true) {
            if (new_arrow_data.length == 0) {
                break;
            }
            var has_run_out = false;
            for (let i = 0; i < new_arrow_data.length;) {
                var item = new_arrow_data[i];
                var path = item["path"];
                var direction = item["direction"];
                var point = path[path.length - 1];
                if (this.canRunOut(point, direction, new_data)) {
                    this.arrowRunOut(path, new_data);
                    new_arrow_data.splice(i, 1);
                    has_run_out = true;
                }
                else {
                    i++;
                }

            }
            if (!has_run_out) {
                break;
            }
        }
        return new_arrow_data.length;
    }


    //获取一条路径数据
    private createOneLineData(): object {
        var tmp_data = this.copyData(this.default_data);
        var path_arr = new Array();
        var current_p = this.getLineStartPoint(tmp_data);
        if (current_p == null) {
            return null;
        }
        tmp_data[current_p[1]][current_p[0]] = 1;
        path_arr.push(current_p);
        while (true) {
            let next_p = this.getNextPoint(current_p, tmp_data);
            if (next_p == null || path_arr.length > this.max_arrow_lenght) {
                break;
            }
            path_arr.unshift(next_p);
            //path_arr.push(next_p);
            tmp_data[next_p[1]][next_p[0]] = 1;
            current_p = next_p;
        }

        if (path_arr.length == 1) {
            tmp_data[current_p[1]][current_p[0]] = -1;
            return null;
        }
        if (path_arr.length <= 1) {
            return null;
        }

        var direction = this.getDirection(path_arr[path_arr.length - 2], path_arr[path_arr.length - 1]);
        if (direction == -1) {
            return null;
        }

        if (!this.isSelfValidPath(path_arr, direction)) {
            return null;
        }
        tmp_data[path_arr[path_arr.length - 1][1]][path_arr[path_arr.length - 1][0]] = 100 + direction;

        var canRunOut = this.canRunOut(path_arr[path_arr.length - 1], direction, tmp_data);
        if (!canRunOut) {
            if (this.isArrowConflictArrow(path_arr[path_arr.length - 1], direction, tmp_data)) {
                return null;
            }
        }

        return {
            path: path_arr,
            direction: direction,
            canRunOut: canRunOut,
            new_data: tmp_data
        }
    }

    //获取下一个点
    private getNextPoint(p: Array<number>, tmp_data: Array<Array<number>>): Array<number> {
        var px = p[0];
        var py = p[1];
        var volid_arr = new Array();

        if (px > 0 && tmp_data[py][px - 1] == 0) {
            volid_arr.push([px - 1, py]);
        }
        if (px < this.width - 1 && tmp_data[py][px + 1] == 0) {
            volid_arr.push([px + 1, py]);
        }
        if (py > 0 && tmp_data[py - 1][px] == 0) {
            volid_arr.push([px, py - 1]);
        }
        if (py < this.height - 1 && tmp_data[py + 1][px] == 0) {
            volid_arr.push([px, py + 1]);
        }

        if (volid_arr.length == 0) {
            return null;
        }

        var rand_index = Math.floor(Math.random() * volid_arr.length);
        return volid_arr[rand_index];
    }

    private getDirection(p1: Array<number>, p2: Array<number>): number {
        var px1 = p1[0];
        var py1 = p1[1];
        var px2 = p2[0];
        var py2 = p2[1];

        if (px1 == px2) {
            if (py1 > py2) {
                return 0;
            }
            else {
                return 2;
            }
        }
        else if (py1 == py2) {
            if (px1 > px2) {
                return 3;
            }
            else {
                return 1;
            }
        }
        return -1;
    }

    //判断有没有自己跟自己路径冲突
    private isSelfValidPath(path: Array<Array<number>>, direction: number): boolean {
        if (path.length < 2) {
            return false;
        }
        var arr = new Array();
        for (var y = 0; y < this.height; y++) {
            arr.push([]);
            for (var x = 0; x < this.width; x++) {
                arr[y].push(0);
            }
        }
        for (var i = 0; i < path.length; i++) {
            var p = path[i];
            arr[p[1]][p[0]] = 1;
        }

        return this.canRunOut(path[path.length - 1], direction, arr);
    }
    //判断有没有箭头跟箭头冲突
    private isArrowConflictArrow(p: Array<number>, direction: number, data: Array<Array<number>>) {
        let px = p[0];
        let py = p[1];

        if (direction == 0) {
            if (py == 0) {
                return false;
            }
            for (var y = py - 1; y >= 0; y--) {
                if (data[y][px] == 102) {
                    return true;
                }
            }
        }
        else if (direction == 1) {
            if (px == this.width - 1) {
                return false;
            }
            for (var x = px + 1; x < this.width; x++) {
                if (data[py][x] == 103) {
                    return true;
                }
            }
        }
        else if (direction == 2) {
            if (py == this.height - 1) {
                return false;
            }
            for (var y = py + 1; y < this.height; y++) {
                if (data[y][px] == 100) {
                    return true;
                }
            }
        }
        else if (direction == 3) {
            if (px == 0) {
                return false;
            }
            for (var x = px - 1; x >= 0; x--) {
                if (data[py][x] == 101) {
                    return true;
                }
            }
        }

        return false;
    }
    //判断箭头是否可以出去
    private canRunOut(p: Array<number>, direction: number, data: Array<Array<number>>): boolean {
        //direction 0: up, 1: right, 2: down, 3: left
        if (!p || p.length != 2) {
            return false;
        }
        let px = p[0];
        let py = p[1];

        if (direction == 0) {
            if (py == 0) {
                return true;
            }
            for (var y = py - 1; y >= 0; y--) {
                if (data[y][px] > 0) {
                    return false;
                }
            }
        }
        else if (direction == 1) {
            if (px == this.width - 1) {
                return true;
            }
            for (var x = px + 1; x < this.width; x++) {
                if (data[py][x] > 0) {
                    return false;
                }
            }
        }
        else if (direction == 2) {
            if (py == this.height - 1) {
                return true;
            }
            for (var y = py + 1; y < this.height; y++) {
                if (data[y][px] > 0) {
                    return false;
                }
            }
        }
        else if (direction == 3) {
            if (px == 0) {
                return true;
            }
            for (var x = px - 1; x >= 0; x--) {
                if (data[py][x] > 0) {
                    return false;
                }

            }
        }

        return true;
    }
    //箭头出去
    private arrowRunOut(path: Array<Array<number>>, data: Array<Array<number>>) {
        for (var i = 0; i < path.length; i++) {
            var p = path[i];
            data[p[1]][p[0]] = 0;
        }
    }
    private getLineStartPoint(data): Array<number> {
        var arr = this.getCurrentEmptyPointArray(data);
        if (arr.length == 0) {
            return null;
        }
        var index = Math.floor(Math.random() * arr.length);
        var p = arr[index];
        return p;
    }

    private getCurrentEmptyPointArray(data: Array<Array<number>>): Array<Array<number>> {
        var arr = new Array();
        for (var y = 0; y < this.height; y++) {
            for (var x = 0; x < this.width; x++) {
                if (data[y][x] == 0) {
                    arr.push([x, y]);
                }
            }
        }
        return arr;
    }

    private copyData(data: Array<Array<number>>): Array<Array<number>> {
        var arr = new Array();
        for (var y = 0; y < this.height; y++) {
            arr.push([]);
            for (var x = 0; x < this.width; x++) {
                arr[y].push(data[y][x]);
            }
        }
        return arr;
    }

}


