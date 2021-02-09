import styles from './home.module.scss';
import Bullet from '../../components/bullet';
import Button from '../../components/button';
import Banner from '../../components/banner';
import Text from '../../components/text';
import Link from 'next/link';
import {processMarkdownDir} from '../../util/static';
import {dateFormat, readTime} from '../../util';

export default function Index({posts}) {
    return (
        <>
            <Banner
                src="/media/avatar.jpg"
                width={280}
                height={280}
                title="Welcome to my digital home!"
                description="My name is Sidney Liebrand. I am a Dutch front-end developer working with React and Ruby on Rails at Floorplanner in Rotterdam. This is the place where I publish new blog posts and perhaps a tool or two in the future."
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
                                    {dateFormat(published)}
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
    const posts = await processMarkdownDir('data/blog');

    return {
        props: {
            posts: posts.sort(
                (a, b) => new Date(b.published) - new Date(a.published)
            ),
        },
    };
}
