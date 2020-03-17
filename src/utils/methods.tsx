import { Notification } from 'rsuite';
import { Event, Calendar, Repeat, User } from './classes';
import React from 'react';
import { apiURL } from './config';

/** 更新使用者資料 */
export function updateUserData(data: User) {
    return fetch(apiURL + '/update', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/** 取得使用者資料 */
export function getUserData(id: string) {
    return new Promise((resolve, reject) => {
        fetch(apiURL + '/userdata/' + id)
            .then(response => response.json())
            .then(response => {
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
        return null;
    });
}

/** 產生一組 UUID 給任意物件使用 */
export function generateUUID() {
    var d = Date.now();
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
}

/** 建構事件彈窗資訊
 * Compose EvnetCrad Popover Content */
export function getEventPopoverContent(event: Event) {
    var popoverContent = [];

    // Calendar Title
    popoverContent.push(<p key="ct">{event.calendarTitle}</p>);

    // Evnet Title
    popoverContent.push(
        <h1
            key="et"
            style={{
                color: 'white',
                fontSize: 18,
                fontWeight: 3000,
                lineHeight: 1.5
            }}
        >
            {event.title}
        </h1>
    );

    // Ignore Reason
    if (event.ignore)
        popoverContent.push(
            <p style={{ color: 'rgba(255,255,255,0.5)' }} key="ir">
                該事件已被忽略，因為{event.ignoreReason}{' '}
            </p>
        );

    // Duration
    if (!event.isAllDayEvent())
        popoverContent.push(<p>{event.getDurationString()}</p>);

    // Location
    if (event.location !== '')
        popoverContent.push(
            <p key="lc" style={{ marginTop: 10 }}>
                {event.location}{' '}
            </p>
        );

    // Description
    if (event.description !== '')
        popoverContent.push(
            <p key="dc" style={{ marginTop: 10 }}>
                {event.description}{' '}
            </p>
        );

    return popoverContent;
}

/** 用卡片高度計算卡片要顯示幾行資訊
 * Calculate the line Amount of Event Card Info */
export function getLineAmount(event: Event, height: number) {
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
export function getEventCardInfo(event: Event) {
    var eventInfo = [];

    // 標題與時間
    eventInfo.push(
        event.isAllDayEvent() ? (
            <p
                key="title"
                style={{ color: 'white', fontSize: 12, fontWeight: 'bolder' }}
            >
                {event.title}{' '}
            </p>
        ) : (
            <p key="title" style={{ color: 'white', fontSize: 12, fontWeight: 'bolder' }}>
                {event.title}{' '}
                <strong
                    style={{
                        marginLeft: 16,
                        color: 'rgba(255,255,255,0.4)',
                        fontSize: 12
                    }}
                >
                    {event.getDurationString()}
                </strong>
            </p>
        )
    );

    // 補充敘述
    if (event.description !== '')
        eventInfo.push(
            <p
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold' }}
                key="description"
            >
                {event.description}
            </p>
        );

    // 地點
    if (event.location !== '')
        eventInfo.push(
            <p
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold' }}
                key="location"
            >
                {event.location}
            </p>
        );

    // 時間長度
    if (!event.isAllDayEvent())
        eventInfo.push(
            <p
                style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold' }}
                key="duration"
            >
                {event.getDuration()} 分鐘
            </p>
        );

    // 行事曆標題
    eventInfo.push(
        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12, fontWeight: 'bold' }} key="cal">
            {event.calendarTitle}
        </p>
    );
    return eventInfo;
}

/**
 * 將時間物件和今天日期比對來返回中文的時間敘述.
 *
 * @param {Date} date 想要拿來和今天比較的日期.
 */
export function getDayDescription(date: Date) {
    var dayDescription = '';
    var DayA = new Date(date);
    var DayB = new Date();
    DayA.setHours(12, 0, 0);
    DayB.setHours(12, 0, 0);
    if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) < 0) {
        if (
            DayA.getFullYear() === DayB.getFullYear() &&
            DayA.getMonth() === DayB.getMonth() &&
            DayA.getDate() === DayB.getDate()
        )
            dayDescription = '今天';
        else if (
            DayA.getFullYear() === DayB.getFullYear() &&
            DayA.getMonth() === DayB.getMonth() &&
            DayA.getDate() + 1 === DayB.getDate()
        )
            dayDescription = '昨天';
        else if (
            DayA.getFullYear() === DayB.getFullYear() &&
            DayA.getMonth() === DayB.getMonth() &&
            DayA.getDate() + 2 === DayB.getDate()
        )
            dayDescription = '前天';
        else
            dayDescription =
                Math.floor((DayA.getTime() - DayB.getTime()) / 3600000 / -24) +
                ' 天前';
    } else {
        if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) === 0)
            dayDescription = '今天';
        else if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) === 23)
            dayDescription = '明天';
        else if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) === 47)
            dayDescription = '後天';
        else
            dayDescription =
                Math.floor((DayA.getTime() - DayB.getTime()) / 3600000 / 24) +
                1 +
                ' 天後';
    }
    return dayDescription;
}

/** 顯示錯誤訊息 */
export function displayError(title: string, message: string) {
    Notification['error']({
        title: title,
        description: message
    });
}

