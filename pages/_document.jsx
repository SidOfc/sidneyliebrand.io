import NextDocument, {Html, Head, Main, NextScript} from 'next/document';
import {themes} from '@data/sass-variables.json';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: `
                        try {
                            var theme = localStorage.getItem('theme');
                            if (theme) {
                                var html = document.querySelector('html');
                                var style = document.createElement('style');
                                var themes = ${JSON.stringify(themes)};

                                html.setAttribute('class', theme);
                                style.innerHTML = 'html { background-color:' + themes[theme]['page-bg'] + '; }';

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
