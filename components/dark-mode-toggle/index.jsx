import styles from './dark-mode-toggle.module.scss';
import {classes} from '@src/util';
import useDarkMode from '@hooks/use-dark-mode';

export default function DarkModeToggle() {
    const {isDark, toggleDark} = useDarkMode();

    return (
        <div
            tabIndex={0}
            onClick={toggleDark}
            title="Toggle dark theme"
            onKeyDown={(event) => {
                if (event.key === 'Enter') {
                    event.stopPropagation();
                    event.preventDefault();
                    toggleDark();
                }
            }}
            className={styles.wrapper}
        >
            <svg
                fill="#000000"
                className={classes(styles.toggle, styles.toggleDark)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M6.76 4.84l-1.8-1.79-1.41 1.41 1.79 1.79 1.42-1.41zM4 10.5H1v2h3v-2zm9-9.95h-2V3.5h2V.55zm7.45 3.91l-1.41-1.41-1.79 1.79 1.41 1.41 1.79-1.79zm-3.21 13.7l1.79 1.8 1.41-1.41-1.8-1.79-1.4 1.4zM20 10.5v2h3v-2h-3zm-8-5c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm-1 16.95h2V19.5h-2v2.95zm-7.45-3.91l1.41 1.41 1.79-1.8-1.41-1.41-1.79 1.8z" />
            </svg>
            <svg
                fill="#000000"
                className={classes(styles.toggle, styles.toggleLight)}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
            >
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M9.5,2c-1.82,0-3.53,0.5-5,1.35c2.99,1.73,5,4.95,5,8.65s-2.01,6.92-5,8.65C5.97,21.5,7.68,22,9.5,22c5.52,0,10-4.48,10-10 S15.02,2,9.5,2z" />
            </svg>
        </div>
    );
}
