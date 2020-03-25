import { Calendar } from "./classes";

/** 傳入 Calendar 物件
 * 並回傳不重複的裡面所有事件標題、地點、補充說明
 * 作為 AutoComplete 表單控件的 Data
 */
export function getEventsAutoCompleteData(calendar: Calendar) {
    var titles = new Array<string>();
    calendar.events.map(event => {
        if (!titles.includes(event.title)) titles.push(event.title);
        return null;
    });

    var descriptions = new Array<string>();
    calendar.events.map(event => {
        if (!descriptions.includes(event.description)) descriptions.push(event.description);
        return null;
    });

    var locations = new Array<string>();
    calendar.events.map(event => {
        if (!locations.includes(event.location)) locations.push(event.location);
        return null;
    });

    return {titles, descriptions, locations};
}

/** 傳入 Calendar 物件
 * 並回傳不重複的裡面所有事件標題、地點、補充說明
 * 作為 AutoComplete 表單控件的 Data
 */
export function getTodosAutoCompleteData(calendar: Calendar) {
    var titles = new Array<string>();
    calendar.todos.map(todo => {
        if (!titles.includes(todo.name)) titles.push(todo.name);
        return null;
    });

    var descriptions = new Array<string>();
    calendar.events.map(todo => {
        if (!descriptions.includes(todo.description)) descriptions.push(todo.description);
        return null;
    });

    return {titles, descriptions };
}