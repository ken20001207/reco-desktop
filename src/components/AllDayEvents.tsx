import React from "react";
import EventCard from "./eventCard";

import { AllDayEventsProps } from "../utils/interfaces"

class AllDayEvents extends React.Component<AllDayEventsProps> {
    render() {
        return this.props.events.map(event => {
            return <EventCard position={undefined} container={this.props.container} key={event.id} height={60} event={event} openEventEditDialog={this.props.openEventEditDialog} openEventCreateDialog={this.props.openEventCreateDialog} />;
        });
    }
}

export default AllDayEvents;
