export default function sameday(dateA: Date, dateB: Date) {
    if (dateA instanceof Date && dateB instanceof Date)
        return dateA.getFullYear() === dateB.getFullYear() && dateA.getMonth() === dateB.getMonth() && dateA.getDate() === dateB.getDate();
    else return false;
}
