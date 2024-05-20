import styles from './banner.module.scss';
import Media from '@components/media';

export default function Banner({src, width, height, alt, title, description}) {
    return (
        <section className={styles.banner}>
            <Media
                showAlt={false}
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={styles.image}
            />
            <div className={styles.content}>
                <h2>{title}</h2>
                <p>{description}</p>
            </div>
        </section>
    );
}
