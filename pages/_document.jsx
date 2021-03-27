import NextDocument, {Html, Head, Main, NextScript} from 'next/document';
import {minify} from 'uglify-js';
import sassVars from '@data/sass-variables.json';

const {themes} = sassVars;

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en" class="no-js">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: minify(
                                `
                                    var d = document;
                                    var html = d.querySelector('html');

                                    html.classList.remove('no-js');

                                    window.addEventListener('click', function(ev) {
                                        var theme = ev.target.getAttribute('data-theme');
                                        if (theme) {
                                            ${JSON.stringify(
                                                Object.keys(themes)
                                            )}.map(function(name) {
                                                html.classList.remove(name);
                                            });

                                            try {
                                                html.classList.add(theme);
                                                localStorage.setItem('theme', theme);
                                            } catch(e) {}
                                        }
                                    }, {passive: true});

                                    try {
                                        var theme = localStorage.getItem('theme');
                                        if (theme) {
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

                                            html.classList.add(theme);
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
