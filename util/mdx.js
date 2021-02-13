import remoteHydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '../components/code-block';
import Media from '../components/media';

export const MARKDOWN_OPTIONS = {
    components: {
        Media,
        pre: CodeBlock,
    },
};

export function hydrate(source) {
    return remoteHydrate(source, MARKDOWN_OPTIONS);
}
