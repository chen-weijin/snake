export enum SdkInnerEvent {
    None = "none",
    BeforeLoad = "before_load",
    OnSdkLoadDone = "sdk_load_done",
    OnPanelUILoadDone = "panel_load_done",
    OnRemoteConfigLoadDone = "remote_config_load_done",
    OnLevelStart = "level_start",
    OnLevelEnd = "level_end",
    OnPanelShow = "panel_show ",
    DeleteAccount = "delete_account",
    LoginAccount = "login_account",
    OnGameLoadDone = "game_load_done ",
    OnBoxTriggered = "box_triggered ",
    onBoxClosed = "box_closed",
    OnRewardADStart = "reward_start",
    OnRewardADLoad = "reward_load",
    OnRewardADSuccess = "reward_success",
    OnGetPlayerInfo = "get_player_info",
    OnAuthorize = "authorize",
    OnRefreshLoginState = "refresh_login_state",
    OnRewardADSuccessSdk = "reward_success_sdk",
    OnRewardADStartSdk = "reward_start_sdk",
    NewUserEnterGame = "NewUserEnterGame",
    UserEnterLevel = "UserEnterLevel",
    FinishLevel = "FinishLevel",
    FailLevel = "FailLevel",
    LoadingSdk = "LoadingSdk",
    ActiveHours = "ActiveHours",
    ActiveDays = "ActiveDays",
}

class SdkEventManager {
    eventMap = new Map();

    on(e, t, n?) {
        if (!this.eventMap.has(e)) {
            this.eventMap.set(e, new Map());
        }
        this.eventMap.get(e).set(t, n);
    }

    emit(e, ...args) {
        console.log(`%csmile---需要注意---> `, "color: red; font-size:16px");
        if (this.eventMap.has(e)) {
            const t = this.eventMap.get(e);
            const n = Array.from(t.entries());
            for (let a = 0; a < n.length; a++) {
                const pair = n[a];
                const u = pair[0];
                const c = pair[1];
                if (c) u.apply(c, args);
                else u.apply(undefined, args);
            }
        }
    }

    off(e, t) {
        if (this.eventMap.has(e)) {
            const m = this.eventMap.get(e);
            m.delete(t);
            if (m.size === 0) this.eventMap.delete(e);
        }
    }

    offAll(e) {
        this.eventMap.delete(e);
    }

    clear() {
        this.eventMap.clear();
    }
}

export const sdkEventManager = new SdkEventManager();
