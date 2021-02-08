import styles from './banner.module.scss';
import Image from '../image';

export default function Banner({src, width, height, title, description}) {
    return (
        <section className={styles.banner}>
            <Image
                src={src}
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
