import Post from '@components/post';
import Head from '@components/head';
import {processMarkdownSlug, getMarkdownDirSlugs} from '@src/util/static';

export const config = {unstable_JsPreload: false};

export default function Blog(props) {
    return (
        <>
            <Head title={props.title} description={props.description} />
            <Post {...props} />
        </>
    );
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
