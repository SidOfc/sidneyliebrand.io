import remoteHydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '../components/code-block';
import Image from '../components/image';

export const components = {
    Image,
    pre: CodeBlock,
};

export function hydrate(source) {
    return remoteHydrate(source, {components});
}
