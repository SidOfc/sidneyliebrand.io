const {types} = require('sass');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
    enabled: process.env.ANALYZE ? true : false,
});
const sassVars = require('./data/sass-variables.json');

module.exports = withBundleAnalyzer({
    webpack(config, {isServer}) {
        // https://coderberry.com/posts/mdx_next
        // fixes import [module] from [node_lib] errors
        // related to next-mdx-remote
        if (!isServer) {
            config.node = {
                fs: 'empty',
                path: 'empty',
            };
        }

        return config;
    },
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
                        replacement
                    );
                }, string);

                return new types.String(result);
            },
        },
    },
});

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
