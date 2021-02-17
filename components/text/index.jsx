import styles from './text.module.scss';
import {classes} from '@src/util';

export default function Text({color, className, ...props}) {
    return (
        <span
            {...props}
            className={classes(className, {[styles[`${color}-fg`]]: color})}
        />
    );
}
