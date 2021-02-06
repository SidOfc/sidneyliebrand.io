import {processMarkdownSlug, getMarkdownDirSlugs} from '../../util/static';
import {hydrate} from '../../util/markdown';
import '../../util/prism';

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

    return {
        paths: slugs.map((slug) => ({params: {slug}})),
        fallback: false,
    };
}
