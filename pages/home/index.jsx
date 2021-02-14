import styles from './home.module.scss';
import Link from 'next/link';
import Head from '@components/head';
import Bullet from '@components/bullet';
import Button from '@components/button';
import Banner from '@components/banner';
import Text from '@components/text';
import {processMarkdownDir, getPageData} from '@src/util/static';
import {dateFormat, readTime} from '@src/util';

export default function Index({title, description, posts}) {
    return (
        <>
            <Head title={title} description={description} />
            <Banner
                src="/media/avatar.jpg"
                width={280}
                height={280}
                title={title}
                description={description}
            />
            <section className={styles.blogEntries}>
                {posts.map(
                    ({
                        title,
                        slug,
                        description,
                        published,
                        readTimeInMinutes,
                    }) => (
                        <Link key={title} href={`/blog/${slug}`}>
                            <a title={title} className={styles.blogEntry}>
                                <h2>{title}</h2>
                                <Text color="page-accent">
                                    By Sidney Liebrand on{' '}
                                    {dateFormat(published, {includeDay: true})}
                                    <Bullet />
                                    {readTimeInMinutes} min read
                                </Text>
                                <p
                                    dangerouslySetInnerHTML={{
                                        __html: description,
                                    }}
                                />
                                <Button className={styles.blogEntryButton}>
                                    View post
                                </Button>
                            </a>
                        </Link>
                    )
                )}
            </section>
        </>
    );
}

export async function getStaticProps() {
    const {title, description} = getPageData('/');
    const posts = await processMarkdownDir('data/blog');

    return {
        props: {
            title,
            description,
            posts: posts
                .filter((p) => p.published)
                .sort((a, b) => new Date(b.published) - new Date(a.published)),
        },
    };
}
