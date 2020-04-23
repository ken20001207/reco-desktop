import React from "react";
import DayPicker from "react-day-picker";

import DayView from "./components/Views/DayView";
import AllDayEvents from "./components/Views/AllDayEvents";
import TodoDisplay from "./components/Views/TodoDisplay";
import EditEventDialog from "./components/Modals/EditEventModal";
import CreateEventDialog from "./components/Modals/CreateEventModal";

import { Loader, Row, Grid } from "rsuite";
import "rsuite/dist/styles/rsuite-dark.css";
import "./App.css";
import "./style/style.css";
import CreateTodoDialog from "./components/Modals/CreateTodoModal";
import EditTodoDialog from "./components/Modals/EditTodoModal";
import check_session from "./utils/check_session";
import { store } from "./redux/store";
import { updateUser, updateCalendar } from "./redux/actions";
import { UserData, CalendarData } from "./types";
import download_data from "./utils/download_datas";
import { getDayDescription } from "./utils/getDayDescription";
import { send_success_message, send_info_message } from "./components/send_message";

interface IndexStates {
    selectedDay: Date;
    screenWidth: number;
    screenHeight: number;
}

interface Props {}

class index extends React.Component<Props, IndexStates> {
    dayviewContainer: React.RefObject<HTMLDivElement>;
    constructor(props: Props) {
        super(props);
        this.state = {
            selectedDay: new Date(),
            screenWidth: 1800,
            screenHeight: 600,
        };
        this.handleDayClick = this.handleDayClick.bind(this);
        this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
        this.dayviewContainer = React.createRef<HTMLDivElement>();
    }

    async handleDayClick(day: Date) {
        if (store.getState().systemStateReducer.events.filter((event) => event.startTime.getMonth() === day.getMonth()).length === 0)
            download_data(day.getFullYear(), day.getMonth() + 1);
        this.setState({
            selectedDay: day,
        });
    }

    componentDidMount() {
        // screen Size Listener
        this.updateWindowDimensions();
        window.addEventListener("resize", this.updateWindowDimensions);

        // 登入驗證
        check_session().then(async (res) => {
            if (res.status === 200) {
                // 登入成功
                send_success_message("Session 登入成功", "已經使用 Session 完成自動登入");

                // 保存 User Data
                const userdata = ((await res.json()) as unknown) as { calendars: Array<CalendarData>; user: UserData };
                store.dispatch(updateUser(userdata.user));
                userdata.calendars.map((calendar) => store.dispatch(updateCalendar(calendar)));

                // 保存 Calendars
                userdata.calendars.map((calendar) => {
                    store.dispatch(updateCalendar(calendar));
                    return null;
                });

                // 下載當月的 Events 和 Todos
                const today = new Date();
                download_data(today.getFullYear(), today.getMonth() + 1);
            } else {
                send_info_message("登入狀態已經過期", "登入功能尚未實現，敬請期待");
            }
        });
    }

    updateWindowDimensions() {
        this.setState({ screenWidth: window.innerWidth, screenHeight: window.innerHeight });
    }

    render() {
        var AllDayEventsContent = <Loader />;
        var TodosContent = <Loader />;

        if (store.getState().systemStateReducer.calendars !== undefined) {
            AllDayEventsContent = <AllDayEvents container={this.dayviewContainer} displayDate={this.state.selectedDay} />;
            TodosContent = <TodoDisplay container={this.dayviewContainer} displayDate={this.state.selectedDay} />;
        }

        var dayDescription = getDayDescription(this.state.selectedDay);

        return (
            <div>
                <div className="DragBar" style={{ width: "100%", position: "fixed", top: 0, left: 0, height: 30 }}></div>

                <Grid style={{ width: "100%", height: this.state.screenHeight }}>
                    <div
                        className="FixedWidthCol"
                        style={{
                            width: 320,
                            height: this.state.screenHeight,
                            backgroundColor: "rgb(30,30,30)",
                            paddingLeft: 36,
                            paddingRight: 36,
                            paddingTop: 80,
                        }}
                    >
                        <Row>{dayDescription}</Row>
                        <Row style={{ marginTop: 40 }}>
                            <DayPicker selectedDays={this.state.selectedDay} onDayClick={this.handleDayClick} />
                        </Row>
                        <Row>
                            <div className="day-view-panel">
                                <div className="day-view-scroll">
                                    {AllDayEventsContent}
                                    {TodosContent}
                                </div>
                            </div>
                        </Row>
                    </div>
                    <div
                        className="FixedWidthCol"
                        style={{
                            backgroundColor: "rgba(26,26,26,1)",
                            width: this.state.screenWidth - 340,
                        }}
                    >
                        <DayView container={this.dayviewContainer} displayDate={this.state.selectedDay} />
                    </div>
                </Grid>

                <EditEventDialog />

                <EditTodoDialog />

                <CreateEventDialog />

                <CreateTodoDialog />
            </div>
        );
    }
}

export default index;
