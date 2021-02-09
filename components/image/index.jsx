import {forwardRef} from 'react';
import styles from './image.module.scss';
import {classes} from '../../util';
import NextImage from 'next/image';

export default forwardRef(
    ({src, width, height, className, alt, showAlt = true}, ref) => {
        const w = parseInt(width) || 1;
        const h = parseInt(height) || 0;

        return (
            <figure className={classes(className, styles.figure)} ref={ref}>
                <div className={styles.image}>
                    {src && <NextImage src={src} alt={alt} layout="fill" />}
                    <div
                        className={styles.ratio}
                        style={{paddingBottom: `${(h / w) * 100}%`}}
                    />
                </div>
                {alt && showAlt && (
                    <figcaption className={styles.alt}>{alt}</figcaption>
                )}
            </figure>
        );
    }
);
