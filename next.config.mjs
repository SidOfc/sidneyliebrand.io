import {types} from 'sass';
import sassVars from './data/sass-variables.json' assert {'type': 'json'};

/* eslint-disable import/no-anonymous-default-export */
export default {
    output: 'export',
    swcMinify: true,
    sassOptions: {
        prependData: `$vars: ${serializeToSass(sassVars)};`,
        functions: {
            'ends-with($string, $end)': (string, end) => {
                return string.getValue().endsWith(end.getValue())
                    ? types.Boolean.TRUE
                    : types.Boolean.FALSE;
            },
            'substitute($args...)': (sassList) => {
                const length = sassList.getLength();
                const args = Array(length)
                    .fill()
                    .map((_, idx) => {
                        const val = sassList.getValue(idx);
                        if (val instanceof types.Color) {
                            return `rgba(${val.getR()}, ${val.getG()}, ${val.getB()}, ${val.getA()})`;
                        } else {
                            return val.getValue();
                        }
                    });

                const [string, ...replacements] = args;
                const result = replacements.reduce((acc, replacement, idx) => {
                    return acc.replace(
                        new RegExp(`\\$${idx}`, 'gi'),
                        replacement,
                    );
                }, string);

                return new types.String(result);
            },
        },
    },
};

function isType(thing, ...types) {
    return thing === null || thing === undefined
        ? types.includes(thing)
        : types.includes(thing.constructor);
}

function serializeToSass(subject) {
    if (isType(subject, String)) {
        return subject.match(/^(?:#|rgb|hsl|[\d.]+\w*$)/i)
            ? `${subject}`
            : `"${subject}"`;
    } else if (isType(subject, Array)) {
        return `(${subject.map(serializeToSass).join(',')})`;
    } else if (isType(subject, Object)) {
        return `(${Object.entries(subject)
            .map(([key, value]) => `${key}: ${serializeToSass(value)}`)
            .join(',')})`;
    } else {
        return `${subject}`;
    }
}
