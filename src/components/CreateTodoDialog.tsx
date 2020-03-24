import React, { ReactNode } from "react";
import { CreateTodoDialogProps } from "../utils/interfaces";

import { FlexboxGrid, Button, Form, FormGroup, FormControl, ControlLabel, SelectPicker, Modal, DatePicker } from "rsuite";
import { Calendar } from "../utils/classes";
import { ItemDataType } from "rsuite/lib/@types/common";

export default class CreateTodoDialog extends React.Component<CreateTodoDialogProps> {
    render() {
        if (this.props.inputing === undefined) return null;
        
        var calendarOptions: Array<{ label: string; value: Calendar }> = [];
        if (this.props.userdata.calendars !== undefined) {
            calendarOptions = this.props.userdata.calendars.map(calendar => {
                return { label: calendar.title, value: calendar };
            });
        }

        return (
            <Modal keyboard show={this.props.creatingTodo} aria-labelledby="form-dialog-title" width="xs">
                <Modal.Header closeButton onClick={this.props.closeTodoCreateDialog}>
                    <h5>創建新待辦事項</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.props.inputing} onChange={this.props.handleFormChange}>
                        <FormGroup>
                            <ControlLabel>行事曆</ControlLabel>
                            <FormControl
                                name="calendar"
                                data={calendarOptions}
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
                            <ControlLabel>待辦事項標題</ControlLabel>
                            <FormControl name="title" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>截止期限</ControlLabel>
                            <FormControl name="deadLine" accepter={DatePicker} format="YYYY-MM-DD HH:mm" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>補充敘述</ControlLabel>
                            <FormControl name="description" />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={15} />
                        <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                            <Button onClick={this.props.closeTodoCreateDialog}>取消</Button>
                            <Button appearance="primary" onClick={this.props.createTodo} loading={this.props.waiting}>
                                創立
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Modal.Footer>
            </Modal>
        );
    }
}