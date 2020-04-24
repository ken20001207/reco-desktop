import { apiURL } from "../config";

export default async function check_session() {
    return fetch(apiURL + "/checksession", {
        method: "POST",
        headers: { Authorization: "samplesession" },
    });
}
