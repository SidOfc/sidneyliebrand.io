import remoteHydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '../components/code-block';

export const components = {
    pre: CodeBlock,
};

export function hydrate(source) {
    return remoteHydrate(source, {components});
}
