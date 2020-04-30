import React, { ReactNode } from "react";

import {
    FlexboxGrid,
    Button,
    Form,
    FormGroup,
    FormControl,
    ControlLabel,
    SelectPicker,
    Modal,
    DatePicker,
    AutoComplete,
    Input,
} from "rsuite";
import { ItemDataType } from "rsuite/lib/@types/common";
import { CalendarData, AppState, TodoData } from "../../types";
import { store } from "../../redux/store";
import { toggleCreatingTodo } from "../../redux/actions";
import { connect } from "react-redux";
import { fix_todo_time } from "../../utils/fix_time";
import update_todo from "../../utils/update_todo";
import download_data from "../../utils/download_datas";
import generateUUID from "../../utils/generateUUID";
import get_calendar_menu_item from "../calendar_menu_item";
import get_calendar_menu_value from "../calendar_menu_value";
import { send_success_message, send_error_message } from "../send_message";

interface Props {
    creatingTodo: boolean;
    toggleCreatingTodo: () => void;
}

interface States {
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

class CreateTodoModal extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            calendarData: new CalendarData(),
            _id: "",
            calendar: "",
            title: "",
            deadline: new Date(),
            color: [],
            complete: false,
            description: "",
        };
    }

    handleInput = (formValue: any) => {
        this.setState({
            calendarData: formValue.calendarData,
            title: formValue.title,
            deadline: formValue.deadline,
            color: formValue.color,
            complete: formValue.complete,
            description: formValue.description,
        });
    };

    componentWillReceiveProps() {
        this.setState({ calendarData: store.getState().systemStateReducer.calendars[0] });
    }

    createTodo = () => {
        if (this.state.calendarData._id === undefined || this.state.calendarData.color === undefined) return;
        this.setState({ loading: true });
        var newTodo = fix_todo_time((this.state as unknown) as TodoData);
        newTodo.calendar = this.state.calendarData._id;
        newTodo._id = generateUUID();
        newTodo.color = this.state.calendarData.color;
        update_todo(newTodo).then(async (res) => {
            if (res.status === 200) {
                download_data(this.state.deadline.getFullYear(), this.state.deadline.getMonth() + 1)
                    .then(() => {
                        this.props.toggleCreatingTodo();
                        this.setState({ loading: false });
                        send_success_message("建立成功", "「" + this.state.title + "」建立成功");
                    })
                    .catch((err) => {
                        this.props.toggleCreatingTodo();
                        this.setState({ loading: false });
                        send_error_message("下載行事曆資料失敗", err);
                    });
            }
        });
    };

    render() {
        var calendarOptions: Array<{ label: string; value: CalendarData }> = [];
        calendarOptions = store.getState().systemStateReducer.calendars.map((calendar) => {
            if (calendar.title === undefined) return { label: "", value: calendar };
            return { label: calendar.title, value: calendar };
        });

        return (
            <Modal
                keyboard
                show={this.props.creatingTodo}
                aria-labelledby="form-dialog-title"
                width="xs"
                onHide={this.props.toggleCreatingTodo}
            >
                <Modal.Header closeButton>
                    <h5>新增 Deadline </h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.state} onChange={this.handleInput}>
                        <FormGroup>
                            <FormControl
                                name="calendarData"
                                data={calendarOptions}
                                defaultValue={this.state.calendar}
                                appearance="subtle"
                                searchable={false}
                                cleanable={false}
                                accepter={SelectPicker}
                                renderMenuItem={(label: ReactNode, item: ItemDataType) => get_calendar_menu_item(label, item)}
                                renderValue={(value: CalendarData, item: any) => get_calendar_menu_value(value, item)}
                            />
                            <FormControl
                                className="DialogFormControl"
                                placeholder="Deadline 標題"
                                name="title"
                                accepter={AutoComplete}
                                autoComplete="off"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>Deadline</ControlLabel>
                            <FormControl
                                name="deadline"
                                accepter={DatePicker}
                                format="YYYY-MM-DD HH:mm"
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
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={18} />
                        <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                            <Button onClick={this.props.toggleCreatingTodo}>取消</Button>
                            <Button appearance="primary" onClick={this.createTodo} loading={this.state.loading}>
                                創立
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
        creatingTodo: state.systemStateReducer.UI.creatingTodo,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return { toggleCreatingTodo: () => dispatch(toggleCreatingTodo()) };
}

const VisibleCreateTodoModal = connect(mapStateToProps, mapDispatchToProps)(CreateTodoModal);

export default VisibleCreateTodoModal;
