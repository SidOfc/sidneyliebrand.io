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

export function except(obj, keys) {
    return Object.entries(obj).reduce((filtered, [key, value]) => {
        if (!keys.includes(key)) Object.assign(filtered, {[key]: value});

        return filtered;
    }, {});
}

export function linkProps(href) {
    const isExternal =
        !href.match(/(?:https?:)(?:\/\/)?sidneyliebrand\.(?:io|next)/i) &&
        !href.startsWith('/');

    return isExternal
        ? {href, target: '_blank', rel: 'noopener,noreferrer'}
        : {};
}

export function readTime(str) {
    return Math.round(Math.max(1, (str.match(/\s+/g) || []).length / 200));
}

export function slug(str) {
    return str
        .replace(/\.\w+$/g, '')
        .replace(/\W+/g, ' ')
        .trim()
        .replace(/\s+/g, '-')
        .toLowerCase();
}

export function classes(...classArgs) {
    return classArgs
        .reduce((acc, arg) => {
            if (Array.isArray(arg)) {
                return [acc, ...arg].filter((x) => x).join(' ');
            } else if (arg?.constructor === Object) {
                return Object.entries(arg).reduce(
                    (acc, [cn, include]) => (include ? `${acc} ${cn}` : acc),
                    acc
                );
            } else if (arg) {
                return `${acc} ${arg}`;
            }

            return acc;
        }, '')
        .trim();
}

export function dateFormat(maybeDate, {includeDay, fallback} = {}) {
    if (!maybeDate) return fallback;

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
