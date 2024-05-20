import styles from './text.module.scss';
import {classes} from '@src/util';

export default function Text({
    bold,
    italic,
    color,
    className,
    as: Component = 'span',
    ...props
}) {
    return (
        <Component
            {...props}
            className={classes(className, {
                [styles.bold]: bold,
                [styles.italic]: italic,
                [styles[`${color}-fg`]]: color,
            })}
        />
    );
}