/** 返回特定日期的 0 點 0 分 */
export function startOfDay(date: Date) {
    var time = new Date();
    time.setTime(date.getTime());
    time.setHours(0, 0, 0);
    return time;
}

/** 返回特定日期的 23 點 59 分 */
export function endOfDay(date: Date) {
    var time = new Date();
    time.setTime(date.getTime());
    time.setHours(23, 59, 59);
    return time;
}

/** 透過參數建立新 Event */
export function createEvent(
    name: string,
    color: Array<string>,
    startTime: Date,
    endTime: Date,
    repeatID: string,
    ignore: boolean = false,
    isEmpty: boolean = false,
    description: string = '',
    location: string = '',
    calendarTitle: string
) {
    var newEvent = new Event();
    newEvent.title = name;
    newEvent.color = color;
    newEvent.startTime = startTime;
    newEvent.endTime = endTime;
    newEvent.ignore = ignore;
    newEvent.isEmpty = isEmpty;
    newEvent.repeatID = repeatID;
    newEvent.description = description;
    newEvent.location = location;
    newEvent.calendarTitle = calendarTitle;
    return newEvent;
}

export function buildRepeatToEvent(userdata: User, date: Date) {
    date.setHours(12, 0);
    var changed = false;
    var newdata = new User(userdata);
    newdata.calendars.map(calendar => {
        calendar.repeats.map(repeat => {
            repeat = new Repeat(repeat);
            repeat.startDate.setHours(12, 0);
            repeat.endDate.setHours(12, 0);
            if (
                date.getTime() - repeat.startDate.getTime() >= 0 &&
                repeat.endDate.getTime() - date.getTime() >= 0
            ) {
                if (
                    repeat.cycle === 'Week' &&
                    date.getDay() === repeat.repeatData &&
                    !repeat.generated.includes(
                        date.getFullYear() +
                            '/' +
                            (date.getMonth() + 1) +
                            '/' +
                            date.getDate()
                    )
                ) {
                    changed = true;
                    repeat.generated.push(
                        date.getFullYear() +
                            '/' +
                            (date.getMonth() + 1) +
                            '/' +
                            date.getDate()
                    );
                    var startTime = new Date(date);
                    var endTime = new Date(date);
                    startTime.setHours(
                        repeat.startTime.getHours(),
                        repeat.startTime.getMinutes()
                    );
                    endTime.setHours(
                        repeat.endTime.getHours(),
                        repeat.endTime.getMinutes()
                    );
                    calendar.events.push(
                        createEvent(
                            repeat.name,
                            calendar.color,
                            startTime,
                            endTime,
                            repeat.id,
                            false,
                            false,
                            '',
                            '',
                            calendar.title
                        )
                    );
                } else if (
                    repeat.cycle === 'Month' &&
                    date.getDate() === repeat.repeatData &&
                    !repeat.generated.includes(
                        date.getFullYear() +
                            '/' +
                            date.getMonth() +
                            '/' +
                            date.getDate()
                    )
                ) {
                    changed = true;
                    repeat.generated.push(
                        date.getFullYear() +
                            '/' +
                            date.getMonth() +
                            '/' +
                            date.getDate()
                    );
                    startTime = new Date(date);
                    endTime = new Date(date);
                    startTime.setHours(
                        repeat.startTime.getHours(),
                        repeat.startTime.getMinutes()
                    );
                    endTime.setHours(
                        repeat.endTime.getHours(),
                        repeat.endTime.getMinutes()
                    );
                    calendar.events.push(
                        createEvent(
                            repeat.name,
                            calendar.color,
                            startTime,
                            endTime,
                            repeat.id,
                            false,
                            false,
                            '',
                            '',
                            calendar.title
                        )
                    );
                }
            }

            return null;
        });

        return null;
    });
    return { data: newdata, changed: changed };
}

/** 從傳入的 Calendar Array 過濾出特定日期的 Event */
export function eventsToDispay(calendars: Array<Calendar>, date: Date) {
    var eventsToDispay: Array<Event> = [];
    calendars.map(calendar => {
        calendar.events.map(event => {
            event = new Event(event);
            if (
                event.startTime.getFullYear() === date.getFullYear() &&
                event.startTime.getMonth() === date.getMonth() &&
                event.startTime.getDate() === date.getDate() &&
                !event.isAllDayEvent()
            ) {
                eventsToDispay.push(event);
            }

            return null;
        });

        return null;
    });
    eventsToDispay.sort(
        (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
    return eventsToDispay;
}

/** 從傳入的 Calendar Array 過濾出特定日期的 All Day Event (全天事件) */
export function allDayEventsToDispay(calendars: Array<Calendar>, date: Date) {
    var allDayEventsToDispay: Array<Event> = [];
    calendars.map(calendar => {
        calendar.events.map(event => {
            event = new Event(event);
            if (
                event.startTime.getFullYear() === date.getFullYear() &&
                event.startTime.getMonth() === date.getMonth() &&
                event.startTime.getDate() === date.getDate() &&
                event.isAllDayEvent()
            ) {
                allDayEventsToDispay.push(event);
            }
            return null;
        });

        return null;
    });
    return allDayEventsToDispay;
}
