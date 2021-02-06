import styles from './image.module.scss';
import {classes} from '../../util';
import NextImage from 'next/image';

export default function Image({src, width, height, className, alt}) {
    return (
        <div className={classes(className, styles.image)}>
            {src && <NextImage src={src} alt={alt} layout="fill" />}
            <div
                style={{
                    paddingBottom: `${
                        (parseInt(height) / parseInt(width)) * 100
                    }%`,
                }}
            />
        </div>
    );
}
