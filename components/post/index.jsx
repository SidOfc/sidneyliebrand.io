import styles from './post.module.scss';
import Text from '../text';
import Heading from '../heading';
import Bullet from '../bullet';
import {dateFormat} from '../../util';
import {hydrate} from '../../util/mdx';

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
        </article>
    );
}
