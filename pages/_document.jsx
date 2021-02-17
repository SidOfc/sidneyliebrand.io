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
                                var style = document.createElement('style');
                                style.innerHTML = 'html { background-color: #111; }';
                                document.head.appendChild(style);
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
