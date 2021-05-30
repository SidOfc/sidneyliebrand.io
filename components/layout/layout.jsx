import styles from './layout.module.scss';
import Link from 'next/link';
import Media from '@components/media';
import Text from '@components/text';
import Bullet from '@components/bullet';
import DarkModeToggle from '@components/dark-mode-toggle';

export default function Layout({children}) {
    return (
        <div className={styles.application}>
            <header className={styles.header}>
                <div className={styles.headerFixed}>
                    <div className={styles.headerContent}>
                        <Link href="/">
                            <a className={styles.logo} title="View home page">
                                <span className={styles.logoTopLeft} />
                                <span className={styles.logoBottomLeft} />
                                <span className={styles.logoTopRight} />
                                <span className={styles.logoBottomRight} />
                            </a>
                        </Link>
                        <nav className={styles.navigation}>
                            <Link href="/cv">
                                <a title="View curriculum vitae">C.V.</a>
                            </Link>
                            <Link
                                className={styles.githubWrapper}
                                href="https://github.com/SidOfc"
                            >
                                <a title="Visit Sidney Liebrand's GitHub page">
                                    <Media
                                        invertDark
                                        className={styles.github}
                                        src="/media/github.svg"
                                        alt="Sidney Liebrand's GitHub page"
                                        showAlt={false}
                                        width={16}
                                        height={16}
                                    />
                                </a>
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
                <Link href="/feed.xml">
                    <a title="View RSS feed">RSS</a>
                </Link>
                <Bullet wide />
                <Link href="/atom.xml">
                    <a title="View Atom feed">Atom</a>
                </Link>
            </footer>
        </div>
    );
}
