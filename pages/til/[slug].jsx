import hydrate from 'next-mdx-remote/hydrate';
import {processMarkdownSlug, getMarkdownDirSlugs} from '../../util/static';

export default function Til({title, source}) {
    const content = hydrate(source);

    return (
        <>
            <h1>{title}</h1>
            {content}
        </>
    );
}

export async function getStaticProps(context) {
    const props = await processMarkdownSlug('data/til', context.params.slug);

    return {
        props,
    };
}

export async function getStaticPaths() {
    const slugs = await getMarkdownDirSlugs('data/til');

    console.log(slugs);

    return {
        paths: slugs.map((slug) => ({params: {slug}})),
        fallback: false,
    };
}
