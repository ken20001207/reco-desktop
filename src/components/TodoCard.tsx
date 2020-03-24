import React, { CSSProperties } from "react";
import { TodoCardProps, TodoCardState } from "../utils/interfaces";

import { Panel } from "rsuite";

export default class TodoCard extends React.Component<TodoCardProps, TodoCardState> {
    constructor(props: Readonly<TodoCardProps>) {
        super(props);
        this.state = {
            hover: false
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleDoubleClick(e: { stopPropagation: () => void }) {
        e.stopPropagation();
        this.props.openTodoEditDialog(this.props.todo);
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    render() {
        const todo = this.props.todo;
        const style: CSSProperties = {
            height: 60,
            background: "rgba(255,255,255,0.05)",
            fontSize: 8,
            paddingLeft: 0,
            paddingTop: 0,
            marginTop: 16,
            paddingBottom: 6,
            opacity: todo.complete ? 0.2 : 1,
            width: "100%"
        };

        return (
            <Panel style={style} key={todo.id} className="EventCard" onDoubleClick={this.handleDoubleClick} bodyFill>
                <div
                    style={{
                        backgroundImage: "linear-gradient(315deg, " + todo.color[0] + " 0%, " + todo.color[1] + " 100%)",
                        width: 6,
                        height: 60,
                        display: "inline-block",
                        verticalAlign: "top"
                    }}
                ></div>
                <div style={{ display: "inline-block", height: 60, verticalAlign: "top", paddingLeft: 16, paddingTop: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: "bolder" }}>{todo.name}</p>
                    <p style={{ fontSize: 12, fontWeight: "bolder", opacity: 0.5 }}>
                        {(todo.DeadLine.getMonth()+1) +
                            "/" +
                            todo.DeadLine.getDate() +
                            " " +
                            todo.DeadLine.getHours() +
                            ":" +
                            todo.DeadLine.getMinutes()}{" "}
                        截止
                    </p>
                </div>
            </Panel>
        );
    }
}
