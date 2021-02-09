import {Fragment} from 'react';
import styles from './text.module.scss';
import {classes} from '../../util';

export default function Text({color, className, ...props}) {
    return (
        <span
            {...props}
            className={classes(className, {[styles[`${color}-fg`]]: color})}
        />
    );
}
