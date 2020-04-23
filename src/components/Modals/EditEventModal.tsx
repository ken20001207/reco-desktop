import React from "react";
import { Button, FlexboxGrid, Form, FormGroup, FormControl, ControlLabel, Modal, Toggle, DatePicker, AutoComplete, Input } from "rsuite";
import { store } from "../../redux/store";
import { toggleEditingEvent, deleteEvent } from "../../redux/actions";
import { connect } from "react-redux";
import { AppState, EventData } from "../../types";
import update_event from "../../utils/update_event";
import { fix_event_time } from "../../utils/fix_time";
import download_data from "../../utils/download_datas";

import delete_item from "../../utils/delete_item";
import { send_success_message, send_error_message } from "../send_message";

interface Props {
    event: EventData | null;
    toggleEditingEvent: () => void;
    editingEvent: boolean;
    deleteEvent: (_id: string) => void;
}

interface State {
    removing: boolean;
    loading: boolean;
    calendarTitle: string;
    calendar: string;
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

class EditEventModal extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.handleInput = this.handleInput.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
    }

    componentWillReceiveProps(nextProps: Props) {
        if (nextProps.event !== null) {
            const calendarTitle = store
                .getState()
                .systemStateReducer.calendars.filter((calendar) => calendar._id === nextProps.event?.calendar)[0];
            this.setState({
                calendarTitle: calendarTitle?.title ? calendarTitle.title : "行事曆標題",
                calendar: nextProps.event.calendar,
                ignore: nextProps.event?.ignore,
                allDay: nextProps.event.isAllDayEvent(),
                title: nextProps.event.title,
                startTime: nextProps.event.startTime,
                endTime: nextProps.event.endTime,
                description: nextProps.event.description,
                location: nextProps.event.location,
                ignoreReason: nextProps.event.ignoreReason,
                repeatID: nextProps.event.repeatID,
                _id: nextProps.event._id,
                color: nextProps.event.color,
            });
        }
    }

    handleInput(formValue: any) {
        if (this.props.event === null) return;
        this.setState({
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

    updateEvent() {
        this.setState({ loading: true });
        update_event(fix_event_time((this.state as unknown) as EventData)).then(async (res) => {
            if (res.status === 200) {
                download_data(this.state.startTime.getFullYear(), this.state.startTime.getMonth() + 1)
                    .then(() => {
                        this.props.toggleEditingEvent();
                        this.setState({ loading: false });
                        send_success_message("更新成功", "「" + this.props.event?.title + "」已被更新");
                    })
                    .catch(() => {
                        this.props.toggleEditingEvent();
                        this.setState({ loading: false });
                    });
            }
        });
    }

    deleteItem() {
        if (this.props.event === null) return;
        this.setState({ removing: true });
        delete_item(this.props.event._id)
            .then((res) => {
                if (res.status === 200)
                    download_data(this.state.startTime.getFullYear(), this.state.startTime.getMonth() + 1)
                        .then(() => {
                            if (this.props.event != null && this.props.event._id !== undefined)
                                this.props.deleteEvent(this.props.event?._id);
                            this.props.toggleEditingEvent();
                            this.setState({ removing: false });
                            send_success_message("刪除成功", "「" + this.props.event?.title + "」已被刪除");
                        })
                        .catch(() => {
                            this.props.toggleEditingEvent();
                            this.setState({ removing: false });
                        });
            })
            .catch((err) => {
                send_error_message("刪除失敗", err);
            });
    }

    render() {
        if (this.props.event !== null) {
            var ignoreReason = <p />;
            ignoreReason = this.state.ignore ? (
                <FormGroup>
                    <ControlLabel>忽略原因</ControlLabel>
                    <FormControl name="ignoreReason" />
                </FormGroup>
            ) : (
                <p />
            );
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
            return (
                <Modal
                    keyboard
                    show={this.props.editingEvent}
                    aria-labelledby="form-dialog-title"
                    width="xs"
                    onHide={() => this.props.toggleEditingEvent()}
                >
                    <Modal.Header closeButton>
                        <h5 style={{ marginLeft: 6, display: "inline-block" }}>{this.state.calendarTitle}</h5>
                    </Modal.Header>
                    <Modal.Body>
                        <Form formValue={this.state} onChange={this.handleInput}>
                            <FormGroup>
                                <ControlLabel>事件標題</ControlLabel>
                                <FormControl name="title" accepter={AutoComplete} className="DialogFormControl" autoComplete="off" />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>全天事件</ControlLabel>
                                <FormControl accepter={Toggle} name="allDay" checked={this.state.allDay} />
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
                                <FormControl name="location" accepter={AutoComplete} className="DialogFormControl" />
                            </FormGroup>
                            <FormGroup>
                                <ControlLabel>已忽略的事件</ControlLabel>
                                <FormControl accepter={Toggle} name="ignore" checked={this.state.ignore} />
                            </FormGroup>
                            {ignoreReason}
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
                                <Button onClick={this.props.toggleEditingEvent}>取消</Button>
                                <Button appearance="primary" onClick={this.updateEvent} loading={this.state.loading}>
                                    更新
                                </Button>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>
                    </Modal.Footer>
                </Modal>
            );
        } else return <Modal />;
    }
}

function mapStateToProps(state: AppState) {
    return {
        editingEvent: state.systemStateReducer.UI.editingEvent,
        event: state.systemStateReducer.UI.selectedEvent,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        toggleEditingEvent: () => dispatch(toggleEditingEvent()),
        deleteEvent: (_id: string) => dispatch(deleteEvent(_id)),
    };
}

const VisibleEditEventModal = connect(mapStateToProps, mapDispatchToProps)(EditEventModal);

export default VisibleEditEventModal;
