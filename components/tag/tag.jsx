import styles from './tag.module.scss';
import {classes} from '../../util';

export default function Tag({className, children}) {
    return <span className={classes(className, styles.tag)}>{children}</span>;
}
