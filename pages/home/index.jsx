import styles from './home.module.scss';
import Bullet from '../../components/bullet';
import Button from '../../components/button';
import Text from '../../components/text';
import Link from 'next/link';
import {processMarkdownDir} from '../../util/static';
import {dateFormat, readTime} from '../../util';

export default function Index({posts}) {
    return (
        <>
            {posts.map(
                ({title, slug, description, published, readTimeInMinutes}) => (
                    <Link key={title} href={`/blog/${slug}`}>
                        <a title={title} className={styles.blogEntry}>
                            <Text as="h2">{title}</Text>
                            <Text color="page-accent">
                                By Sidney Liebrand on {dateFormat(published)}
                                <Bullet />
                                {readTimeInMinutes} min read
                            </Text>
                            <Text
                                as="p"
                                dangerouslySetInnerHTML={{__html: description}}
                            />
                            <Button className={styles.blogEntryButton}>
                                View post
                            </Button>
                        </a>
                    </Link>
                )
            )}
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
