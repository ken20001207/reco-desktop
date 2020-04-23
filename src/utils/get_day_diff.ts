export default function get_day_diff(dayA: Date, dayB: Date) {
    return Math.round((dayA.getTime() - dayB.getTime()) / (1000 * 60 * 60 * 24));
}
