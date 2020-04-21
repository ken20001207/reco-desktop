import {
    SystemState,
    SystemStateActions,
    UPDATE_USERDATA,
    UPDATE_EVENTDATA,
    UPDATE_TODODATA,
    UPDATE_CALENDARDATA,
    TOGGLE_CREATING_EVENT,
    TOGGLE_EDITING_EVENT,
    TOGGLE_CREATING_TODO,
    TOGGLE_EDITING_TODO,
    SELECT_EVENT,
    SELECT_TODO,
    DELETE_EVENT,
    DELETE_TODO,
} from "../types";
import { combineReducers } from "redux";

const initState: SystemState = {
    user: undefined,
    calendars: [],
    events: [],
    todos: [],
    UI: {
        creatingEvent: false,
        editingEvent: false,
        creatingTodo: false,
        editingTodo: false,
        selectedEvent: null,
        selectedTodo: null,
    },
};

export function systemStateReducer(state: SystemState = initState, action: SystemStateActions): SystemState {
    switch (action.type) {
        case UPDATE_USERDATA:
            return { ...state, user: action.data };
        case UPDATE_CALENDARDATA:
            var calendars = state.calendars.filter((calendar) => calendar._id !== action.data._id);
            calendars.push(action.data);
            return { ...state, calendars: calendars };
        case UPDATE_EVENTDATA:
            var events = state.events.filter((event) => event._id !== action.data._id);
            events.push(action.data);
            return { ...state, events: events };
        case UPDATE_TODODATA:
            var todos = state.todos.filter((todo) => todo._id !== action.data._id);
            todos.push(action.data);
            return { ...state, todos: todos };
        case SELECT_EVENT:
            return { ...state, UI: { ...state.UI, selectedEvent: action.data } };
        case SELECT_TODO:
            return { ...state, UI: { ...state.UI, selectedTodo: action.data } };
        case TOGGLE_CREATING_EVENT:
            return { ...state, UI: { ...state.UI, creatingEvent: !state.UI.creatingEvent } };
        case TOGGLE_EDITING_EVENT:
            return { ...state, UI: { ...state.UI, editingEvent: !state.UI.editingEvent } };
        case TOGGLE_CREATING_TODO:
            return { ...state, UI: { ...state.UI, creatingTodo: !state.UI.creatingTodo } };
        case TOGGLE_EDITING_TODO:
            return { ...state, UI: { ...state.UI, editingTodo: !state.UI.editingTodo } };
        case DELETE_EVENT:
            events = state.events.filter((event) => event._id !== action._id);
            return { ...state, events: events };
        case DELETE_TODO:
            todos = state.todos.filter((todo) => todo._id !== action._id);
            return { ...state, todos: todos };
        default:
            return state;
    }
}

const reducer = combineReducers({ systemStateReducer });
export default reducer;
