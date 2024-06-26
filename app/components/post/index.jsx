import styles from './post.module.scss';
import {MDXRemote} from 'next-mdx-remote/rsc';
import Text from '@components/text';
import Heading from '@components/heading';
import Bullet from '@components/bullet';
import Button from '@components/button';
import {dateFormat} from '@src/util';
import {MARKDOWN_OPTIONS} from '@src/util/mdx';

export default function Post({
    title,
    published,
    readTimeInMinutes,
    markdown,
    slug,
}) {
    return (
        <article className={styles.post}>
            <Heading link={`/blog/${slug}`}>{title}</Heading>
            <Text className={styles.postData} color="page-accent">
                By Sidney Liebrand on{' '}
                {dateFormat(published, {includeDay: true})}
                <Bullet />
                {readTimeInMinutes} min read
            </Text>
            <section>
                <MDXRemote {...MARKDOWN_OPTIONS} source={markdown} />
            </section>
            <Button href="/">Back</Button>
        </article>
    );
}
