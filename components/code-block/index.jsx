import Highlight, {defaultProps} from 'prism-react-renderer';

export default function CodeBlock({className, children}) {
    return (
        <Highlight
            {...defaultProps}
            className={className}
            code={children.props.children.trim()}
            language={children.props.className.split('-').pop()}
        >
            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={className} style={{...style}}>
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({line, key: i})}>
                            {line.map((token, key) => (
                                <span
                                    key={key}
                                    {...getTokenProps({token, key})}
                                />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
}
