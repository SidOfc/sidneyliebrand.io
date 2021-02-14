import styles from './bullet.module.scss';
import {classes} from '@src/util';

export default function Bullet({className, wide}) {
    return (
        <span
            className={classes(className, styles.bullet, {[styles.wide]: wide})}
        >
            &bull;
        </span>
    );
}
