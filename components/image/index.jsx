import {forwardRef} from 'react';
import styles from './image.module.scss';
import LazyLoad from 'react-lazyload';
import {classes} from '../../util';

export default forwardRef(
    ({src, width, height, className, alt, showAlt = true}, ref) => {
        const w = parseInt(width) || 1;
        const h = parseInt(height) || 0;
        const paddingBottom = `${(h / w) * 100}%`;

        return (
            <figure className={classes(className, styles.figure)} ref={ref}>
                <LazyLoad
                    offset={200}
                    placeholder={<div style={{paddingBottom}} />}
                    once
                >
                    <div
                        className={styles.image}
                        style={{
                            backgroundImage: `url(${src})`,
                            paddingBottom,
                        }}
                    />
                </LazyLoad>
                {alt && showAlt && (
                    <figcaption className={styles.alt}>{alt}</figcaption>
                )}
            </figure>
        );
    }
);
