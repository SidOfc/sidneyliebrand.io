import styles from './button.module.scss';
import {classes} from '@src/util';

export default function Button({className, children, tabIndex = 0}) {
    return (
        <button
            tabIndex={tabIndex}
            className={classes(className, styles.button)}
        >
            {children}
        </button>
    );
}
