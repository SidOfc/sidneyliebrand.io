import {forwardRef} from 'react';
import styles from './media.module.scss';
import {classes} from '@src/util';

export default function Media({
    src,
    width,
    height,
    className,
    alt,
    invertDark,
    onClick,
    showAlt = true,
    exts = ['webm', 'mp4'],
}) {
    const w = parseInt(width) || 1;
    const h = parseInt(height) || 0;
    const paddingBottom = `${(h / w) * 100}%`;

    return (
        <figure
            onClick={onClick}
            className={classes(className, styles.figure, {
                [styles.invertDark]: invertDark,
            })}
        >
            <div className={styles.relative} style={{paddingBottom}}>
                {src.match(/\.\w+$/) ? (
                    <img
                        loading="lazy"
                        className={styles.media}
                        src={src}
                        alt={alt}
                    />
                ) : (
                    <video
                        className={styles.media}
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        {exts.map((ext) => (
                            <source
                                key={ext}
                                src={`${src}.${ext}`}
                                type={`video/${ext}`}
                            />
                        ))}
                    </video>
                )}
            </div>
            {alt && showAlt && (
                <figcaption className={styles.alt}>{alt}</figcaption>
            )}
        </figure>
    );
}
