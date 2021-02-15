import Link from 'next/link';
import styles from './button.module.scss';
import {classes} from '@src/util';

export default function Button({
    href,
    as: Component = href ? 'a' : 'button',
    className,
    children,
    tabIndex = 0,
}) {
    const button = (
        <Component
            tabIndex={tabIndex}
            className={classes(className, styles.button)}
        >
            {children}
        </Component>
    );

    return Component === 'a' ? <Link href={href}>{button}</Link> : button;
}
