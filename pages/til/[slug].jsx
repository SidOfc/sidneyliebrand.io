import hydrate from 'next-mdx-remote/hydrate';
import CodeBlock from '../../components/code-block';
import {processMarkdownSlug, getMarkdownDirSlugs} from '../../util/static';
import '../../util/prism';

export default function Til({title, source}) {
    const content = hydrate(source, {components: {pre: CodeBlock}});

    return (
        <>
            <h1>{title}</h1>
            {content}
        </>
    );
}

export async function getStaticProps(context) {
    const props = await processMarkdownSlug('data/til', context.params.slug, {
        components: {pre: CodeBlock},
    });

    return {
        props,
    };
}

export async function getStaticPaths() {
    const slugs = await getMarkdownDirSlugs('data/til');

    return {
        paths: slugs.map((slug) => ({params: {slug}})),
        fallback: false,
    };
}
