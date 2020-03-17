import React, { CSSProperties } from 'react';
import { EventCardProps, EventCardState } from '../utils/interfaces';
import { getEventPopoverContent, getLineAmount, getEventCardInfo } from '../utils/methods';

import { FlexboxGrid, Whisper, Popover, Panel } from 'rsuite';

class EventCard extends React.Component<EventCardProps, EventCardState> {
    trigger: any;
    constructor(props: Readonly<EventCardProps>) {
        super(props);
        this.state = {
            hover: false
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleMouseEnter = this.handleMouseEnter.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleDoubleClick = this.handleDoubleClick.bind(this);
    }

    handleClick(e: { stopPropagation: () => void; }) {
        e.stopPropagation();
            this.trigger.show();
    }

    handleDoubleClick(e: { stopPropagation: () => void; }) {
        e.stopPropagation();
        this.props.openEventEditDialog(this.props.event);
    }

    handleMouseEnter() {
        this.setState({ hover: true });
    }

    handleMouseLeave() {
        this.setState({ hover: false });
    }

    render() {
        const event = this.props.event;
        const style: CSSProperties = {
            height: this.props.height > 0 ? this.props.height : event.getDuration(),
            backgroundImage: 'linear-gradient(315deg, ' + event.color[0] + ' 0%, ' + event.color[1] + ' 100%)',
            fontSize: 8,
            paddingLeft: 16,
            paddingTop: 10,
            marginTop: event.isAllDayEvent() ? 16 : 0,
            paddingBottom: 6,
            opacity: event.ignore ? 0.2 : 1,
            width: '100%'
        };

        const gridStyle: CSSProperties = {
            position: 'absolute',
            top: event.getDurationBetweenDayBegin(),
            zIndex: this.state.hover ? 1500 : 1420 - event.getDuration(),
            width: this.props.position === undefined ? 432 : 216,
            left: this.props.position === 1 ? 280 : 64
        };

        var lineAmount = getLineAmount(event, this.props.height);
        var eventInfo = getEventCardInfo(event);
        var popoverContent = getEventPopoverContent(event);

        if (event.isAllDayEvent())
            return (
                <Whisper
                    triggerRef={ref => {
                        this.trigger = ref;
                    }}
                    placement="right"
                    delayHide={0}
                    trigger="active"
                    speaker={
                        <Popover
                            full
                            style={{
                                backgroundImage: 'linear-gradient(315deg, ' + event.color[0] + ' 0%, ' + event.color[1] + ' 100%)',
                                padding: 24,
                                borderTopRightRadius: 20,
                                borderBottomLeftRadius: 20,
                                zIndex: 4000,
                                minWidth: 300
                            }}
                        >
                            <div>
                                {popoverContent.map(content => {
                                    return content;
                                })}
                            </div>
                        </Popover>
                    }
                >
                    <Panel style={style} onClick={this.handleClick} key={event.id} className="EventCard" onDoubleClick={this.handleDoubleClick} bodyFill>
                        {eventInfo.slice(0, lineAmount).map(info => {
                            return info;
                        })}
                    </Panel>
                </Whisper>
            );
        else
            return (
                <FlexboxGrid className={event.ignore ? 'ignoredEventCardGrid' : 'EventCardGrid'} style={gridStyle}>
                    <Whisper
                        triggerRef={ref => {
                            this.trigger = ref;
                        }}
                        placement="right"
                        delayHide={0}
                        container={this.props.container.current === null ? undefined : this.props.container.current}
                        trigger="active"
                        speaker={
                            <Popover
                                full
                                style={{
                                    backgroundImage: 'linear-gradient(315deg, ' + event.color[0] + ' 0%, ' + event.color[1] + ' 100%)',
                                    padding: 24,
                                    borderTopRightRadius: 20,
                                    borderBottomLeftRadius: 20,
                                    zIndex: 4000,
                                    minWidth: 300
                                }}
                            >
                                {popoverContent.map(content => {
                                    return content;
                                })}
                            </Popover>
                        }
                    >
                        <Panel
                            style={style}
                            onClick={this.handleClick}
                            key={event.id}
                            className="EventCard"
                            bodyFill
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                            onDoubleClick={this.handleDoubleClick}
                        >
                            {eventInfo.slice(0, lineAmount).map(info => {
                                return info;
                            })}
                        </Panel>
                    </Whisper>
                </FlexboxGrid>
            );
    }
}

export default EventCard;
