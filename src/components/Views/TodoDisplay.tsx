import React from "react";

import TodoCard from "../Cards/TodoCard";
import { store } from "../../redux/store";
import { toggleCreatingTodo } from "../../redux/actions";
import { connect } from "react-redux";
import { Panel, Icon } from "rsuite";
import { TodoData, AppState } from "../../types";
import get_day_diff from "../../utils/get_day_diff";

interface todoDisplayProps {
    todos: Array<TodoData>;
    displayDate: Date;
    container: React.RefObject<HTMLDivElement>;
    toggleCreatingTodo: () => void;
}

class TodoDisplay extends React.Component<todoDisplayProps> {
    render() {
        var display_todos = this.props.todos.filter((todo) => {
            return get_day_diff(todo.deadline, this.props.displayDate) < 3 && get_day_diff(todo.deadline, this.props.displayDate) >= 0;
        });
        display_todos.sort((todoA, todoB) => (todoA.complete ? 1 : 0) - (todoB.complete ? 1 : 0));
        var todos = display_todos.map((todo) => {
            return <TodoCard position={undefined} container={this.props.container} key={todo._id} height={60} todo={todo} />;
        });

        return (
            <div style={{ marginTop: 30 }}>
                <h5>DeadLines</h5> {todos}
                <Panel
                    style={{
                        height: 60,
                        fontSize: 8,
                        paddingLeft: 0,
                        paddingTop: 0,
                        marginTop: 16,
                        paddingBottom: 6,
                        width: "100%",
                        border: "1px solid rgba(255,255,255,0.2)",
                    }}
                    onClick={() => this.props.toggleCreatingTodo()}
                >
                    <Icon icon="plus" />
                </Panel>
            </div>
        );
    }
}

function mapStateToProps(state: AppState) {
    return {
        todos: state.systemStateReducer.todos,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return { toggleCreatingTodo: () => dispatch(toggleCreatingTodo()) };
}

const VisibleTodoDisplay = connect(mapStateToProps, mapDispatchToProps)(TodoDisplay);

export default VisibleTodoDisplay;
