import Link from 'next/link';
import Image from '../image';
import Text from '../text';
import styles from './layout.module.scss';

export default function Layout({children}) {
    return (
        <div className={styles.application}>
            <header className={styles.header}>
                <div className={styles.headerFixed}>
                    <div className={styles.headerContent}>
                        <Link href="/">
                            <a className={styles.logo}>
                                <span className={styles.logoCode}>{'<'}</span>
                                Sidney
                                <span className={styles.logoCode}>.</span>
                                Liebrand&nbsp;
                                <span className={styles.logoCode}>/{'>'}</span>
                            </a>
                        </Link>
                        <nav className={styles.navigation}>
                            <Link href="/til">
                                <a title="Things I learned">TIL</a>
                            </Link>
                            <Link href="/cv">
                                <a title="Curriculum Vitae">C.V.</a>
                            </Link>
                            <Link href="https://github.com/sidofc">
                                <a title="Sidney Liebrand's GitHub page">
                                    <Image
                                        className={styles.github}
                                        src="/media/github.svg"
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
