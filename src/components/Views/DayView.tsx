import React, { createRef } from "react";
import { Panel, Divider } from "rsuite";
import sameday from "../../utils/sameday";
import { store } from "../../redux/store";
import { toggleCreatingEvent } from "../../redux/actions";
import { EventData, SystemState, AppState } from "../../types";
import { connect } from "react-redux";
import EventCard from "../Cards/EventCard";

interface Props {
    store: SystemState;
    toggleCreatingEvent: () => void;
    displayDate: Date;
    container: React.RefObject<HTMLDivElement>;
}

interface DayViewStates {
    now: Date;
    events: Array<EventData>;
}

class DayView extends React.Component<Props, DayViewStates> {
    public dayviewContainer = createRef<HTMLDivElement>();
    constructor(props: Readonly<Props>) {
        super(props);
        this.state = {
            now: new Date(),
            events: [],
        };
    }

    componentWillReceiveProps(nextProps: Props) {
        this.setState({
            events: this.props.store.events.filter((event) => {
                return (
                    (sameday(event.startTime, nextProps.displayDate) || sameday(event.endTime, nextProps.displayDate)) &&
                    !event.isAllDayEvent()
                );
            }),
        });
    }

    interval: NodeJS.Timeout = setInterval(() => this.setState({ now: new Date() }), 1000);
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        var position = new Map<EventData, number>();
        this.state.events.map((theEvent: EventData) => {
            this.state.events.map((event: EventData) => {
                if (
                    event !== theEvent &&
                    event.getBeginDistanse() <= theEvent.getBeginDistanse() &&
                    event.getEndDistanse() > theEvent.getBeginDistanse() &&
                    position.get(theEvent) === undefined
                ) {
                    if (position.get(event) === undefined) {
                        if (event.ignore) {
                            position.set(event, 1);
                            position.set(theEvent, 0);
                        } else {
                            position.set(event, 0);
                            position.set(theEvent, 1);
                        }
                    } else if (position.get(event) === 0) {
                        position.set(theEvent, 1);
                    } else if (position.get(event) === 1) {
                        position.set(theEvent, 0);
                    }
                }
                return null;
            });
            return null;
        });

        var Hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23];
        var HourLines = Hours.map((hour) => {
            return (
                <div key={hour} style={{ position: "absolute", top: hour * 60, width: 520, margin: 0 }}>
                    <p style={{ lineHeight: 0, color: "rgba(255,255,255,0.2)" }}>{hour + ":00"}</p>
                    <Divider style={{ marginLeft: 64, marginTop: 0, marginBottom: 0, height: 2, backgroundColor: "rgb(40,40,40)" }} />
                </div>
            );
        });

        var NowLine = sameday(this.props.displayDate, new Date()) ? (
            <div
                style={{
                    zIndex: 2000,
                    position: "absolute",
                    top: this.state.now.getHours() * 60 + this.state.now.getMinutes(),
                    width: 520,
                    margin: 0,
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
                        height: 2,
                    }}
                />
            </div>
        ) : null;

        return (
            <Panel bodyFill onDoubleClick={() => this.props.toggleCreatingEvent()} style={{ width: "100%" }}>
                <div
                    style={{
                        overflowY: "scroll",
                        height: "100vh",
                        padding: 120,
                    }}
                >
                    <div
                        style={{
                            height: 1420,
                            paddingTop: 100,
                            position: "relative",
                        }}
                        ref={this.dayviewContainer}
                    >
                        {HourLines}
                        {NowLine}

                        {this.state.events.map((event: EventData) => {
                            return (
                                <EventCard
                                    key={event._id}
                                    height={-1}
                                    position={position.get(event)}
                                    event={event}
                                    container={this.dayviewContainer}
                                />
                            );
                        })}
                    </div>
                </div>
            </Panel>
        );
    }
}

function mapStateToProps(state: AppState) {
    return {
        store: state.systemStateReducer,
    };
}

function mapDispatchToProps(dispatch: typeof store.dispatch) {
    return {
        toggleCreatingEvent: () => {
            dispatch(toggleCreatingEvent());
        },
    };
}

const VisibleDayView = connect(mapStateToProps, mapDispatchToProps)(DayView);

export default VisibleDayView;
