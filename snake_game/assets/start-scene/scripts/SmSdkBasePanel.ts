import { Component } from "cc";

export class SmSdkBasePanel extends Component {
    initialize() {
        this.init();
    }

    init() {}

    close() {
        this.node.active = false;
    }
}
