import styles from './image.module.scss';
import {classes} from '../../util';
import NextImage from 'next/image';

export default function Image({src, width, height, className, alt}) {
    const w = parseInt(width) || 1;
    const h = parseInt(height) || 0;
    return (
        <figure className={classes(className, styles.figure)}>
            <div className={styles.image}>
                {src && <NextImage src={src} alt={alt} layout="fill" />}
                <div
                    className={styles.ratio}
                    style={{paddingBottom: `${(h / w) * 100}%`}}
                />
            </div>
            {alt && <figcaption className={styles.alt}>{alt}</figcaption>}
        </figure>
    );
}
