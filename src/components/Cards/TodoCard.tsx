import React, { CSSProperties } from "react";

import { Panel } from "rsuite";
import { TodoData } from "../../types";
import { store } from "../../redux/store";
import { toggleEditingTodo, selectTodo } from "../../redux/actions";
import { connect } from "react-redux";
import { getDayDescription } from "../../utils/getDayDescription";

interface TodoCardProps {
    position: number | undefined;
    height: number;
    todo: TodoData;
    container: React.RefObject<HTMLDivElement>;
    toggleEditingTodo: (todo: TodoData) => void;
}

interface TodoCardState {
    hover: boolean;
}

class TodoCard extends React.Component<TodoCardProps, TodoCardState> {
    constructor(props: Readonly<TodoCardProps>) {
        super(props);
        this.state = {
            hover: false,
        };
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(e: { stopPropagation: () => void }) {
        e.stopPropagation();
        this.props.toggleEditingTodo(this.props.todo);
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
            width: "100%",
        };

        return (
            <Panel style={style} key={todo._id} className="EventCard" onClick={this.handleClick} bodyFill>
                <div
                    style={{
                        backgroundImage: "linear-gradient(315deg, " + todo.color[0] + " 0%, " + todo.color[1] + " 100%)",
                        width: 6,
                        height: 60,
                        display: "inline-block",
                        verticalAlign: "top",
                    }}
                ></div>
                <div style={{ display: "inline-block", height: 60, verticalAlign: "top", paddingLeft: 16, paddingTop: 12 }}>
                    <p style={{ fontSize: 12, fontWeight: "bolder" }}>{todo.title}</p>
                    <p style={{ fontSize: 12, fontWeight: "bolder", opacity: 0.5 }}>
                        {getDayDescription(todo.deadline)}
                        截止
                    </p>
                </div>
            </Panel>
        );
    }
}

function mapStateToProps() {
    return {};
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        toggleEditingTodo: (todo: TodoData) => {
            dispatch(selectTodo(todo));
            dispatch(toggleEditingTodo());
        },
    };
}

const VisibleTodoCard = connect(mapStateToProps, mapDispatchToProps)(TodoCard);

export default VisibleTodoCard;
