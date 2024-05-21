import {Prism, normalizeTokens} from 'prism-react-renderer';
import {theme} from '@src/util/prism';

export default function CodeBlock({
    children,
    code = children?.props?.children?.trim?.(),
    language = children?.props?.className?.split?.('-')?.pop?.(),
}) {
    const root = tokenize(code, language, theme);

    return (
        <pre style={root.style}>
            {root.lines.map((line) => (
                <span key={line.id} style={{display: 'block'}}>
                    {line.contents.map((token) => (
                        <span key={token.id} style={token.style}>
                            {token.content}
                        </span>
                    ))}
                </span>
            ))}
        </pre>
    );
}

function tokenize(code, language, theme) {
    const grammar = Prism.languages[language];
    const tokens = Prism.tokenize(code, grammar);
    const lines = normalizeTokens(tokens);
    const rules = new Map([['plain', theme.plain ?? {}]]);
    const styles = (types) =>
        types
            .map((type) => rules.get(type))
            .filter(Boolean)
            .reduce((acc, styles) => Object.assign(acc, styles), {});

    for (const {types, style} of theme.styles) {
        for (const type of types) rules.set(type, style);
    }

    return {
        style: theme.plain,
        lines: lines.map((line, id) => ({
            id,
            style: {display: 'block'},
            contents: line.map((token, id) => ({
                id,
                style: styles(token.types),
                ...token,
            })),
        })),
    };
}
