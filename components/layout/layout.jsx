import Link from 'next/link';
import Image from 'next/image';
import styles from './layout.module.scss';

export default function Layout({children}) {
    return (
        <div className={styles.application}>
            <header className={styles.header}>
                <div className={styles.header__fixed}>
                    <div className={styles.header__content}>
                        <Link href="/">
                            <a
                                title="Home page"
                                className={styles.header__logo}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 429.29 114.44"
                                    version="1.1"
                                    preserveAspectRatio="xMidYMid slice"
                                >
                                    <path d="M33.43,96.21c18.22,0,25-17.14,8.48-26.76C29,61.94,11.44,60.75,3.93,46S3.07,12.14,17.4,4.71c15.35-8,36.69-5.08,51.36,3L62.4,24.49C53.63,19.59,41,16,31.08,19.76c-9.33,3.55-10.69,13.62-3.22,20.08,7.83,6.77,19.62,7.95,28.53,13,11.12,6.31,17.37,16.65,17.32,29.41-.12,27.84-27.22,34.19-50.28,31.69-6-.65-22.15-3.42-23.36-9.38C-.67,100.91,4.59,92,5.88,88.44A53,53,0,0,0,33.43,96.21Z" />
                                    <path d="M162,112.11H93.31V2.77h21.91V94.09H162Z" />
                                    <path d="M229.15,98.15c0,20.64-31.72,20.67-31.62,0C197.63,78,229.15,77.92,229.15,98.15Z" />
                                    <path d="M267,112.11v-18H290.8V20.78H267v-18h69.42v18H312.7V94.09h23.67v18Z" />
                                    <path d="M350.5,57.35c0-25.51,8.42-57,39.39-57.06,31.32-.09,39.4,31.31,39.4,57.06,0,24.69-7.42,55.53-37.19,57C359.55,115.88,350.5,84,350.5,57.35Zm22.08,0c0,12.19-.62,38.21,17.31,38.15s17.3-25.85,17.32-38.15.62-38.12-17.32-38.16S372.58,45.23,372.58,57.35Z" />
                                </svg>
                            </a>
                        </Link>
                        <nav className={styles.header__navigation}>
                            <Link href="/til">
                                <a title="Things I learned">TIL</a>
                            </Link>
                            <Link href="/cv">
                                <a title="Curriculum Vitae">C.V.</a>
                            </Link>
                            <Link href="https://github.com/sidofc">
                                <a
                                    title="Sidney Liebrand's GitHub page"
                                    className={styles.github}
                                >
                                    <svg
                                        fill="#000000"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 16 16"
                                        version="1.1"
                                        preserveAspectRatio="xMidYMid slice"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"
                                        ></path>
                                    </svg>
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
