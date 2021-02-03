const MONTHS = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
];

export function dateFormat(maybeDate, includeDay = false) {
    const date = toDate(maybeDate);
    const day = includeDay ? ` ${date.getDate()}` : '';

    return `${MONTHS[date.getMonth()]},${day} ${date.getFullYear()}`;
}

export function dateDiff(a, b) {
    const aDate = a ? toDate(a) : new Date();
    const bDate = b ? toDate(b) : new Date();
    const diffYears = bDate.getFullYear() - aDate.getFullYear();
    const diffMonths = bDate.getMonth() - aDate.getMonth();
    const years = diffYears - (diffMonths >= 0 ? 0 : 1);
    const months = diffMonths + (diffMonths >= 0 ? 0 : 12);

    return [
        years,
        `year${years !== 1 ? 's' : ''},`,
        months,
        `month${months !== 1 ? 's' : ''}`,
    ].join(' ');
}

function toDate(maybeDate) {
    return maybeDate instanceof Date ? maybeDate : new Date(maybeDate);
}
