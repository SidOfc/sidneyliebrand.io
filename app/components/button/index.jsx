import Link from 'next/link';
import styles from './button.module.scss';
import {classes} from '@src/util';

export default function Button({
    href,
    className,
    children,
    disabled,
    onClick,
    tabIndex = 0,
}) {
    const button = (
        <button
            tabIndex={tabIndex}
            className={classes(className, {disabled}, styles.button)}
            onClick={disabled ? null : onClick}
        >
            {children}
        </button>
    );

    return href ? <Link href={href}>{button}</Link> : button;
}
