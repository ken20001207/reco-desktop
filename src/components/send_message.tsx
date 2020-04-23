import { Notification } from "rsuite";
import React from "react";

const placement = "bottomEnd";

export function send_success_message(title: string, message: string) {
    Notification["success"]({
        title: title,
        description: <p>{message}</p>,
        placement: placement,
    });
}

export function send_info_message(title: string, message: string) {
    Notification["info"]({
        title: title,
        description: <p>{message}</p>,
        placement: placement,
    });
}

export function send_warning_message(title: string, message: string) {
    Notification["warning"]({
        title: title,
        description: <p>{message}</p>,
        placement: placement,
    });
}

export function send_error_message(title: string, message: string) {
    Notification["error"]({
        title: title,
        description: <p>{message}</p>,
        placement: placement,
    });
}
