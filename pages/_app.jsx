import {useState, useEffect} from 'react';
import '@styles/application.scss';
import {Layout} from '@components/layout';

export default function Application({Component, pageProps}) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        isMounted && (
            <Layout>
                <Component {...pageProps} />
            </Layout>
        )
    );
}
