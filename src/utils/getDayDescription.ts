/**
 * 將時間物件和今天日期比對來返回中文的時間敘述.
 *
 * @param {Date} date 想要拿來和今天比較的日期.
 */
export function getDayDescription(date: Date) {
    var dayDescription = "";
    var DayA = new Date(date);
    var DayB = new Date();
    DayA.setHours(12, 0, 0);
    DayB.setHours(12, 0, 0);
    if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) < 0) {
        if (DayA.getFullYear() === DayB.getFullYear() && DayA.getMonth() === DayB.getMonth() && DayA.getDate() === DayB.getDate())
            dayDescription = "今天";
        else if (DayA.getFullYear() === DayB.getFullYear() && DayA.getMonth() === DayB.getMonth() && DayA.getDate() + 1 === DayB.getDate())
            dayDescription = "昨天";
        else if (DayA.getFullYear() === DayB.getFullYear() && DayA.getMonth() === DayB.getMonth() && DayA.getDate() + 2 === DayB.getDate())
            dayDescription = "前天";
        else dayDescription = Math.floor((DayA.getTime() - DayB.getTime()) / 3600000 / -24) + " 天前";
    } else {
        if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) === 0) dayDescription = "今天";
        else if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) === 23) dayDescription = "明天";
        else if (Math.floor((DayA.getTime() - DayB.getTime()) / 3600000) === 47) dayDescription = "後天";
        else dayDescription = Math.floor((DayA.getTime() - DayB.getTime()) / 3600000 / 24) + 1 + " 天後";
    }
    return dayDescription;
}
