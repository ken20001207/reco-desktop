import { User, Event, Calendar } from "./classes";
/** index 組件 State */
export interface IndexStates {
    loaded: boolean,
    waiting: boolean,
    removing: boolean,
    selectedDay: Date,
    eventsToDispay: Array<Event>,
    userdata: User,
    filled: Array<Event>,
    editingEvent: boolean,
    creatingEvent: boolean,
    creatingRepeat: boolean,
    selectedEvent: Event,
    inputing: Inputing
}

/** index 組件 Props */
export interface IndexProps {
    userdata: User,
    filled: Array<Event>,
    eventsToDispay: Array<Event>
}

/** EventCard 組件 Props */
export interface EventCardProps {
    position: number | undefined,
    height: number,
    event: Event,
    openEventEditDialog(event: Event): void,
    openEventCreateDialog(): void,
    container: React.RefObject<HTMLDivElement>;
}

/** EvnetCard 組件 States */
export interface EventCardState {
    hover: boolean
}

/** EditEventDialog 組件 Props */
export interface EditEventDialogProps {
    inputing: Inputing,
    editingEvent: boolean,
    removing: boolean,
    waiting: boolean,
    selectedEvent: Event,
    closeEventEditDialog(): void,
    handleFormChange(formValue: {}): void,
    removeEvent(): void,
    updateEvent(): void,
}

/** DayView 組件 Props */
export interface DayViewProps {
    events: Array<Event>,
    openEventCreateDialog(): void,
    openEventEditDialog(event: Event): void,
    container: React.RefObject<HTMLDivElement>;
}

/** CreateRepeatDialog 組件 Props */
export interface CreateRepeatDialogProps {
    creatingRepeat: boolean,
    waiting: boolean,
    userdata: User,
    inputing: Inputing,
    closeRepeatCreateDialog(): void,
    handleFormChange(formValue: {}): void,
    createRepeat(): void,
}

/** CreateEventDialog 組件 Props*/
export interface CreateEventDialogProps {
    userdata: User,
    inputing: Inputing,
    creatingEvent: boolean,
    waiting: boolean,
    createEvent(): void, 
    closeEventCreateDialog(): void,
    handleFormChange(formValue: {}): void,
    openRepeatCreateDialog(): void,
}

/** AllDayEvents 組件 Props*/
export interface AllDayEventsProps {
    events: Array<Event>;
    openEventEditDialog(event: Event): void,
    openEventCreateDialog(): void,
    container: React.RefObject<HTMLDivElement>;
}

/** 輸入內容暫存區 */
export interface Inputing {
    title: string,
    date: string,
    time: string,
    ignore: boolean,
    ignoreReason: string,
    allday: boolean,
    calendar: { label: string, value: Calendar },
    startDate: string,
    endDate: string,
    cycle: string,
    repeatData: number,
    description: string, 
    location: string
}