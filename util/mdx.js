import CodeBlock from '@components/code-block';
import Heading from '@components/heading';
import Media from '@components/media';
import Caniuse from '@components/caniuse';

export const MARKDOWN_OPTIONS = {
    components: {
        Media,
        Caniuse,
        pre: CodeBlock,
        h1(props) {
            return <Heading {...props} as="h1" />;
        },
        h2(props) {
            return <Heading {...props} as="h2" />;
        },
        h3(props) {
            return <Heading {...props} as="h3" />;
        },
        h4(props) {
            return <Heading {...props} as="h4" />;
        },
        h5(props) {
            return <Heading {...props} as="h5" />;
        },
        h6(props) {
            return <Heading {...props} as="h6" />;
        },
    },
};
