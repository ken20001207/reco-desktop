import React from "react";
import { Button, FlexboxGrid, Form, FormGroup, FormControl, ControlLabel, Modal, Toggle, DatePicker, AutoComplete, Input } from "rsuite";
import { store } from "../redux/store";
import { AppState, TodoData, CalendarData } from "../types";
import { connect } from "react-redux";
import { toggleEditingTodo, deleteTodo } from "../redux/actions";
import update_todo from "../utils/update_todo";
import { fix_todo_time } from "../utils/fix_time";
import download_data from "../utils/download_datas";
import delete_item from "../utils/delete_item";
import { send_success_message, send_error_message } from "./send_message";

interface Props {
    todo: TodoData | null;
    toggleEditingTodo: () => void;
    editingTodo: boolean;
    deleteTodo: (_id: string) => void;
}

interface States {
    removing: boolean;
    loading: boolean;
    calendarData: CalendarData;
    _id: string;
    calendar: string;
    title: string;
    deadline: Date;
    color: Array<string>;
    complete: boolean;
    description: string;
}

class EditTodoDialog extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.todo !== null) {
            const calendar = store
                .getState()
                .systemStateReducer.calendars.filter((calendar) => calendar._id === nextProps.todo?.calendar)[0];
            if (calendar._id === undefined) return;
            this.setState({
                calendarData: calendar,
                _id: nextProps.todo._id,
                calendar: calendar._id,
                title: nextProps.todo.title,
                deadline: nextProps.todo.deadline,
                color: nextProps.todo.color,
                complete: nextProps.todo.complete,
                description: nextProps.todo.description,
            });
        }
    }

    handleInput(formValue: any) {
        this.setState({
            calendarData: formValue.calendarData,
            title: formValue.title,
            deadline: formValue.deadline,
            color: formValue.color,
            complete: formValue.complete,
            description: formValue.description,
        });
    }

    updateTodo() {
        this.setState({ loading: true });
        update_todo(fix_todo_time((this.state as unknown) as TodoData)).then(async (res) => {
            if (res.status === 200) {
                download_data(this.state.deadline.getFullYear(), this.state.deadline.getMonth() + 1)
                    .then(() => {
                        this.props.toggleEditingTodo();
                        this.setState({ loading: false });
                        if (this.props.todo !== null) send_success_message("更新成功", "「" + this.props.todo.title + "」已被更新");
                    })
                    .catch(() => {
                        this.props.toggleEditingTodo();
                        this.setState({ loading: false });
                    });
            }
        });
    }

    deleteItem() {
        this.setState({ removing: true });
        if (this.props.todo === null) return;
        delete_item(this.props.todo._id)
            .then((res) => {
                if (res.status === 200)
                    download_data(this.state.deadline.getFullYear(), this.state.deadline.getMonth() + 1)
                        .then(() => {
                            if (this.props.todo === null) return;
                            this.props.deleteTodo(this.props.todo._id);
                            this.props.toggleEditingTodo();
                            this.setState({ removing: false });
                            send_success_message("刪除成功", "「" + this.props.todo.title + "」已被刪除");
                        })
                        .catch(() => {
                            this.props.toggleEditingTodo();
                            this.setState({ removing: false });
                        });
            })
            .catch(() => {
                this.props.toggleEditingTodo();
                send_error_message("刪除失敗", "刪除 DeadLine 時發生了錯誤");
            });
    }

    render() {
        const selectedTodo = store.getState().systemStateReducer.UI.selectedTodo;
        if (selectedTodo === null) return null;

        return (
            <Modal
                keyboard
                show={this.props.editingTodo}
                aria-labelledby="form-dialog-title"
                width="xs"
                onHide={() => this.props.toggleEditingTodo()}
            >
                <Modal.Header closeButton>
                    <h5 style={{ marginLeft: 6, display: "inline-block" }}>{this.state.calendarData.title}</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.state} onChange={this.handleInput}>
                        <FormGroup>
                            <ControlLabel>事件標題</ControlLabel>
                            <FormControl name="title" accepter={AutoComplete} className="DialogFormControl" autoComplete="off" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Deadline</ControlLabel>
                            <FormControl
                                name="deadline"
                                accepter={DatePicker}
                                format="YYYY年MM月DD日 HH點mm分"
                                className="DialogFormControl"
                                placement="auto"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>註記</ControlLabel>
                            <FormControl
                                className="DialogFormControl"
                                name="description"
                                accepter={Input}
                                componentClass="textarea"
                                rows={3}
                                autoComplete="off"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>已完成</ControlLabel>
                            <FormControl accepter={Toggle} name="complete" checked={this.state.complete} />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={3} style={{ textAlign: "left" }}>
                            <Button color="red" onClick={this.deleteItem} loading={this.state.removing}>
                                刪除
                            </Button>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={15} />
                        <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                            <Button onClick={this.props.toggleEditingTodo}>取消</Button>
                            <Button appearance="primary" onClick={this.updateTodo} loading={this.state.loading}>
                                更新
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Modal.Footer>
            </Modal>
        );
    }
}

function mapStateToProps(state: AppState) {
    return {
        todo: state.systemStateReducer.UI.selectedTodo,
        editingTodo: state.systemStateReducer.UI.editingTodo,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        toggleEditingTodo: () => dispatch(toggleEditingTodo()),
        deleteTodo: (_id: string) => dispatch(deleteTodo(_id)),
    };
}

const VisibleEditTodoDialog = connect(mapStateToProps, mapDispatchToProps)(EditTodoDialog);

export default VisibleEditTodoDialog;
