import { BattleCtrl } from './BattleControl';
import { MapManager } from './MapManager';

export class BattleGlobal {
    get ctrl() {
        return BattleCtrl.instance();
    }

    get map() {
        return MapManager.instance;
    }
}

window.btl = new BattleGlobal();
