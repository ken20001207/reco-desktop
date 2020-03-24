import React from "react";
import EventCard from "./eventCard";

import { AllDayEventsProps } from "../utils/interfaces";

class AllDayEvents extends React.Component<AllDayEventsProps> {
    render() {
        var events = this.props.events.map(event => {
            return (
                <EventCard
                    position={undefined}
                    container={this.props.container}
                    key={event.id}
                    height={60}
                    event={event}
                    openEventEditDialog={this.props.openEventEditDialog}
                    openEventCreateDialog={this.props.openEventCreateDialog}
                />
            );
        });
        return events ;
    }
}

export default AllDayEvents;
