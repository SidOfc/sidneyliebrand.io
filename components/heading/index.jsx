import styles from './heading.module.scss';
import innerText from 'react-innertext';
import {slug} from '../../util';

export default function Heading({as: Component = 'h1', children, link}) {
    const fragment = link ? null : slug(innerText(children));

    return (
        <Component
            className={styles.container}
            onClick={(event) => {
                if (link) {
                    event.preventDefault();
                    if (window.history) {
                        window.history.replaceState({}, document.title, link);
                        window.scrollTo(0, 0);
                    } else {
                        window.location.href = link;
                    }
                }
            }}
        >
            {fragment && <a className={styles.anchor} id={fragment} />}
            <a className={styles.link} href={link || `#${fragment}`}>
                {children}
            </a>
        </Component>
    );
}
