import {Highlight} from 'prism-react-renderer';
import {except} from '@src/util';
import {theme} from '@src/util/prism';
import '@src/util/prism';

export default function CodeBlock({className, children}) {
    return (
        <Highlight
            className={className}
            theme={theme}
            code={children.props.children.trim()}
            language={children.props.className.split('-').pop()}
        >
            {({className, style, tokens, getLineProps, getTokenProps}) => (
                <pre className={className} style={{...style}}>
                    {tokens.map((line, i) => (
                        <div key={i} {...except(getLineProps({line}), ['key'])}>
                            {line.map((token, key) => (
                                <span
                                    key={key}
                                    {...except(getTokenProps({token}), ['key'])}
                                />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
}
