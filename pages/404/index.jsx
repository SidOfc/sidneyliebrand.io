import styles from './404.module.scss';
import Media from '@components/media';
import Button from '@components/button';

export default function PageNotFound() {
    return (
        <section className={styles.page}>
            <Media
                invertDark
                width={93}
                height={57}
                src="/media/jackie-chan-what.svg"
                className={styles.jackieChanWhat}
            />
            <h1 className={styles.pageHeading}>Page not found, what?!</h1>
            <Button>View homepage</Button>
        </section>
    );
}
