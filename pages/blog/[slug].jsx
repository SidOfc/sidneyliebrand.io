import Post from '../../components/post';
import {processMarkdownSlug, getMarkdownDirSlugs} from '../../util/static';
import '../../util/prism';

export default function Blog(props) {
    return <Post {...props} />;
}

export async function getStaticProps(context) {
    const props = await processMarkdownSlug('data/blog', context.params.slug);

    return {
        props,
    };
}

export async function getStaticPaths() {
    const slugs = await getMarkdownDirSlugs('data/blog');

    return {
        paths: slugs.map((slug) => ({params: {slug}})),
        fallback: false,
    };
}
