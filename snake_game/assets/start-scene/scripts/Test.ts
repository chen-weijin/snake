import { _decorator, Node, Component } from "cc";

const { ccclass, property } = _decorator;

@ccclass("Test")
export class Test extends Component {
    @property({ type: Node })
    dotsParent = null;

    start() {}

    update(e) {}

    lottoEnd() {
        console.log("抽奖完成！！");
    }
}
