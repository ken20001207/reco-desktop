import React from "react";
import { CalendarData } from "../types";

export default function get_calendar_menu_value(value: CalendarData, item: any) {
    return (
        <div
            style={{
                backgroundImage: "linear-gradient(315deg, " + item.value.color[0] + " 0%, " + item.value.color[1] + " 100%)",
                padding: 8,
                borderRadius: 8,
                color: "white",
            }}
        >
            <p style={{ fontWeight: "bolder" }}>{value.title}</p>
        </div>
    );
}
