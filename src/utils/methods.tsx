import React from "react";
import { EventData } from "../types";

/** 建構事件彈窗資訊
 * Compose EvnetCrad Popover Content */
export function getEventPopoverContent(event: EventData) {
    var popoverContent = [];

    // Evnet Title
    popoverContent.push(
        <h1
            key="et"
            style={{
                color: "white",
                fontSize: 18,
                fontWeight: 3000,
                lineHeight: 1.5,
            }}
        >
            {event.title}
        </h1>
    );

    // Ignore Reason
    if (event.ignore)
        popoverContent.push(
            <p style={{ color: "rgba(255,255,255,0.5)" }} key="ir">
                該事件已被忽略，因為{event.ignoreReason}{" "}
            </p>
        );

    // Duration
    if (!event.isAllDayEvent()) popoverContent.push(<p key="ds">{event.getDurationString()}</p>);

    // Location
    if (event.location !== "")
        popoverContent.push(
            <p key="lc" style={{ marginTop: 10 }}>
                {event.location}{" "}
            </p>
        );

    // Description
    if (event.description !== "")
        popoverContent.push(
            <p key="dc" style={{ marginTop: 10 }}>
                {event.description}{" "}
            </p>
        );

    return popoverContent;
}

/** 用卡片高度計算卡片要顯示幾行資訊
 * Calculate the line Amount of Event Card Info */
export function getLineAmount(event: EventData, height: number) {
    return height >= 0
        ? Math.floor(height / 20) > 1
            ? Math.floor(height / 20) - 1
            : 1
        : Math.floor(event.getDuration() / 20) > 1
        ? Math.floor(event.getDuration() / 20) - 1
        : 1;
}

/** 建構事件卡片資訊
 * Compose Info in EvnetCrad */
export function getEventCardInfo(event: EventData) {
    var eventInfo = [];

    // 標題與時間
    eventInfo.push(
        event.isAllDayEvent() ? (
            <p key="title" style={{ color: "white", fontSize: 12, fontWeight: "bolder" }}>
                {event.title}{" "}
            </p>
        ) : (
            <p key="title" style={{ color: "white", fontSize: 12, fontWeight: "bolder" }}>
                {event.title}{" "}
                <strong
                    style={{
                        marginLeft: 16,
                        color: "rgba(255,255,255,0.4)",
                        fontSize: 12,
                    }}
                >
                    {event.getDurationString()}
                </strong>
            </p>
        )
    );

    // 補充敘述
    if (event.description !== "")
        eventInfo.push(
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "bold" }} key="description">
                {event.description}
            </p>
        );

    // 地點
    if (event.location !== "")
        eventInfo.push(
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "bold" }} key="location">
                {event.location}
            </p>
        );

    // 時間長度
    if (!event.isAllDayEvent())
        eventInfo.push(
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, fontWeight: "bold" }} key="duration">
                {event.getDuration()} 分鐘
            </p>
        );

    return eventInfo;
}

/*
export function buildRepeatToEvent(userdata: User, date: Date) {
    return new Promise<{ data: User; changed: boolean }>((resolve) => {
        date.setHours(12, 0);
        var changed = false;
        var newdata = new User(userdata);
        newdata.calendars.map((calendar) => {
            calendar.repeats.map((repeat) => {
                repeat = new Repeat(repeat);
                repeat.startDate.setHours(12, 0);
                repeat.endDate.setHours(12, 0);
                if (date.getTime() - repeat.startDate.getTime() >= 0 && repeat.endDate.getTime() - date.getTime() >= 0) {
                    if (
                        repeat.cycle === "Week" &&
                        date.getDay() === +repeat.repeatData &&
                        !repeat.generated.includes(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate())
                    ) {
                        changed = true;
                        repeat.generated.push(date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + date.getDate());
                        var startTime = new Date(date);
                        var endTime = new Date(date);
                        startTime.setHours(repeat.startTime.getHours(), repeat.startTime.getMinutes());
                        endTime.setHours(repeat.endTime.getHours(), repeat.endTime.getMinutes());
                        calendar.events.push(
                            createEvent(repeat.name, calendar.color, startTime, endTime, repeat.id, false, false, "", "", calendar.title)
                        );
                    } else if (
                        repeat.cycle === "Month" &&
                        date.getDate() === +repeat.repeatData &&
                        !repeat.generated.includes(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate())
                    ) {
                        changed = true;
                        repeat.generated.push(date.getFullYear() + "/" + date.getMonth() + "/" + date.getDate());
                        startTime = new Date(date);
                        endTime = new Date(date);
                        startTime.setHours(repeat.startTime.getHours(), repeat.startTime.getMinutes());
                        endTime.setHours(repeat.endTime.getHours(), repeat.endTime.getMinutes());
                        calendar.events.push(
                            createEvent(repeat.name, calendar.color, startTime, endTime, repeat.id, false, false, "", "", calendar.title)
                        );
                    }
                }

                return null;
            });

            return null;
        });
        resolve({ data: newdata, changed: changed });
    });
}*/
