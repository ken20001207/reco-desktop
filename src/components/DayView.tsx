import React from "react";
import EventCard from "./eventCard";
import { DayViewProps } from "../utils/interfaces";
import { Event } from "../utils/classes";

class DayView extends React.Component<DayViewProps> {
    render() {
        var position = new Map<Event, number>();
        this.props.events.map(theEvent => {
            this.props.events.map(event => {
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

        return this.props.events.map(event => {
            return (
                <EventCard
                    key={event.id}
                    height={-1}
                    position={position.get(event)}
                    event={event}
                    openEventEditDialog={this.props.openEventEditDialog}
                    openEventCreateDialog={this.props.openEventCreateDialog}
                    container={this.props.container}
                />
            );
        });
    }
}

export default DayView;
