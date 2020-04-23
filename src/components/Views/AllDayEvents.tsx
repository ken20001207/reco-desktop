import React from "react";
import EventCard from "../Cards/EventCard";
import { store } from "../../redux/store";
import sameday from "../../utils/sameday";

export interface AllDayEventsProps {
    container: React.RefObject<HTMLDivElement>;
    displayDate: Date;
}

class AllDayEvents extends React.Component<AllDayEventsProps> {
    render() {
        var events = store
            .getState()
            .systemStateReducer.events.filter((event) => sameday(event.startTime, this.props.displayDate) && event.isAllDayEvent())
            .map((event) => {
                return <EventCard position={undefined} container={this.props.container} key={event._id} height={60} event={event} />;
            });
        return events;
    }
}

export default AllDayEvents;
