import { ReactNode } from "react";
import { ItemDataType } from "rsuite/lib/@types/common";
import React from "react";

export default function get_calendar_menu_item(label: ReactNode, item: ItemDataType) {
    return (
        <div
            style={{
                backgroundImage: "linear-gradient(315deg, " + item.value.color[0] + " 0%, " + item.value.color[1] + " 100%)",
                padding: 8,
                borderRadius: 8,
                color: "white",
            }}
        >
            <p style={{ fontWeight: "bolder" }}>{label}</p>
        </div>
    );
}
