import '@styles/application.scss';
import {Layout} from '@components/layout';
import {Quicksand} from 'next/font/google';

const quicksand = Quicksand({subsets: ['latin']});

export default function Application({Component, pageProps}) {
    return (
        <Layout className={quicksand.className}>
            <Component {...pageProps} />
        </Layout>
    );
}
