import React from "react";
import { Divider } from "rsuite";

const defaultEvent: Event = {
    startTime: new Date(),
    endTime: new Date(),
    location: "",
    description: "",
    id: "",
    calendarTitle: "",
    ignore: true,
    ignoreReason: "",
    repeatID: "",
    isEmpty: true,
    title: "",
    color: [""],
    /** 事件開始的時間與當日 0 時相距的分鐘數 */
    getBeginDistanse(): number {
        return this.startTime.getHours() * 60 + this.startTime.getMinutes();
    },
    /** 事件結束的時間與當日 0 時相距的分鐘數 */
    getEndDistanse(): number {
        return this.endTime.getHours() * 60 + this.endTime.getMinutes();
    },
    /** 從當天凌晨到事件開始的分鐘數 */
    getDurationBetweenDayBegin(): number {
        return this.startTime.getHours() * 60 + this.startTime.getMinutes();
    },
    getDurationBetweenDayEnd(): number {
        return (23 - this.endTime.getHours()) * 60 + (60 - this.endTime.getMinutes());
    },
    getDuration(): number {
        return this.endTime.getHours() * 60 + this.endTime.getMinutes() - this.startTime.getHours() * 60 - this.startTime.getMinutes();
    },
    isAllDayEvent() {
        return this.getDuration() >= 1440;
    },
    getStartTimeSrting() {
        return this.startTime.getHours() + ":" + (this.startTime.getMinutes() < 10 ? "0" : "") + this.startTime.getMinutes();
    },
    getEndTimeSting() {
        return this.endTime.getHours() + ":" + (this.endTime.getMinutes() < 10 ? "0" : "") + this.endTime.getMinutes();
    },
    getDurationString() {
        return this.getStartTimeSrting() + " - " + this.getEndTimeSting();
    },

    /** 建構事件彈窗資訊
     * Compose EvnetCrad Popover Content */
    getPopoverContent() {
        var popoverContent = [];

        // Calendar Title
        popoverContent.push(<p>{this.calendarTitle}</p>);

        // Evnet Title
        popoverContent.push(
            <h1
                key="et"
                style={{
                    color: "white",
                    fontSize: 18,
                    fontWeight: 3000,
                    lineHeight: 1.5
                }}
            >
                {this.title}
            </h1>
        );

        // Ignore Reason
        if (this.ignore)
            popoverContent.push(
                <p style={{ color: "rgba(255,255,255,0.5)" }} key="ir">
                    該事件已被忽略，因為{this.ignoreReason}{" "}
                </p>
            );

        // Duration
        if (!this.isAllDayEvent()) popoverContent.push(<p>{this.getDurationString()}</p>);

        // Location
        if (this.location !== "")
            popoverContent.push(
                <p key="lc" style={{ marginTop: 10 }}>
                    {this.location}{" "}
                </p>
            );

        // Description
        if (this.description !== "")
            popoverContent.push(
                <p key="dc" style={{ marginTop: 10 }}>
                    {this.description}{" "}
                </p>
            );

        return popoverContent;
    }
};

export class Event {
    startTime: Date;
    endTime: Date;
    location: string;
    description: string;
    id: string;
    calendarTitle: string;
    ignore: boolean;
    ignoreReason: string;
    repeatID: string;
    isEmpty: boolean;
    title: string;
    color: Array<string>;

    constructor(JSONObject: Event = defaultEvent) {
        this.startTime = new Date(JSONObject.startTime);
        this.endTime = new Date(JSONObject.endTime);
        this.location = JSONObject.location === undefined ? "" : JSONObject.location;
        this.description = JSONObject.description === undefined ? "" : JSONObject.description;
        this.id = JSONObject.id === "" ? generateUUID() : JSONObject.id;
        this.calendarTitle = JSONObject.calendarTitle === undefined ? "" : JSONObject.calendarTitle;
        this.ignore = JSONObject.ignore === undefined ? false : JSONObject.ignore;
        this.ignoreReason = JSONObject.ignoreReason === (undefined || "") ? "" : JSONObject.ignoreReason;
        this.repeatID = JSONObject.repeatID === undefined ? "" : JSONObject.repeatID;
        this.isEmpty = JSONObject.isEmpty;
        this.title = JSONObject.title;
        this.color = JSONObject.color;
    }

    /** 事件開始的時間與當日 0 時相距的分鐘數 */
    getBeginDistanse(): number {
        return this.startTime.getHours() * 60 + this.startTime.getMinutes();
    }
    /** 事件結束的時間與當日 0 時相距的分鐘數 */
    getEndDistanse(): number {
        return this.endTime.getHours() * 60 + this.endTime.getMinutes();
    }
    /** 從當天凌晨到事件開始的分鐘數 */
    getDurationBetweenDayBegin(): number {
        return this.startTime.getHours() * 60 + this.startTime.getMinutes();
    }

