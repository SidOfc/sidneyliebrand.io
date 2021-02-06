import styles from './button.module.scss';
import {classes} from '../../util';

export default function Button({className, children}) {
    return (
        <button className={classes(className, styles.button)}>
            {children}
        </button>
    );
}
