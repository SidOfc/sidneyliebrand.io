import NextDocument, {Html, Head, Main, NextScript} from 'next/document';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head />
                <body>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                        try {
                            if (localStorage.getItem('dark')) {
                                document.body.setAttribute('class', 'dark')
                            }
                        } catch (e) {
                        }
                    `,
                        }}
                    />
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
