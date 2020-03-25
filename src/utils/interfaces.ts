import { User, Event, Calendar, Todo } from "./classes";
/** index 組件 State */
export interface IndexStates {
    screenWidth: number,
    screenHeight: number,
    loaded: boolean,
    waiting: boolean,
    removing: boolean,
    selectedDay: Date,
    eventsToDispay: Array<Event>,
    userdata: User,
    filled: Array<Event>,
    editingEvent: boolean,
    editingTodo: boolean,
    creatingEvent: boolean,
    creatingRepeat: boolean,
    creatingTodo: boolean,
    selectedEvent: Event,
    selectedTodo: Todo,
    inputing: Inputing,
    displayEventInfoDrawer: boolean,
    now: Date
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
    container: React.RefObject<HTMLDivElement>
}

/** EvnetCard 組件 States */
export interface EventCardState {
    hover: boolean
}

/** TodoCard 組件 Props */
export interface TodoCardProps {
    position: number | undefined,
    height: number,
    todo: Todo,
    openTodoEditDialog(todo: Todo): void,
    openTodoCreateDialog(): void,
    container: React.RefObject<HTMLDivElement>
}

/** TodoCard 組件 States */
export interface TodoCardState {
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

/** EditTodoDialog 組件 Props */
export interface EditTodoDialogProps {
    inputing: Inputing,
    editingTodo: boolean,
    removing: boolean,
    waiting: boolean,
    selectedTodo: Todo,
    closeTodoEditDialog(): void,
    handleFormChange(formValue: {}): void,
    removeTodo(): void,
    updateTodo(): void,
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

/** CreateEventDialog 組件 Props*/
export interface CreateTodoDialogProps {
    userdata: User,
    inputing: Inputing,
    creatingTodo: boolean,
    waiting: boolean,
    createTodo(): void, 
    closeTodoCreateDialog(): void,
    handleFormChange(formValue: {}): void
}

/** AllDayEvents 組件 Props*/
export interface AllDayEventsProps {
    events: Array<Event>;
    openEventEditDialog(event: Event): void,
    openEventCreateDialog(): void,
    container: React.RefObject<HTMLDivElement>;
}

/** todoDisplay 組件 Props*/
export interface todoDisplayProps {
    todos: Array<Todo>;
    openTodoEditDialog(todo: Todo): void,
    openTodoCreateDialog(): void,
    container: React.RefObject<HTMLDivElement>;
}

/** 輸入內容暫存區 */
export interface Inputing {
    title: string,
    date: Date,
    ignore: boolean,
    deadLine: Date,
    ignoreReason: string,
    allday: boolean,
    calendar: Calendar,
    startTime: Date,
    endTime: Date,
    cycle: string,
    repeatData: number,
    description: string, 
    location: string,
    complete: boolean
}