import remoteRenderToString from 'next-mdx-remote/render-to-string';
import remoteHydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '../components/code-block';
import Image from '../components/image';
import {emojify} from 'node-emoji';

const MARKDOWN_OPTIONS = {
    components: {
        Image,
        pre: CodeBlock,
    },
};

export function hydrate(source) {
    return remoteHydrate(source, MARKDOWN_OPTIONS);
}

export async function renderToString(content, opts = {}) {
    return remoteRenderToString(emojify(content), {
        ...opts,
        ...MARKDOWN_OPTIONS,
    });
}
