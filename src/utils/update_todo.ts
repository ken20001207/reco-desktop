import { TodoData } from "../types";
import { apiURL } from "../config";

export default function update_todo(todo: TodoData) {
    return fetch(apiURL + "/write-todo", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "samplesession" },
        body: JSON.stringify({
            todo: todo,
        }),
    });
}
