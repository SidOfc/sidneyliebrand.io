import {forwardRef} from 'react';
import styles from './media.module.scss';
import LazyLoad from 'react-lazyload';
import {classes} from '@src/util';

export default forwardRef(
    ({src, width, height, className, alt, invertDark, showAlt = true}, ref) => {
        const w = parseInt(width) || 1;
        const h = parseInt(height) || 0;
        const paddingBottom = `${(h / w) * 100}%`;

        // console.log({src: require(`../../public${src}`).default});

        return (
            <figure
                className={classes(className, styles.figure, {
                    [styles.invertDark]: invertDark,
                })}
                ref={ref}
            >
                <LazyLoad
                    placeholder={<div style={{paddingBottom}} />}
                    offset={300}
                    once
                >
                    <div className={styles.relative} style={{paddingBottom}}>
                        {Array.isArray(src) ? (
                            <video
                                className={styles.media}
                                autoPlay
                                loop
                                muted
                                playsInline
                            >
                                {src.map((src) => (
                                    <source
                                        key={src}
                                        src={src}
                                        type={`video/${src.split('.').pop()}`}
                                    />
                                ))}
                            </video>
                        ) : (
                            <img className={styles.media} src={src} alt={alt} />
                        )}
                    </div>
                </LazyLoad>
                {alt && showAlt && (
                    <figcaption className={styles.alt}>{alt}</figcaption>
                )}
            </figure>
        );
    }
);
