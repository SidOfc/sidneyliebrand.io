import remoteHydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '@components/code-block';
import Heading from '@components/heading';
import Media from '@components/media';

export const MARKDOWN_OPTIONS = {
    components: {
        Media,
        pre: CodeBlock,
        h1: (props) => <Heading {...props} as="h1" />,
        h2: (props) => <Heading {...props} as="h2" />,
        h3: (props) => <Heading {...props} as="h3" />,
        h4: (props) => <Heading {...props} as="h4" />,
        h5: (props) => <Heading {...props} as="h5" />,
        h6: (props) => <Heading {...props} as="h6" />,
    },
};

export function hydrate(source) {
    return remoteHydrate(source, MARKDOWN_OPTIONS);
}
