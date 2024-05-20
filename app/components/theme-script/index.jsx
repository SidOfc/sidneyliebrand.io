import sassVars from '@data/sass-variables';
import {minify} from 'terser';

const themes = JSON.stringify(Object.keys(sassVars.themes));

function hook(themes = []) {
    const html = document.querySelector('html');
    const applyTheme = (theme, store) => {
        for (const name of themes) html.classList.remove(name);

        if (theme) html.classList.add(theme);
        if (store) {
            try {
                if (theme) {
                    localStorage.setItem('theme', theme);
                } else {
                    localStorage.removeItem('theme');
                }
            } catch (error) {
                // console.error(error);
            }
        }
    };

    let theme;

    try {
        theme ||= localStorage.getItem('theme');
    } catch (error) {
        theme ||= 'light';
        // console.error(error);
    }

    html.classList.remove('no-js');
    window.addEventListener('click', (ev) => {
        const theme = ev.target.getAttribute('data-theme');

        if (theme) applyTheme(theme, true);
    });

    window.addEventListener('storage', (ev) => {
        if (ev.key === 'theme') applyTheme(ev.newValue);
    });

    if (window.matchMedia) {
        var darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        if (!theme && darkThemeQuery.matches) theme = 'dark';

        darkThemeQuery.addEventListener('change', (query) => {
            try {
                if (!localStorage.getItem('theme')) {
                    applyTheme(query.matches ? 'dark' : 'light');
                }
            } catch (error) {
                // console.error(error);
            }
        });
    }

    applyTheme(theme);
}

export default async function ThemeScript() {
    const {code: __html} = await minify(`(${hook})(${themes})`);

    return <script dangerouslySetInnerHTML={{__html}} />;
}