    /** 從事件結束到當天結束的分鐘數 */
    getDurationBetweenDayEnd(): number {
        return (23 - this.endTime.getHours()) * 60 + (60 - this.endTime.getMinutes());
    }

    getDuration(): number {
        return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 60000);
    }

    isAllDayEvent() {
        return this.getDuration() >= 1438;
    }

    getStartTimeSrting() {
        return this.startTime.getHours() + ":" + (this.startTime.getMinutes() < 10 ? "0" : "") + this.startTime.getMinutes();
    }

    getEndTimeSting() {
        return this.endTime.getHours() + ":" + (this.endTime.getMinutes() < 10 ? "0" : "") + this.endTime.getMinutes();
    }

    getDurationString() {
        return this.getStartTimeSrting() + " ~ " + this.getEndTimeSting();
    }

    /** 建構事件彈窗資訊
     * Compose EvnetCrad Popover Content */
    getPopoverContent() {
        var popoverContent = [];

        // Ignore Reason
        if (this.ignore)
            popoverContent.push(
                this.ignoreReason !== "" ? (
                    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }} key="ir">
                        該事件已被忽略，因為{this.ignoreReason}
                    </p>
                ) : (
                    <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: 16 }} key="ir">
                        該事件已被忽略
                    </p>
                )
            );

        popoverContent.push( !this.isAllDayEvent() ?
            <div style={{marginTop: 18}}>
                <p style={{display: "inline-block"}}>時間</p>
                <h5 style={{marginLeft: 8, display: "inline-block"}}>{this.getDurationString()}</h5>
            </div> : <div style={{marginTop: 18}}>
                <p style={{display: "inline-block"}}>全天事件</p>
            </div>
        );

        // Location
        if (this.location !== "")
            popoverContent.push(
                <div style={{marginTop: 18}}>
                <p style={{display: "inline-block"}}>地點</p>
                <h5 style={{marginLeft: 8, display: "inline-block"}}>{this.location}</h5>
            </div>
            );

        // Description
        if (this.description !== "")
            popoverContent.push(
                <div style={{marginTop: 18}}>
                    <Divider />
                <h5 style={{ display: "inline-block"}}>{this.description}</h5>
            </div>
            );

        return popoverContent;
    }
}

const defaultRepeat: Repeat = {
    id: "",
    name: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    cycle: "",
    repeatData: 0,
    generated: [],
    calendarTitle: "",
    location: "",
    description: ""
};

export class Repeat {
    id: string;
    name: string;
    startDate: Date;
    endDate: Date;
    startTime: Date;
    endTime: Date;
    cycle: string;
    repeatData: number;
    generated: Array<string>;
    calendarTitle: string;
    description: string;
    location: string;

    constructor(JSONObject: Repeat = defaultRepeat) {
        this.id = JSONObject.id === "" ? generateUUID() : JSONObject.id;
        this.name = JSONObject.name;
        this.startDate = new Date(JSONObject.startDate);
        this.endDate = new Date(JSONObject.endDate);
        this.startTime = new Date(JSONObject.startTime);
        this.endTime = new Date(JSONObject.endTime);
        this.cycle = JSONObject.cycle;
        this.repeatData = JSONObject.repeatData;
        this.generated = JSONObject.generated === undefined ? [] : JSONObject.generated;
        this.calendarTitle = JSONObject.calendarTitle;
        this.description = JSONObject.description;
        this.location = JSONObject.location;
    }
}

const defaultCalendar: Calendar = {
    title: "",
    color: ["#ffffff", "#ffffff"],
    label: "",
    events: [],
    repeats: []
};

export class Calendar {
    title: string;
    color: Array<string>;
    label: string;
    events: Array<Event>;
    repeats: Array<Repeat>;

    constructor(JSONObject: Calendar = defaultCalendar) {
        this.title = JSONObject.title;
        this.color = JSONObject.color;
        this.label = this.title;
        this.events = JSONObject.events.map(event => {
            event.calendarTitle = this.title;
            return new Event(event);
        });
        this.repeats =
            JSONObject.repeats === undefined
                ? []
                : JSONObject.repeats.map(repeat => {
                      repeat.calendarTitle = this.title;
                      return new Repeat(repeat);
                  });
    }
}

const defaultUser: User = {
    username: "",
    calendars: []
};

export class User {
    username: string;
    calendars: Array<Calendar>;

    constructor(JSONObject: User = defaultUser) {
        this.username = JSONObject.username;
        this.calendars = JSONObject.calendars.map(calendar => {
            return new Calendar(calendar);
        });
    }
}

/** 產生一組 UUID 給物件使用 */
function generateUUID() {
    var d = Date.now();
    if (typeof performance !== "undefined" && typeof performance.now === "function") {
        d += performance.now();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
    });
}
