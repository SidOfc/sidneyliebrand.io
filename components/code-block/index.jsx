import Highlight, {defaultProps} from 'prism-react-renderer';
import {except} from '@src/util';
import '@src/util/prism';

export default function CodeBlock({className, children}) {
    return (
        <Highlight
            Prism={defaultProps.Prism}
            className={className}
            code={children.props.children.trim()}
            language={children.props.className.split('-').pop()}
        >
            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={className} style={{...style}}>
                    {tokens.map((line, i) => (
                        <div
                            key={i}
                            {...except(getLineProps({line, key: i}), ['key'])}
                        >
                            {line.map((token, key) => (
                                <span
                                    key={key}
                                    {...except(getTokenProps({token, key}), [
                                        'key',
                                    ])}
                                />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
}
