import {
    UPDATE_USERDATA,
    UPDATE_EVENTDATA,
    UPDATE_TODODATA,
    UpdateUserDataAction,
    UserData,
    EventData,
    TodoData,
    UpdateEventDataAction,
    UpdateTodoDataAction,
    CalendarData,
    UpdateCalendarDataAction,
    UPDATE_CALENDARDATA,
    ToggleCreatingEventAction,
    TOGGLE_CREATING_EVENT,
    ToggleEditingEventAction,
    ToggleCreatingTodoAction,
    ToggleEditingTodoAction,
    TOGGLE_EDITING_EVENT,
    TOGGLE_CREATING_TODO,
    TOGGLE_EDITING_TODO,
    SelectTodoAction,
    SELECT_EVENT,
    SelectEventAction,
    SELECT_TODO,
    DeleteEventAction,
    DELETE_EVENT,
    DELETE_TODO,
    DeleteTodoAction,
} from "../types";

export function updateUser(data: UserData): UpdateUserDataAction {
    return {
        type: UPDATE_USERDATA,
        data: data,
    };
}

export function updateCalendar(data: CalendarData): UpdateCalendarDataAction {
    return {
        type: UPDATE_CALENDARDATA,
        data: data,
    };
}

export function updateEvent(data: EventData): UpdateEventDataAction {
    return {
        type: UPDATE_EVENTDATA,
        data: data,
    };
}

export function updateTodo(data: TodoData): UpdateTodoDataAction {
    return {
        type: UPDATE_TODODATA,
        data: data,
    };
}

export function selectEvent(data: EventData): SelectEventAction {
    return {
        type: SELECT_EVENT,
        data: data,
    };
}

export function selectTodo(data: TodoData): SelectTodoAction {
    return {
        type: SELECT_TODO,
        data: data,
    };
}

export function toggleCreatingEvent(): ToggleCreatingEventAction {
    return {
        type: TOGGLE_CREATING_EVENT,
    };
}

export function toggleEditingEvent(): ToggleEditingEventAction {
    return {
        type: TOGGLE_EDITING_EVENT,
    };
}

export function toggleCreatingTodo(): ToggleCreatingTodoAction {
    return {
        type: TOGGLE_CREATING_TODO,
    };
}

export function toggleEditingTodo(): ToggleEditingTodoAction {
    return {
        type: TOGGLE_EDITING_TODO,
    };
}

export function deleteEvent(_id: string): DeleteEventAction {
    return {
        type: DELETE_EVENT,
        _id: _id,
    };
}

export function deleteTodo(_id: string): DeleteTodoAction {
    return {
        type: DELETE_TODO,
        _id: _id,
    };
}
