import Post from '@components/post';
import {
    processMarkdownSlug,
    getMarkdownDirSlugs,
    getMetadata,
} from '@src/util/static';

export async function generateStaticParams() {
    const slugs = await getMarkdownDirSlugs('data/blog');

    return slugs.map((slug) => ({slug}));
}

export async function generateMetadata({params}) {
    const {title, description, published} = await processMarkdownSlug(
        'data/blog',
        params.slug,
    );

    return getMetadata(`/blog/${params.slug}`, {
        title,
        description,
        og: {type: 'article', publishedTime: published},
    });
}

export default async function Page({params}) {
    const props = await processMarkdownSlug('data/blog', params.slug);

    return <Post {...props} />;
}
