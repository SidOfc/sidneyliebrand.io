import styles from './home.module.scss';
import CodeBlock from '../../components/code-block';
import Bullet from '../../components/bullet';
import Button from '../../components/button';
import Text from '../../components/text';
import Link from 'next/link';
import {processMarkdownDir} from '../../util/static';
import {dateFormat, readTime} from '../../util';

export default function Index({posts}) {
    return (
        <>
            {posts.map((post) => (
                <Link key={post.title} href={`/blog/${post.slug}`}>
                    <a title={post.title} className={styles.blogEntry}>
                        <Text as="h2">{post.title}</Text>
                        <Text color="page-accent">
                            By Sidney Liebrand on {dateFormat(post.published)}
                            <Bullet />
                            {readTime(post.source.renderedOutput)} min read
                        </Text>
                        <Text
                            as="p"
                            dangerouslySetInnerHTML={{__html: post.description}}
                        />
                        <Button className={styles.blogEntryButton}>
                            View post
                        </Button>
                    </a>
                </Link>
            ))}
        </>
    );
}

export async function getStaticProps() {
    const posts = await processMarkdownDir('data/blog', {
        components: {pre: CodeBlock},
    });

    return {
        props: {
            posts: posts.sort(
                (a, b) => new Date(b.published) - new Date(a.published)
            ),
        },
    };
}
