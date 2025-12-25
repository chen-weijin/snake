import { _decorator } from "cc";

export enum APPanelId {
    Default = 0,
    APAdPopPanel = 1001,
    APClickPanel = 1002,
    APCommonPanel = 1003,
    APDebugPanel = 1004,
    APGamePanel = 1005,
    APMenuPanel = 1006,
    APRevivePanel = 1007,
    APSettingPanel = 1008,
    APWinPanel = 1009,
    APGuidePanel = 1010,
    APShiwanRestartPanel = 2001,
}

export enum APEResConfig {
    InitialRes = 10001,
    PowerResumeMax = 10002,
    FightPowerCost = 10003,
    PowerResume = 10004,
    PowerMax = 10005,
    PowerADDailyLimit = 10006,
    PowerADPerAdd = 10007,
}

export enum APEResId {
    Gold = 1001,
    Power = 1002,
}

export enum APADCusEvent {
    AD_AddPower = "ad1001",
    AD_ReviveTime = "ad1002",
    AD_ReviveHp = "ad1003",
}

export enum APEGuideStep {
    ClickGuide1 = "guide1001",
    ClickGuide2 = "guide1002",
    ZoomGuide = "guide1003",
    End = "guide1999",
}

export enum APCusEvent {
    LevelStartPeople = "level101",
    LevelStartTimes = "level102",
    LevelCompleteTimes = "level103",
    LevelAdCount = "level104",
}

export enum ApBodyType {
    Body = 0,
    Head = 1,
    Tail = 2,
    TailEnd = 3,
}

export enum APUIItemType {
    None = 0,
    Remove = 1,
    Eraser = 2,
    Hint = 3,
}

export enum APFeedType {
    FeedType1 = "虚假宣传",
    FeedType2 = "存档丢失",
    FeedType3 = "游戏卡死",
    FeedType4 = "无法看广告",
}
