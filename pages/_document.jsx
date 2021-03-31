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
                                    var style = d.createElement('style');
                                    var themeBackgrounds = ${JSON.stringify(
                                        Object.entries(themes).reduce(
                                            (acc, [theme, rules]) => ({
                                                ...acc,
                                                [theme]: rules['page-bg'],
                                            }),
                                            {}
                                        )
                                    )};
                                    var themeNames = Object.keys(themeBackgrounds);

                                    html.classList.remove('no-js');
                                    d.head.appendChild(style);

                                    function applyTheme(theme, store) {
                                        if (theme) {
                                            themeNames.forEach(function(name) {
                                                html.classList.remove(name);
                                            });

                                            html.classList.add(theme);
                                            style.innerHTML = 'html { background-color:' + themeBackgrounds[theme] + '; }';

                                            if (store) {
                                                try {
                                                    localStorage.setItem('theme', theme);
                                                } catch(e) {}
                                            }
                                        }
                                    }

                                    window.addEventListener('click', function(ev) {
                                        applyTheme(ev.target.getAttribute('data-theme'), true);
                                    }, {passive: true});

                                    try {
                                        var theme = localStorage.getItem('theme');

                                        if (window.matchMedia) {
                                            var darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

                                            if (!theme && darkThemeQuery.matches) theme = 'dark';

                                            darkThemeQuery.addEventListener('change', function(query) {
                                                if (!localStorage.getItem('theme')) {
                                                    applyTheme(query.matches ? 'dark' : 'light');
                                                }
                                            });
                                        }

                                        applyTheme(theme);
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
