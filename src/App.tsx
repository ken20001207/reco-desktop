import React from "react";
import { Helmet } from "react-helmet";
import DayPicker from "react-day-picker";
import { Transition } from "react-transition-group";

import DayView from "./components/DayView";
import AllDayEvents from "./components/AllDayEvents";
import TodoDisplay from "./components/TodoDisplay";
import EditEventDialog from "./components/EditEventDialog";
import CreateEventDialog from "./components/CreateEventDialog";
import CreateRepeatDialog from "./components/CreateRepeatDialog";

import { User, Event, Repeat, Calendar, Todo } from "./utils/classes";
import { IndexStates, IndexProps, Inputing } from "./utils/interfaces";
import { duration, defaultStyle, transitionStyles } from "./utils/config";
import {
    getDayDescription,
    eventsToDispay,
    allDayEventsToDispay,
    buildRepeatToEvent,
    createEvent,
    updateUserData,
    getUserData,
    todosToDisplay,
    createTodo
} from "./utils/methods";

import { Loader, Panel, FlexboxGrid, Divider } from "rsuite";

import "rsuite/dist/styles/rsuite-dark.css";
import "./App.css";
import CreateTodoDialog from "./components/CreateTodoDialog";
import EditTodoDialog from "./components/EditTodoDialog";

class index extends React.Component<IndexProps, IndexStates> {
    dayviewContainer: React.RefObject<HTMLDivElement>;
    interval: NodeJS.Timeout = setInterval(() => this.setState({ now: new Date() }), 1000);
    constructor(props: Readonly<IndexProps>) {
        super(props);
        this.state = {
            loaded: false,
            waiting: false,
            removing: false,
            selectedDay: new Date(),
            eventsToDispay: [],
            userdata: new User(),
            filled: [],
            editingEvent: false,
            editingTodo: false,
            creatingEvent: false,
            creatingRepeat: false,
            creatingTodo: false,
            selectedEvent: new Event(),
            selectedTodo: new Todo(),
            inputing: {
                title: "",
                date: new Date(),
                ignore: false,
                ignoreReason: "",
                allday: false,
                calendar: { label: "", value: new Calendar() },
                startTime: new Date(),
                endTime: new Date(),
                deadLine: new Date(),
                cycle: "",
                description: "",
                location: "",
                repeatData: 0,
                compelete: false
            },
            screenWidth: 0,
            screenHeight: 0,
            displayEventInfoDrawer: false,
            now: new Date()
        };

        this.handleDayClick = this.handleDayClick.bind(this);
        this.openEventEditDialog = this.openEventEditDialog.bind(this);
        this.closeEventEditDialog = this.closeEventEditDialog.bind(this);
        this.openEventCreateDialog = this.openEventCreateDialog.bind(this);
        this.closeEventCreateDialog = this.closeEventCreateDialog.bind(this);
        this.openRepeatCreateDialog = this.openRepeatCreateDialog.bind(this);
        this.closeRepeatCreateDialog = this.closeRepeatCreateDialog.bind(this);
        this.updateEvent = this.updateEvent.bind(this);
        this.updateTodo = this.updateTodo.bind(this);
        this.createEvent = this.createEvent.bind(this);
        this.createTodo = this.createTodo.bind(this);
        this.createRepeat = this.createRepeat.bind(this);
        this.removeEvent = this.removeEvent.bind(this);
        this.removeTodo = this.removeTodo.bind(this);
        this.handleFormChange = this.handleFormChange.bind(this);
        this.keyboardHandler = this.keyboardHandler.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.openTodoCreateDialog = this.openTodoCreateDialog.bind(this);
        this.openTodoEditDialog = this.openTodoEditDialog.bind(this);
        this.closeTodoCreateDialog = this.closeTodoCreateDialog.bind(this);

        this.dayviewContainer = React.createRef<HTMLDivElement>();
    }

    async handleDayClick(day: Date) {
        buildRepeatToEvent(this.state.userdata, day).then(newdata => {
            if (newdata.changed) updateUserData(newdata.data);
            this.setState({
                selectedDay: day,
                loaded: true,
                userdata: newdata.data
            });
        });
    }

