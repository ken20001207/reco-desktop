import React from "react";

import { todoDisplayProps } from "../utils/interfaces";
import TodoCard from "./TodoCard";

export default class TodoDisplay extends React.Component<todoDisplayProps> {
    render() {
        if (this.props.todos.length === 0) return null;

        var todos = this.props.todos.map(todo => {
            return (
                <TodoCard
                    position={undefined}
                    container={this.props.container}
                    key={todo.id}
                    height={60}
                    todo={todo}
                    openTodoEditDialog={this.props.openTodoEditDialog}
                    openTodoCreateDialog={this.props.openTodoCreateDialog}
                />
            );
        });

        return (
            <div style={{ marginTop: 30 }}>
                <h5>需注意</h5> {todos}
            </div>
        );
    }
}
