import '@styles/application.scss';
import {Layout} from '@components/layout';

export default function Application({Component, pageProps}) {
    return (
        <Layout>
            <Component {...pageProps} />
        </Layout>
    );
}
