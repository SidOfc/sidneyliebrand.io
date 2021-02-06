import {Fragment} from 'react';
import styles from './text.module.scss';
import {classes} from '../../util';

export default function Text({
    href,
    as: Component = href ? Fragment : 'span',
    nowrap,
    color,
    className,
    children,
    ...props
}) {
    const classNames = classes(className, {
        [styles.nowrap]: nowrap,
        [styles[`${color}-fg`]]: color,
    });

    return (
        <Component
            {...([Fragment, 'a'].includes(Component)
                ? {}
                : {className: classNames, ...props})}
        >
            {href ? (
                <a
                    href={href}
                    className={classNames}
                    {...(href.startsWith('http')
                        ? {
                              target: '_blank',
                              rel: 'noopener,noreferrer',
                          }
                        : {})}
                >
                    {children}
                </a>
            ) : (
                children
            )}
        </Component>
    );
}
