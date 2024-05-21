import styles from './layout.module.scss';
import Link from 'next/link';
import Media from '@components/media';
import Bullet from '@components/bullet';
import DarkModeToggle from '@components/dark-mode-toggle';
import {classes} from '@src/util';

export default function Layout({children, className}) {
    return (
        <div className={classes(styles.application, className)}>
            <header className={styles.header}>
                <div className={styles.headerFixed}>
                    <div className={styles.headerContent}>
                        <Link
                            href="/"
                            className={styles.logo}
                            title="View home page"
                        >
                            <span className={styles.logoTopLeft} />
                            <span className={styles.logoBottomLeft} />
                            <span className={styles.logoTopRight} />
                            <span className={styles.logoBottomRight} />
                        </Link>
                        <nav className={styles.navigation}>
                            <Link href="/cv" title="View curriculum vitae">
                                C.V.
                            </Link>
                            <Link
                                className={styles.githubWrapper}
                                href="https://github.com/SidOfc"
                                title="Visit Sidney Liebrand's GitHub page"
                            >
                                <Media
                                    invertDark
                                    className={styles.github}
                                    src="/media/github.svg"
                                    alt="Sidney Liebrand's GitHub page"
                                    showAlt={false}
                                    width={16}
                                    height={16}
                                />
                            </Link>
                            <DarkModeToggle />
                        </nav>
                    </div>
                </div>
            </header>
            <main className={styles.content}>{children}</main>
            <footer className={styles.footer}>
                <strong>&copy;</strong> sidneyliebrand.io{' '}
                {new Date().getFullYear()}
                <Bullet wide />
                <Link prefetch={false} href="/feed.xml" title="View RSS feed">
                    RSS
                </Link>
                <Bullet wide />
                <Link prefetch={false} href="/atom.xml" title="View Atom feed">
                    Atom
                </Link>
            </footer>
        </div>
    );
}
