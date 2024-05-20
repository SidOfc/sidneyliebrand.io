import '@styles/application.scss';
import {Layout as ApplicationLayout} from '@components/layout';
import ThemeScript from '@components/theme-script';
import {Quicksand} from 'next/font/google';
import {prismStyles} from '@src/util/prism';
import {getMetadata} from '@src/util/static';

const quicksand = Quicksand({subsets: ['latin']});

export const viewport = {
    themeColor: {color: '#ffffff'},
    initialScale: 1,
    width: 'device-width',
};

export async function generateMetadata() {
    return getMetadata();
}

export default function Layout({children}) {
    return (
        <html suppressHydrationWarning lang="en">
            <head>
                <ThemeScript />
                <style>{prismStyles}</style>
            </head>
            <body>
                <ApplicationLayout className={quicksand.className}>
                    {children}
                </ApplicationLayout>
            </body>
        </html>
    );
}
