import NextDocument, {Html, Head, Main, NextScript} from 'next/document';
import {readFileSync} from 'fs';
import {minify} from 'uglify-js';
import {prismStyles} from '@src/util/prism';
import sassVars from '@data/sass-variables.json';

export default class Document extends NextDocument {
    render() {
        return (
            <Html lang="en" className="no-js">
                <Head>
                    <script
                        dangerouslySetInnerHTML={{
                            __html: minify(
                                `
                                    window.themeBackgrounds = ${JSON.stringify(
                                        Object.entries(sassVars.themes).reduce(
                                            (acc, [theme, rules]) => ({
                                                ...acc,
                                                [theme]: rules['page-bg'],
                                            }),
                                            {},
                                        ),
                                    )};
                                    window.themeNames = Object.keys(themeBackgrounds);
                                    ${readFileSync('public/document.js')}
                                `,
                                {mangle: {toplevel: true}},
                            ).code,
                        }}
                    />
                </Head>
                <style>{prismStyles}</style>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        );
    }
}
