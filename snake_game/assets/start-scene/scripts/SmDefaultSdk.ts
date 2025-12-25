import { _decorator } from "cc";
import { RegSmSdk, BaseSdk } from "./BaseSdk";

export class SmDefaultSdk extends BaseSdk {
    get sdk() {
        return null;
    }

    get name() {
        return "default";
    }
}

RegSmSdk(SmDefaultSdk);
