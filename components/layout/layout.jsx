import styles from './layout.module.scss';
import Link from 'next/link';
import Media from '@components/media';
import Text from '@components/text';

export default function Layout({children}) {
    return (
        <div className={styles.application}>
            <header className={styles.header}>
                <div className={styles.headerFixed}>
                    <div className={styles.headerContent}>
                        <Link href="/">
                            <a className={styles.logo} title="View home page">
                                <span className={styles.logoCode}>{'<'}</span>
                                Sidney
                                <span className={styles.logoCode}>.</span>
                                Liebrand&nbsp;
                                <span className={styles.logoCode}>/{'>'}</span>
                            </a>
                        </Link>
                        <nav className={styles.navigation}>
                            <Link href="/cv">
                                <a title="View curriculum vitae">C.V.</a>
                            </Link>
                            <Link href="https://github.com/sidofc">
                                <a
                                    className={styles.githubWrapper}
                                    title="Visit Sidney Liebrand's GitHub page"
                                >
                                    <Media
                                        className={styles.github}
                                        src="/media/github.svg"
                                        alt="Sidney Liebrand's GitHub page"
                                        showAlt={false}
                                        width={16}
                                        height={16}
                                    />
                                </a>
                            </Link>
                        </nav>
                    </div>
                </div>
            </header>
            <main className={styles.content}>{children}</main>
            <footer className={styles.footer}>
                <strong>&copy;</strong> sidneyliebrand.io{' '}
                {new Date().getFullYear()}
            </footer>
        </div>
    );
}