    keyboardHandler(e: KeyboardEvent) {
        if (e.keyCode === 27) {
            // ESC
            this.setState({
                creatingEvent: false,
                editingEvent: false,
                creatingRepeat: false
            });
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    async componentDidMount() {
        // screen Size Listener
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        // get User Data
        getUserData("ken20001207").then(data => {
            const userdata = new User(data as User);
            this.setState({ userdata: userdata, loaded: true });
            return null;
        });

        // Keyboard Listener
        document.addEventListener("keydown", this.keyboardHandler, false);
    }

    updateWindowDimensions() {
        this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
    }

    openEventEditDialog(event: Event) {
        this.setState({
            selectedEvent: event,
            editingEvent: true,
            inputing: {
                title: event.title,
                date: event.startTime,
                ignore: event.ignore,
                ignoreReason: event.ignoreReason === undefined ? "" : event.ignoreReason,
                allday: event.isAllDayEvent(),
                calendar: { label: "", value: new Calendar() },
                startTime: event.startTime,
                endTime: event.endTime,
                cycle: "",
                deadLine: new Date(),
                repeatData: 0,
                description: event.description,
                location: event.location,
                compelete: false
            }
        });
    }

    closeEventEditDialog() {
        this.setState({ editingEvent: false });
    }

    openEventCreateDialog() {
        this.setState({
            creatingEvent: true,
            inputing: {
                title: "",
                date: this.state.selectedDay,
                calendar: { label: this.state.userdata.calendars[0].title, value: this.state.userdata.calendars[0] },
                allday: false,
                ignore: false,
                ignoreReason: "",
                startTime: this.state.selectedDay,
                endTime: this.state.selectedDay,
                cycle: "",
                deadLine: new Date(),
                description: "",
                location: "",
                repeatData: 0,
                compelete: false
            }
        });
    }

    openTodoCreateDialog() {
        this.setState({
            creatingTodo: true,
            inputing: {
                title: "",
                date: this.state.selectedDay,
                deadLine: this.state.selectedDay,
                calendar: { label: this.state.userdata.calendars[0].title, value: this.state.userdata.calendars[0] },
                allday: false,
                ignore: false,
                ignoreReason: "",
                startTime: new Date(),
                endTime: new Date(),
                cycle: "",
                compelete: false,
                description: "",
                location: "",
                repeatData: 0
            }
        });
    }

    openTodoEditDialog(todo: Todo) {
        this.setState({
            selectedTodo: todo,
            editingTodo: true,
            inputing: {
                title: todo.name,
                deadLine: todo.DeadLine,
                date: new Date(),
                ignore: false,
                ignoreReason: "",
                allday: false,
                calendar: { label: "", value: new Calendar() },
                startTime: new Date(),
                endTime: new Date(),
                cycle: "",
                repeatData: 0,
                description: todo.description,
                location: "",
                compelete: todo.complete
            }
        });
    }

    openRepeatCreateDialog() {
        this.setState({
            creatingEvent: false,
            creatingRepeat: true,
            inputing: {
                title: "",
                startTime: this.state.selectedDay,
                endTime: this.state.selectedDay,
                cycle: "Week",
                repeatData: 0,
                calendar: { label: this.state.userdata.calendars[0].title, value: this.state.userdata.calendars[0] },
                allday: false,
                date: this.state.selectedDay,
                deadLine: new Date(),
                description: "",
                location: "",
                ignore: false,
                ignoreReason: "",
                compelete: false
            }
        });
    }

    closeRepeatCreateDialog() {
        this.setState({ creatingRepeat: false });
    }

    closeEventCreateDialog() {
        this.setState({ creatingEvent: false });
    }

    closeTodoCreateDialog() {
        this.setState({ creatingTodo: false });
    }

    async createEvent() {
        this.setState({
            waiting: true
        });
        var newStartTime = new Date();
        var newEndTime = new Date();
        newStartTime.setFullYear(
            +this.state.inputing.date.getFullYear(),
            +this.state.inputing.date.getMonth(),
            +this.state.inputing.date.getDate()
        );
        newEndTime.setFullYear(
            +this.state.inputing.date.getFullYear(),
            +this.state.inputing.date.getMonth(),
            +this.state.inputing.date.getDate()
        );
        if (this.state.inputing.allday) {
            newStartTime.setHours(0, 0);
            newEndTime.setHours(24, 0);
        } else {
            newStartTime.setHours(+this.state.inputing.startTime.getHours(), +this.state.inputing.startTime.getMinutes());
            newEndTime.setHours(+this.state.inputing.endTime.getHours(), +this.state.inputing.endTime.getMinutes());
        }
        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            if (calendar.title === this.state.inputing.calendar.label) {
                calendar.events.push(
                    createEvent(
                        this.state.inputing.title,
                        calendar.color,
                        newStartTime,
                        newEndTime,
                        "",
                        false,
                        false,
                        this.state.inputing.description,
                        this.state.inputing.location,
                        calendar.title
                    )
                );
            }
            return null;
        });

        // 更新視圖
        var etd = eventsToDispay(newdata.calendars, new Date());
        this.setState({ userdata: newdata, eventsToDispay: etd, waiting: false, creatingEvent: false });

        // 上傳更新到資料庫
        updateUserData(newdata);
    }

