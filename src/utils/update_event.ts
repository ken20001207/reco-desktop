import { EventData } from "../types";
import { apiURL } from "../config";

export default function update_event(event: EventData) {
    return fetch(apiURL + "/write-event", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "samplesession" },
        body: JSON.stringify({
            event: event,
        }),
    });
}
