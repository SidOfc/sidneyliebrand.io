import {forwardRef} from 'react';
import styles from './image.module.scss';
import {classes} from '../../util';

export default forwardRef(
    ({src, width, height, className, alt, showAlt = true}, ref) => {
        const w = parseInt(width) || 1;
        const h = parseInt(height) || 0;

        return (
            <figure className={classes(className, styles.figure)} ref={ref}>
                <div
                    className={styles.image}
                    title={alt}
                    style={{
                        backgroundImage: `url(${src})`,
                        paddingBottom: `${(h / w) * 100}%`,
                    }}
                />
                {alt && showAlt && (
                    <figcaption className={styles.alt}>{alt}</figcaption>
                )}
            </figure>
        );
    }
);
