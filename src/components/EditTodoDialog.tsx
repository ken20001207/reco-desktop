import React from "react";
import { Button, FlexboxGrid, Form, FormGroup, FormControl, ControlLabel, Modal, Avatar, Toggle, DatePicker } from "rsuite";
import { EditTodoDialogProps } from "../utils/interfaces";

class EditTodoDialog extends React.Component<EditTodoDialogProps> {

    render() {
        if (this.props.inputing === undefined) return null;
        return (
            <Modal show={this.props.editingTodo} aria-labelledby="form-dialog-title" width="xs">
                <Modal.Header closeButton onClick={this.props.closeTodoEditDialog}>
                    <Avatar
                        style={{
                            backgroundImage:
                                "linear-gradient(315deg, " + this.props.selectedTodo.color[0] + " 0%, " + this.props.selectedTodo.color[1] + " 100%)",
                            color: "#ffffff"
                        }}
                    >
                        {this.props.selectedTodo.calendarTitle.charAt(0)}
                    </Avatar>{" "}
                    <h5 style={{ marginLeft: 6, display: "inline-block" }}>{this.props.selectedTodo.calendarTitle}</h5>
                </Modal.Header>
                <Modal.Body>
                    <Form formValue={this.props.inputing} onChange={this.props.handleFormChange}>
                        <FormGroup>
                            <ControlLabel>事件標題</ControlLabel>
                            <FormControl name="title" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>截止日期</ControlLabel>
                            <FormControl name="deadLine" accepter={DatePicker} format="YYYY-MM-DD HH:mm" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>補充敘述</ControlLabel>
                            <FormControl name="description" />
                        </FormGroup>
                        <FormGroup>
                            <ControlLabel>已完成</ControlLabel>
                            <FormControl accepter={Toggle} name="compelete" />
                        </FormGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <FlexboxGrid>
                        <FlexboxGrid.Item colspan={3} style={{ textAlign: "left" }}>
                            <Button color="red" onClick={this.props.removeTodo} loading={this.props.removing}>
                                刪除
                            </Button>
                        </FlexboxGrid.Item>
                        <FlexboxGrid.Item colspan={15} />
                        <FlexboxGrid.Item colspan={6} style={{ textAlign: "right" }}>
                            <Button onClick={this.props.closeTodoEditDialog}>取消</Button>
                            <Button appearance="primary" onClick={this.props.updateTodo} loading={this.props.waiting}>
                                更新
                            </Button>
                        </FlexboxGrid.Item>
                    </FlexboxGrid>
                </Modal.Footer>
            </Modal>
        );
    }
}

export default EditTodoDialog;
