import remoteHydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '../components/code-block';
import Image from '../components/image';

export const MARKDOWN_OPTIONS = {
    components: {
        Image,
        pre: CodeBlock,
    },
};

export function hydrate(source) {
    return remoteHydrate(source, MARKDOWN_OPTIONS);
}
