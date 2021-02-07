import styles from './post.module.scss';

export default function Post(props) {
    return <article {...props} className={styles.post} />;
}
