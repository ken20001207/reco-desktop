import { apiURL } from "../config";
import { EventData, TodoData } from "../types";
import { store } from "../redux/store";
import { updateEvent, updateTodo } from "../redux/actions";
import { send_error_message } from "../components/send_message";
import { Alert } from "rsuite";

export default function download_data(year: number, month: number) {
    Alert.info("正在同步" + year + "年" + month + "月的資料", 0);
    return new Promise<any>((resolve, reject) => {
        fetch(apiURL + "/getdata?year=" + year + "&month=" + month, { method: "GET", headers: { Authorization: "samplesession" } })
            .then(async (res) => {
                const datas = ((await res.json()) as unknown) as { events: Array<EventData>; todos: Array<TodoData> };
                datas.events.map((event) => {
                    var new_event = new EventData(event);
                    var s = new Date();
                    s.setTime(Date.parse((event.startTime as unknown) as string));
                    new_event.startTime = s;
                    var e = new Date();
                    e.setTime(Date.parse((event.endTime as unknown) as string));
                    new_event.endTime = e;
                    store.dispatch(updateEvent(new_event));
                    return null;
                });
                datas.todos.map((todo) => {
                    var d = new Date();
                    d.setTime(Date.parse((todo.deadline as unknown) as string));
                    todo.deadline = d;
                    store.dispatch(updateTodo(todo));
                    return null;
                });
                Alert.close();
                resolve();
            })
            .catch((err) => {
                send_error_message("下載資料時發生了錯誤", err);
                reject(err);
            });
    });
}
