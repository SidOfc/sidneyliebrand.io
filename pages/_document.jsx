import NextDocument, {Html, Head, Main, NextScript} from 'next/document';
import {minify} from 'uglify-js';
import {themes} from '@data/sass-variables.json';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: minify(
                                `
                                    try {
                                        var theme = localStorage.getItem('theme');
                                        if (theme) {
                                            var d = document;
                                            var html = d.querySelector('html');
                                            var style = d.createElement('style');
                                            var backgrounds = ${JSON.stringify(
                                                Object.entries(themes).reduce(
                                                    (acc, [theme, rules]) => ({
                                                        ...acc,
                                                        [theme]:
                                                            rules['page-bg'],
                                                    }),
                                                    {}
                                                )
                                            )};

                                            html.setAttribute('class', theme);
                                            style.innerHTML = 'html { background-color:' + backgrounds[theme] + '; }';

                                            d.head.appendChild(style);
                                        }
                                    } catch (e) {
                                    }
                                `,
                                {mangle: {toplevel: true}}
                            ).code,
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
