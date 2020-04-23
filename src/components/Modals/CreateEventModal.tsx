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
    Toggle,
    DatePicker,
    AutoComplete,
    Input,
} from "rsuite";
import { ItemDataType } from "rsuite/lib/@types/common";
import { store } from "../../redux/store";
import { CalendarData, AppState, EventData } from "../../types";
import { connect } from "react-redux";
import { toggleCreatingEvent } from "../../redux/actions";
import update_event from "../../utils/update_event";
import { fix_event_time } from "../../utils/fix_time";
import download_data from "../../utils/download_datas";

import generateUUID from "../../utils/generateUUID";
import get_calendar_menu_item from "../calendar_menu_item";
import get_calendar_menu_value from "../calendar_menu_value";
import { send_success_message, send_error_message } from "../send_message";

interface Props {
    CreatingEvent: boolean;
    toggleCreatingEvent: () => void;
}

interface States {
    loading: boolean;
    calendar: string;
    calendarData: CalendarData;
    _id: string;
    color: Array<string>;
    ignore: boolean;
    allDay: boolean;
    title: string;
    startTime: Date;
    endTime: Date;
    description: string;
    location: string;
    ignoreReason: string;
    repeatID: string;
}

class CreateEventModal extends React.Component<Props, States> {
    constructor(props: Props) {
        super(props);
        this.state = {
            loading: false,
            calendarData: store.getState().systemStateReducer.calendars[0],
            calendar: "",
            _id: "",
            color: [],
            ignore: false,
            allDay: false,
            title: "",
            startTime: new Date(),
            endTime: new Date(),
            description: "",
            location: "",
            ignoreReason: "",
            repeatID: "",
        };
        this.handleInput = this.handleInput.bind(this);
        this.createEvent = this.createEvent.bind(this);
    }

    componentWillReceiveProps() {
        this.setState({ calendarData: store.getState().systemStateReducer.calendars[0] });
    }

    handleInput(formValue: any) {
        this.setState({
            calendarData: formValue.calendarData,
            ignore: formValue.ignore,
            allDay: formValue.allDay,
            title: formValue.title,
            startTime: formValue.startTime,
            endTime: formValue.endTime,
            description: formValue.description,
            location: formValue.location,
            ignoreReason: formValue.ignoreReason,
        });
    }

    createEvent() {
        if (this.state.calendarData._id === undefined || this.state.calendarData.color === undefined) return;
        this.setState({ loading: true });
        var newEvent = fix_event_time((this.state as unknown) as EventData);
        newEvent.calendar = this.state.calendarData._id;
        newEvent._id = generateUUID();
        newEvent.color = this.state.calendarData.color;
        update_event(newEvent).then(async (res) => {
            if (res.status === 200) {
                download_data(this.state.startTime.getFullYear(), this.state.startTime.getMonth() + 1)
                    .then(() => {
                        this.props.toggleCreatingEvent();
                        this.setState({ loading: false });
                        send_success_message("建立成功", "「" + this.state.title + "」建立成功");
                    })
                    .catch((err) => {
                        this.props.toggleCreatingEvent();
                        this.setState({ loading: false });
                        send_error_message("下載行事曆資料失敗", err);
                    });
            }
        });
    }

    render() {
        /** 時間選項 */
        var time = <p />;
        if (!this.state.allDay)
            time = (
                <FormGroup>
                    <FormGroup>
                        <ControlLabel>開始時間</ControlLabel>
                        <FormControl
                            className="DialogFormControl"
                            name="startTime"
                            accepter={DatePicker}
                            format="YYYY年MM月DD日 HH點mm分"
                            placement="auto"
                        />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>結束時間</ControlLabel>
                        <FormControl
                            className="DialogFormControl"
                            name="endTime"
                            accepter={DatePicker}
                            format="YYYY年MM月DD日 HH點mm分"
                            placement="auto"
                            disabledDate={(date: Date | undefined) => (date ? date.getTime() < this.state.startTime.getTime() : false)}
                        />
                    </FormGroup>
                </FormGroup>
            );
        else
            time = (
                <FormGroup>
                    <ControlLabel>日期</ControlLabel>
                    <FormControl className="DialogFormControl" name="startTime" accepter={DatePicker} format="YYYY年MM月DD日" oneTap />
                </FormGroup>
            );

        /** Calender 選項 */
        var calendarOptions: Array<{ label: string; value: CalendarData }> = [];
        if (store.getState().systemStateReducer.calendars !== undefined) {
            calendarOptions = store.getState().systemStateReducer.calendars.map((calendar) => {
                if (calendar.title === undefined) return { label: "ERROR", value: calendar };
                return { label: calendar.title, value: calendar };
            });
        }

        return (
            <Modal
                keyboard
                show={this.props.CreatingEvent}
                aria-labelledby="form-dialog-title"
                width="xs"
                onHide={this.props.toggleCreatingEvent}
            >
                <Form formValue={this.state} onChange={this.handleInput}>
                    <Modal.Header closeButton>
                        <h5>創建新事件</h5>
                    </Modal.Header>
                    <Modal.Body>
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
                                placeholder="事件標題"
                                name="title"
                                accepter={AutoComplete}
                                autoComplete="off"
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>全天事件</ControlLabel>
                            <FormControl accepter={Toggle} name="allDay" />
                        </FormGroup>
                        {time}
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
                            <ControlLabel>地點</ControlLabel>
                            <FormControl className="DialogFormControl" name="location" accepter={AutoComplete} autoComplete="off" />
                        </FormGroup>
                    </Modal.Body>
                    <Modal.Footer>
                        <FlexboxGrid>
                            <FlexboxGrid.Item colspan={3} style={{ textAlign: "left" }}>
                                <Button color="violet">創建系列</Button>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item colspan={15} />
                            <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                                <Button onClick={this.props.toggleCreatingEvent}>取消</Button>
                                <Button appearance="primary" onClick={this.createEvent} loading={this.state.loading}>
                                    創立
                                </Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Modal.Footer>
                </Form>
            </Modal>
        );
    }
}

function mapStateToProps(state: AppState) {
    return {
        CreatingEvent: state.systemStateReducer.UI.creatingEvent,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return { toggleCreatingEvent: () => dispatch(toggleCreatingEvent()) };
}

const VisibleCreateEventModal = connect(mapStateToProps, mapDispatchToProps)(CreateEventModal);

export default VisibleCreateEventModal;
