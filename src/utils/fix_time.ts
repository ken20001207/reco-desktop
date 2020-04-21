import { EventData, TodoData } from "../types";

export function fix_event_time(target: EventData) {
    var st = new Date();
    st.setTime(target.startTime.getTime());
    var et = new Date();
    et.setTime(target.endTime.getTime());
    var newEvent = new EventData((target as unknown) as EventData);
    st.setHours(st.getHours() + 8);
    et.setHours(et.getHours() + 8);
    newEvent.startTime = st;
    newEvent.endTime = et;
    return newEvent;
}

export function fix_todo_time(target: TodoData) {
    var ddl = new Date();
    ddl.setTime(target.deadline.getTime());
    var newTodo = new TodoData((target as unknown) as TodoData);
    ddl.setHours(ddl.getHours() + 8);
    newTodo.deadline = ddl;
    return newTodo;
}
