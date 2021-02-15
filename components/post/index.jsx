import styles from './post.module.scss';
import Text from '@components/text';
import Heading from '@components/heading';
import Bullet from '@components/bullet';
import Button from '@components/button';
import {dateFormat} from '@src/util';
import {hydrate} from '@src/util/mdx';

export default function Post({
    title,
    published,
    readTimeInMinutes,
    source,
    slug,
}) {
    const content = hydrate(source);

    return (
        <article className={styles.post}>
            <Heading link={`/blog/${slug}`}>{title}</Heading>
            <Text className={styles.postData} color="page-accent">
                By Sidney Liebrand on {dateFormat(published)}
                <Bullet />
                {readTimeInMinutes} min read
            </Text>
            {content}
            <Button href="/">Back</Button>
        </article>
    );
}
