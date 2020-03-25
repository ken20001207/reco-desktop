import React, { ReactNode } from "react";
import { CreateEventDialogProps } from "../utils/interfaces";

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
    AutoComplete
} from "rsuite";
import { Calendar } from "../utils/classes";
import { ItemDataType } from "rsuite/lib/@types/common";
import { getEventsAutoCompleteData } from "../utils/getAutoCompeleteData";

class CreateEventDialog extends React.Component<CreateEventDialogProps> {
    render() {
        if (this.props.inputing === undefined) return null;

        const { titles, descriptions, locations } = getEventsAutoCompleteData(this.props.inputing.calendar);

        var time = <p />;
        if (this.props.inputing.allday === undefined || !this.props.inputing.allday)
            time = (
                <FormGroup>
                    <FormGroup>
                        <ControlLabel>開始時間</ControlLabel>
                        <FormControl name="startTime" accepter={DatePicker} format="HH:mm" ranges={[]} />
                    </FormGroup>
                    <FormGroup>
                        <ControlLabel>結束時間</ControlLabel>
                        <FormControl name="endTime" accepter={DatePicker} format="HH:mm" ranges={[]} />
                    </FormGroup>
                </FormGroup>
            );
        var calendarOptions: Array<{ label: string; value: Calendar }> = [];
        if (this.props.userdata.calendars !== undefined) {
            calendarOptions = this.props.userdata.calendars.map(calendar => {
                return { label: calendar.title, value: calendar };
            });
        }

        return (
            <Modal keyboard show={this.props.creatingEvent} aria-labelledby="form-dialog-title" width="xs">
                <Modal.Header closeButton onClick={this.props.closeEventCreateDialog}>
                    <h5>創建新事件</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.props.inputing} onChange={this.props.handleFormChange}>
                        <FormGroup>
                            <ControlLabel>行事曆</ControlLabel>
                            <FormControl
                                name="calendar"
                                data={calendarOptions}
                                defaultValue={this.props.inputing.calendar}
                                style={{ width: 180, height: 60 }}
                                appearance="subtle"
                                accepter={SelectPicker}
                                renderMenuItem={(label: ReactNode, item: ItemDataType) => {
                                    return (
                                        <div
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(315deg, " +
                                                    item.value.color[0] +
                                                    " 0%, " +
                                                    item.value.color[1] +
                                                    " 100%)",
                                                padding: 8,
                                                borderRadius: 8,
                                                color: "white"
                                            }}
                                        >
                                            <p style={{ fontWeight: "bolder" }}>{label}</p>
                                        </div>
                                    );
                                }}
                                renderValue={(value: Calendar, item: any) => {
                                    return (
                                        <div
                                            style={{
                                                backgroundImage:
                                                    "linear-gradient(315deg, " +
                                                    item.value.color[0] +
                                                    " 0%, " +
                                                    item.value.color[1] +
                                                    " 100%)",
                                                padding: 8,
                                                borderRadius: 8,
                                                color: "white"
                                            }}
                                        >
                                            <p style={{ fontWeight: "bolder" }}>{value.title}</p>
                                        </div>
                                    );
                                }}
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>事件標題</ControlLabel>
                            <FormControl
                                className="DialogFormControl"
                                name="title"
                                accepter={AutoComplete}
                                autoComplete="off"
                                data={titles}
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>日期</ControlLabel>
                            <FormControl className="DialogFormControl" name="date" accepter={DatePicker} oneTap />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>全天事件</ControlLabel>
                            <FormControl accepter={Toggle} name="allday" />
                        </FormGroup>
                        {time}
                        <FormGroup>
                            <ControlLabel>詳細敘述</ControlLabel>
                            <FormControl
                                className="DialogFormControl"
                                name="description"
                                accepter={AutoComplete}
                                autoComplete="off"
                                data={descriptions}
                            />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>地點</ControlLabel>
                            <FormControl
                                className="DialogFormControl"
                                name="location"
                                accepter={AutoComplete}
                                autoComplete="off"
                                data={locations}
                            />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={3} style={{ textAlign: "left" }}>
                            <Button color="violet" onClick={this.props.openRepeatCreateDialog} loading={this.props.waiting}>
                                創建系列
                            </Button>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={15} />
                        <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                            <Button onClick={this.props.closeEventCreateDialog}>取消</Button>
                            <Button appearance="primary" onClick={this.props.createEvent} loading={this.props.waiting}>
                                創立
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CreateEventDialog;
