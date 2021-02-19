import NextDocument, {Html, Head, Main, NextScript} from 'next/document';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                        try {
                            if (localStorage.getItem('dark')) {
                                var html = document.querySelector('html');
                                var style = document.createElement('style');

                                html.setAttribute('class', 'dark')
                                style.innerHTML = 'html { background-color: #111; }';

                                document.head.appendChild(style);
                            }
                        } catch (e) {
                        }
                    `,
                        }}
                    />
                </Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
