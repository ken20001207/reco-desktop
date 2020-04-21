import { CombinedState } from "redux";

// State Type
export interface SystemState {
    user: UserData | undefined;
    calendars: Array<CalendarData>;
    events: Array<EventData>;
    todos: Array<TodoData>;
    UI: {
        creatingEvent: boolean;
        editingEvent: boolean;
        creatingTodo: boolean;
        editingTodo: boolean;
        selectedEvent: EventData | null;
        selectedTodo: TodoData | null;
    };
}

// Class Types
export class UserData {
    _id: string | undefined;
    nickname: string | undefined;
    calendars: Array<string> | undefined;
}

export class CalendarData {
    _id: string | undefined;
    owner: string | undefined;
    title: string | undefined;
    color: Array<string> | undefined;
    events: Array<string> | undefined;
}

export class EventData {
    _id: string;
    calendar: string;
    title: string;
    color: Array<string>;
    ignore: boolean;
    ignoreReason: string;
    startTime: Date;
    endTime: Date;
    description: string;
    location: string;
    repeatID: string;

    constructor(event: EventData) {
        this._id = event._id;
        this.calendar = event.calendar;
        this.title = event.title;
        this.color = event.color;
        this.ignore = event.ignore;
        this.ignoreReason = event.ignoreReason;
        this.startTime = event.startTime;
        this.endTime = event.endTime;
        this.location = event.location;
        this.description = event.description;
        this.repeatID = event.repeatID;
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
}

export class TodoData {
    _id: string;
    calendar: string;
    title: string;
    deadline: Date;
    color: Array<string>;
    complete: boolean;
    description: string;

    constructor(todo: TodoData) {
        this._id = todo._id;
        this.calendar = todo.calendar;
        this.title = todo.title;
        this.deadline = todo.deadline;
        this.color = todo.color;
        this.complete = todo.complete;
        this.description = todo.description;
    }
}

// Action Types

export const UPDATE_USERDATA = "UPDATE_USERDATA";
export interface UpdateUserDataAction {
    type: typeof UPDATE_USERDATA;
    data: UserData;
}

export const UPDATE_CALENDARDATA = "UPDATE_CALENDARDATA";
export interface UpdateCalendarDataAction {
    type: typeof UPDATE_CALENDARDATA;
    data: CalendarData;
}

export const UPDATE_EVENTDATA = "UPDATE_EVENTDATA";
export interface UpdateEventDataAction {
    type: typeof UPDATE_EVENTDATA;
    data: EventData;
}

export const UPDATE_TODODATA = "UPDATE_TODODATA";
export interface UpdateTodoDataAction {
    type: typeof UPDATE_TODODATA;
    data: TodoData;
}

export const TOGGLE_CREATING_EVENT = "TOGGLE_CREATING_EVENT";
export interface SelectEventAction {
    type: typeof SELECT_EVENT;
    data: EventData;
}

export const TOGGLE_EDITING_EVENT = "TOGGLE_EDITING_EVENT";
export interface SelectTodoAction {
    type: typeof SELECT_TODO;
    data: TodoData;
}

export const TOGGLE_CREATING_TODO = "TOGGLE_CREATING_TODO";
export interface ToggleCreatingEventAction {
    type: typeof TOGGLE_CREATING_EVENT;
}

export const TOGGLE_EDITING_TODO = "TOGGLE_EDITING_TODO";
export interface ToggleEditingEventAction {
    type: typeof TOGGLE_EDITING_EVENT;
}

export const SELECT_EVENT = "SELECT_EVENT";
export interface ToggleCreatingTodoAction {
    type: typeof TOGGLE_CREATING_TODO;
}

export const SELECT_TODO = "SELECT_TODO";
export interface ToggleEditingTodoAction {
    type: typeof TOGGLE_EDITING_TODO;
}

export const DELETE_EVENT = "DELETE_EVENT";
export interface DeleteEventAction {
    type: typeof DELETE_EVENT;
    _id: string;
}

export const DELETE_TODO = "DELETE_TODO";
export interface DeleteTodoAction {
    type: typeof DELETE_TODO;
    _id: string;
}

export type SystemStateActions =
    | UpdateUserDataAction
    | UpdateEventDataAction
    | UpdateTodoDataAction
    | UpdateCalendarDataAction
    | ToggleCreatingEventAction
    | ToggleEditingEventAction
    | ToggleCreatingTodoAction
    | ToggleEditingTodoAction
    | SelectEventAction
    | SelectTodoAction
    | DeleteEventAction
    | DeleteTodoAction;

export type AppState = CombinedState<{
    systemStateReducer: SystemState;
}>;