    async createTodo() {
        this.setState({
            waiting: true
        });
        var newdeadLine = this.state.inputing.deadLine;
        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            if (calendar.title === this.state.inputing.calendar.label) {
                calendar.todos.push(
                    createTodo(this.state.inputing.title, calendar.color, this.state.inputing.description, calendar.title, newdeadLine)
                );
            }
            return null;
        });

        // 更新視圖
        this.setState({ userdata: newdata, waiting: false, creatingTodo: false });

        // 上傳更新到資料庫
        updateUserData(newdata);
    }

    async createRepeat() {
        this.setState({
            waiting: true
        });
        var startDate = new Date();
        var endDate = new Date();
        startDate.setFullYear(
            +this.state.inputing.date.getFullYear(),
            +this.state.inputing.date.getMonth(),
            +this.state.inputing.date.getDate()
        );
        endDate.setFullYear(
            +this.state.inputing.date.getFullYear(),
            +this.state.inputing.date.getMonth(),
            +this.state.inputing.date.getDate()
        );
        var newStartTime = new Date();
        var newEndTime = new Date();
        newStartTime.setFullYear(
            +this.state.inputing.startTime.getFullYear(),
            +this.state.inputing.startTime.getMonth(),
            +this.state.inputing.startTime.getDate()
        );
        newEndTime.setFullYear(
            +this.state.inputing.endTime.getFullYear(),
            +this.state.inputing.endTime.getMonth(),
            +this.state.inputing.endTime.getDate()
        );
        if (this.state.inputing.allday) {
            newStartTime.setHours(0, 0);
            newEndTime.setHours(23, 59);
        } else {
            newStartTime.setHours(+this.state.inputing.startTime.getHours(), +this.state.inputing.startTime.getMinutes());
            newEndTime.setHours(+this.state.inputing.endTime.getHours(), +this.state.inputing.endTime.getMinutes());
        }
        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            if (calendar.title === this.state.inputing.calendar.label) {
                var newRepeat = new Repeat();
                newRepeat.name = this.state.inputing.title;
                newRepeat.startDate = startDate;
                newRepeat.endDate = endDate;
                newRepeat.startTime = newStartTime;
                newRepeat.endTime = newEndTime;
                newRepeat.cycle = this.state.inputing.cycle;
                newRepeat.repeatData = this.state.inputing.repeatData;
                newRepeat.description = this.state.inputing.description;
                newRepeat.location = this.state.inputing.location;
                calendar.repeats.push(newRepeat);
            }
            return null;
        });
        newdata = (await buildRepeatToEvent(newdata, this.state.selectedDay)).data;

        // 更新視圖
        var etd = eventsToDispay(newdata.calendars, new Date());
        this.setState({ userdata: newdata, eventsToDispay: etd, waiting: false, creatingRepeat: false });

        // 上傳變更到數據庫
        updateUserData(newdata);
    }

    async updateEvent() {
        this.setState({
            waiting: true
        });
        var newStartTime = new Date();
        var newEndTime = new Date();
        newStartTime.setFullYear(
            +this.state.inputing.date.getFullYear(),
            +this.state.inputing.date.getMonth(),
            +this.state.inputing.date.getDate()
        );
        newEndTime.setFullYear(
            +this.state.inputing.date.getFullYear(),
            +this.state.inputing.date.getMonth(),
            +this.state.inputing.date.getDate()
        );
        if (this.state.inputing.allday) {
            newStartTime.setHours(0, 0);
            newEndTime.setHours(24, 0);
        } else {
            newStartTime.setHours(+this.state.inputing.startTime.getHours(), +this.state.inputing.startTime.getMinutes());
            newEndTime.setHours(+this.state.inputing.endTime.getHours(), +this.state.inputing.endTime.getMinutes());
        }
        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            calendar.events.map(event => {
                if (event.id === this.state.selectedEvent.id) {
                    event.startTime = newStartTime;
                    event.endTime = newEndTime;
                    event.title = this.state.inputing.title;
                    event.ignore = this.state.inputing.ignore;
                    event.ignoreReason = this.state.inputing.ignoreReason;
                    event.description = this.state.inputing.description;
                    event.location = this.state.inputing.location;
                }
                return null;
            });
            return null;
        });

        // 更新視圖
        var etd = eventsToDispay(newdata.calendars, new Date());
        this.setState({ userdata: newdata, eventsToDispay: etd, waiting: false, editingEvent: false });

        // 上傳變更到資料庫
        updateUserData(newdata);
    }

    async removeEvent() {
        this.setState({
            removing: true
        });
        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            var targetEvent = null;
            calendar.events.map(event => {
                if (event.id === this.state.selectedEvent.id) {
                    targetEvent = event;
                }
                return null;
            });
            if (targetEvent != null) calendar.events.splice(calendar.events.indexOf(targetEvent), 1);
            return null;
        });

        // 更新視圖
        var etd = eventsToDispay(newdata.calendars, new Date());
        this.setState({ userdata: newdata, eventsToDispay: etd, removing: false, editingEvent: false });

        // 上傳變更到資料庫
        updateUserData(newdata);
    }

    async updateTodo() {
        this.setState({
            waiting: true
        });
        var newdeadLine = this.state.inputing.deadLine;

        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            calendar.todos.map(todo => {
                if (todo.id === this.state.selectedTodo.id) {
                    todo.DeadLine = newdeadLine;
                    todo.name = this.state.inputing.title;
                    todo.description = this.state.inputing.description;
                    todo.complete = this.state.inputing.compelete;
                }
                return null;
            });
            return null;
        });

        // 更新視圖
        var etd = eventsToDispay(newdata.calendars, new Date());
        this.setState({ userdata: newdata, eventsToDispay: etd, waiting: false, editingTodo: false });

        // 上傳變更到資料庫
        updateUserData(newdata);
    }

    async removeTodo() {
        this.setState({
            removing: true
        });
        var newdata = this.state.userdata;
        newdata.calendars.map(calendar => {
            var targetTodo = null;
            calendar.todos.map(todo => {
                if (todo.id === this.state.selectedTodo.id) {
                    targetTodo = todo;
                }
                return null;
            });
            if (targetTodo != null) calendar.todos.splice(calendar.todos.indexOf(targetTodo), 1);
            return null;
        });

        // 更新視圖
        this.setState({ userdata: newdata, removing: false, editingTodo: false });

        // 上傳變更到資料庫
        updateUserData(newdata);
    }

    handleFormChange(value: Inputing) {
        this.setState({
            inputing: {
                ignoreReason: value.ignoreReason,
                ignore: value.ignore,
                calendar: value.calendar,
                cycle: value.cycle,
                repeatData: value.repeatData,
                date: value.date,
                title: value.title,
                allday: value.allday,
                startTime: value.startTime,
                endTime: value.endTime,
                description: value.description,
                location: value.location,
                deadLine: value.deadLine,
                compelete: value.compelete
            }
        });
    }

    render() {
        var DayviewContent = <Loader />;
        var AllDayEventsContent = <Loader />;
        var TodosContent = <Loader />;
        if (this.state.userdata.calendars !== undefined) {
            var etd = eventsToDispay(this.state.userdata.calendars, this.state.selectedDay);
            var ade = allDayEventsToDispay(this.state.userdata.calendars, this.state.selectedDay);
            var todos = todosToDisplay(this.state.userdata.calendars, this.state.selectedDay);
            DayviewContent = (
                <DayView
                    container={this.dayviewContainer}
                    events={etd}
                    openEventEditDialog={this.openEventEditDialog}
                    openEventCreateDialog={this.openEventCreateDialog}
                />
            );
            AllDayEventsContent = (
                <AllDayEvents
                    container={this.dayviewContainer}
                    events={ade}
                    openEventEditDialog={this.openEventEditDialog}
                    openEventCreateDialog={this.openEventCreateDialog}
                />
            );
            TodosContent = (
                <TodoDisplay
                    container={this.dayviewContainer}
                    todos={todos}
                    openTodoEditDialog={this.openTodoEditDialog}
                    openTodoCreateDialog={this.openTodoCreateDialog}
                />
            );
        }
        var Hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        var HourLines = Hours.map(hour => {
            return (
                <div key={hour} style={{ position: "absolute", top: hour * 60, width: "100%", margin: 0 }}>
                    <p style={{ lineHeight: 0, color: "rgba(255,255,255,0.2)" }}>{hour + ":00"}</p>
                    <Divider style={{ marginLeft: 64, marginTop: 0, marginBottom: 0, height: 2, backgroundColor: "rgb(40,40,40)" }} />
                </div>
            );
        });

        var NowLine =
            getDayDescription(this.state.selectedDay) === "今天" ? (
                <div
                    style={{
                        zIndex: 2000,
                        position: "absolute",
                        top: this.state.now.getHours() * 60 + this.state.now.getMinutes(),
                        width: "100%",
                        margin: 0
                    }}
                >
                    <p style={{ lineHeight: 0, color: "red", fontWeight: "bolder" }}>
                        {this.state.now.getHours() + ":" + this.state.now.getMinutes()}
                    </p>
                    <Divider
                        style={{
                            backgroundColor: "red",
                            width: "90%",
                            marginLeft: 48,
                            marginTop: 0,
                            height: 2
                        }}
                    />
                </div>
            ) : null;

        const monthNames = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        var dayDescription = getDayDescription(this.state.selectedDay);

        return (
            <div style={{ backgroundColor: "rgba(26,26,26,0)" }}>
                <Helmet>Reco</Helmet>

                <div className="DragBar" style={{ width: "100%", position: "fixed", top: 0, left: 0, height: 30 }}></div>

                <div style={{ display: "inline-block", width: 280, verticalAlign: "top" }}>
                    <div
                        style={{
                            width: "100%",
                            backgroundColor: "rgba(42,42,43,0.8)",
                            height: "100vh",
                            borderRightColor: "black",
                            borderRightWidth: "10px",
                            paddingTop: 36
                        }}
                    >
                        <div className="appLogo">
                            <img style={{ width: 80, display: "inline-block" }} src="logofontf.png" alt="" />
                            <p style={{ fontSize: 12, display: "inline-block", marginLeft: 12, verticalAlign: "bottom", paddingBottom: 4 }}>
                                內部開發版本
                            </p>
                        </div>
                        <div className="day-picker-panel" style={{ position: "fixed", bottom: 18 }}>
                            <DayPicker selectedDays={this.state.selectedDay} onDayClick={this.handleDayClick} />
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "inline-block",
                        width: 320,
                        backgroundColor: "rgb(30,30,30)",
                        verticalAlign: "top",
                        height: this.state.screenHeight,
                        paddingLeft: 36,
                        paddingRight: 36,
                        paddingTop: 60
                    }}
                >
                    <div className="day-info">
                        <p>{dayDescription}</p>
                        <h1>{this.state.selectedDay.getDate()}</h1>
                        <h3>
                            {monthNames[this.state.selectedDay.getMonth()]} {this.state.selectedDay.getFullYear()}{" "}
                        </h3>
                    </div>
                    <div className="day-view-panel">
                        <div className="day-view-scroll" onDoubleClick={this.openTodoCreateDialog}>
                            <Transition in={this.state.loaded} timeout={duration}>
                                {state => (
                                    <div
                                        style={{
                                            ...defaultStyle,
                                            ...transitionStyles[state]
                                        }}
                                    >
                                        {AllDayEventsContent}
                                        {TodosContent}
                                    </div>
                                )}
                            </Transition>
                        </div>
                    </div>
                </div>
                <div
                    style={{
                        display: "inline-block",
                        width: this.state.screenWidth - 600,
                        verticalAlign: "top",
                        backgroundColor: "rgba(26,26,26,1)"
                    }}
                >
                    <Panel bodyFill onDoubleClick={this.openEventCreateDialog} style={{ width: "100%" }}>
                        <div
                            style={{
                                overflowY: "scroll",
                                height: "100vh"
                            }}
                        >
                            <div
                                style={{
                                    height: 1620,
                                    paddingTop: 100,
                                    position: "relative"
                                }}
                                ref={this.dayviewContainer}
                            >
                                <FlexboxGrid justify="center" style={{ marginLeft: 60 }}>
                                    <FlexboxGrid.Item colspan={16} style={{ maxWidth: 560 }}>
                                        {HourLines}
                                        {NowLine}
                                        <Transition in={this.state.loaded} timeout={duration}>
                                            {state => (
                                                <div
                                                    style={{
                                                        ...defaultStyle,
                                                        ...transitionStyles[state]
                                                    }}
                                                >
                                                    {DayviewContent}
                                                </div>
                                            )}
                                        </Transition>
                                    </FlexboxGrid.Item>
                                </FlexboxGrid>
                            </div>
                        </div>
                    </Panel>
                </div>

                <EditEventDialog
                    editingEvent={this.state.editingEvent}
                    closeEventEditDialog={this.closeEventEditDialog}
                    selectedEvent={this.state.selectedEvent}
                    inputing={this.state.inputing}
                    handleFormChange={this.handleFormChange}
                    removeEvent={this.removeEvent}
                    removing={this.state.removing}
                    updateEvent={this.updateEvent}
                    waiting={this.state.waiting}
                />

                <EditTodoDialog
                    editingTodo={this.state.editingTodo}
                    closeTodoEditDialog={() => this.setState({ editingTodo: false })}
                    selectedTodo={this.state.selectedTodo}
                    inputing={this.state.inputing}
                    handleFormChange={this.handleFormChange}
                    removeTodo={this.removeTodo}
                    removing={this.state.removing}
                    updateTodo={this.updateTodo}
                    waiting={this.state.waiting}
                />

                <CreateEventDialog
                    userdata={this.state.userdata}
                    creatingEvent={this.state.creatingEvent}
                    closeEventCreateDialog={this.closeEventCreateDialog}
                    inputing={this.state.inputing}
                    handleFormChange={this.handleFormChange}
                    createEvent={this.createEvent}
                    waiting={this.state.waiting}
                    openRepeatCreateDialog={this.openRepeatCreateDialog}
                />

                <CreateTodoDialog
                    userdata={this.state.userdata}
                    creatingTodo={this.state.creatingTodo}
                    closeTodoCreateDialog={this.closeTodoCreateDialog}
                    inputing={this.state.inputing}
                    handleFormChange={this.handleFormChange}
                    createTodo={this.createTodo}
                    waiting={this.state.waiting}
                />

                <CreateRepeatDialog
                    userdata={this.state.userdata}
                    creatingRepeat={this.state.creatingRepeat}
                    closeRepeatCreateDialog={this.closeRepeatCreateDialog}
                    inputing={this.state.inputing}
                    handleFormChange={this.handleFormChange}
                    createRepeat={this.createRepeat}
                    waiting={this.state.waiting}
                />
            </div>
        );
    }
}

export default index;
