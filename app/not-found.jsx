import styles from './not-found.module.scss';
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
            <Button href="/">View homepage</Button>
        </section>
    );
}
