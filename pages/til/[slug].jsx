import Post from '../../components/post';
import {processMarkdownSlug, getMarkdownDirSlugs} from '../../util/static';
import {hydrate} from '../../util/markdown';
import '../../util/prism';

export default function Til(props) {
    return <Post {...props} />;
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
