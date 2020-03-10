import React from "react";
import { CreateRepeatDialogProps } from "../utils/interfaces";

import { Button, Form, FormGroup, FormControl, ControlLabel, SelectPicker, Modal, Toggle } from "rsuite";
import { Calendar } from "../utils/classes";

class CreateRepeatDialog extends React.Component<CreateRepeatDialogProps> {
    
    render() {
        if (this.props.inputing === undefined || this.props.inputing.cycle === undefined) return null;

        var time = <p />;
        if (this.props.inputing.allday === undefined || !this.props.inputing.allday)
            time = (
                <FormGroup>
                    <ControlLabel>時間</ControlLabel>
                    <FormControl name="time" />
                </FormGroup>
            );

        var calendarOptions: Array<{ label: string, value: Calendar }> = [];
        if (this.props.userdata.calendars !== undefined) {
            calendarOptions = this.props.userdata.calendars.map(calendar => {
                return { label: calendar.title, value: calendar };
            });
        }

        var cycleOptions = [
            { label: "每周重複", value: "Week" },
            { label: "每月重複", value: "Month" }
        ];

        var repeatData = null;
        if (this.props.inputing.cycle === "Week") {
            repeatData = (
                <FormGroup>
                    <ControlLabel>星期幾</ControlLabel>
                    <FormControl name="repeatData" />
                </FormGroup>
            );
        } else if (this.props.inputing.cycle === "Month") {
            repeatData = (
                <FormGroup>
                    <ControlLabel>每月幾號</ControlLabel>
                    <FormControl name="repeatData" />
                </FormGroup>
            );
        }

        return (
            <Modal keyboard show={this.props.creatingRepeat} aria-labelledby="form-dialog-title" width="xs">
                <Modal.Header closeButton onClick={this.props.closeRepeatCreateDialog}>
                    <h5>創建新系列</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.props.inputing} onChange={this.props.handleFormChange}>
                        <FormGroup>
                            <ControlLabel>行事曆</ControlLabel>
                            <FormControl name="calendar" data={calendarOptions} accepter={SelectPicker} />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>系列名稱</ControlLabel>
                            <FormControl name="title" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>起始日期</ControlLabel>
                            <FormControl name="startDate" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>結束日期</ControlLabel>
                            <FormControl name="endDate" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>循環週期</ControlLabel>
                            <FormControl name="cycle" data={cycleOptions} accepter={SelectPicker} />
                        </FormGroup>
                        {repeatData}
                        <FormGroup>
                            <ControlLabel>全天事件</ControlLabel>
                            <FormControl accepter={Toggle} name="allday" />
                        </FormGroup>
                        {time}
                        <FormGroup>
                            <ControlLabel>詳細敘述</ControlLabel>
                            <FormControl name="description" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>地點</ControlLabel>
                            <FormControl name="location" />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.closeRepeatCreateDialog}>取消</Button>
                    <Button appearance="primary" onClick={this.props.createRepeat} loading={this.props.waiting}>
                        創立
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default CreateRepeatDialog;
