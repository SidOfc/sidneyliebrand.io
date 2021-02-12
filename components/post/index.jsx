import styles from './post.module.scss';
import Text from '../text';
import Bullet from '../bullet';
import {dateFormat} from '../../util';
import {hydrate} from '../../util/mdx';

export default function Post({title, published, readTimeInMinutes, source}) {
    const content = hydrate(source);

    return (
        <article className={styles.post}>
            <h1>{title}</h1>
            <Text className={styles.postData} color="page-accent">
                By Sidney Liebrand on {dateFormat(published)}
                <Bullet />
                {readTimeInMinutes} min read
            </Text>
            {content}
        </article>
    );
}
