import React from "react";
import { Button, FlexboxGrid, Form, FormGroup, FormControl, ControlLabel, Modal, Avatar, Toggle, DatePicker, AutoComplete } from "rsuite";
import { EditEventDialogProps } from "../utils/interfaces";
import { getEventsAutoCompleteData } from "../utils/getAutoCompeleteData";

class EditEventDialog extends React.Component<EditEventDialogProps> {
    render() {
        if (this.props.inputing === undefined) return null;

        const { titles, descriptions, locations } = getEventsAutoCompleteData(this.props.inputing.calendar);

        var ignoreReason = <p />;
        if (this.props.inputing.ignore !== undefined)
            ignoreReason = this.props.inputing.ignore ? (
                <FormGroup>
                    <ControlLabel>忽略原因</ControlLabel>
                    <FormControl name="ignoreReason" />
                </FormGroup>
            ) : (
                <p />
            );
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
        return (
            <Modal show={this.props.editingEvent} aria-labelledby="form-dialog-title" width="xs">
                <Modal.Header closeButton onClick={this.props.closeEventEditDialog}>
                    <Avatar
                        style={{
                            backgroundImage:
                                "linear-gradient(315deg, " +
                                this.props.selectedEvent.color[0] +
                                " 0%, " +
                                this.props.selectedEvent.color[1] +
                                " 100%)",
                            color: "#ffffff"
                        }}
                    >
                        {this.props.selectedEvent.calendarTitle.charAt(0)}
                    </Avatar>{" "}
                    <h5 style={{ marginLeft: 6, display: "inline-block" }}>{this.props.selectedEvent.calendarTitle}</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.props.inputing} onChange={this.props.handleFormChange}>
                        <FormGroup>
                            <ControlLabel>事件標題</ControlLabel>
                            <FormControl name="title" accepter={AutoComplete} data={titles} className="DialogFormControl" autoComplete="off"/>
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>日期</ControlLabel>
                            <FormControl name="date" accepter={DatePicker} oneTap className="DialogFormControl" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>全天事件</ControlLabel>
                            <FormControl accepter={Toggle} name="allday" checked={this.props.inputing.allday} />
                        </FormGroup>
                        {time}
                        <FormGroup>
                            <ControlLabel>詳細敘述</ControlLabel>
                            <FormControl name="description" accepter={AutoComplete} data={descriptions} className="DialogFormControl" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>地點</ControlLabel>
                            <FormControl name="location" accepter={AutoComplete} data={locations} className="DialogFormControl" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>已忽略的事件</ControlLabel>
                            <FormControl accepter={Toggle} name="ignore" checked={this.props.inputing.ignore} />
                        </FormGroup>
                        {ignoreReason}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={3} style={{ textAlign: "left" }}>
                            <Button color="red" onClick={this.props.removeEvent} loading={this.props.removing}>
                                刪除
                            </Button>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={15} />
                        <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                            <Button onClick={this.props.closeEventEditDialog}>取消</Button>
                            <Button appearance="primary" onClick={this.props.updateEvent} loading={this.props.waiting}>
                                更新
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EditEventDialog;
