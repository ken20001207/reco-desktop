import { apiURL } from "../config";

export default function delete_item(id: string) {
    return fetch(apiURL + "/delete-item", {
        method: "POST",
        body: JSON.stringify({ _id: id }),
        headers: { "Content-Type": "application/json", Authorization: "samplesession" },
    });
}
