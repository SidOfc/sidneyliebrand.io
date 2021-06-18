(function () {
    var themeBackgrounds = window.themeBackgrounds || {};
    var themeNames = Object.keys(themeBackgrounds);
    var d = document;
    var html = d.querySelector('html');
    var style = d.createElement('style');
    var theme;

    try {
        theme = localStorage.getItem('theme');
    } catch (e) {}

    theme = theme || 'light';

    function applyTheme(theme, store) {
        themeNames.forEach(function (name) {
            html.classList.remove(name);
        });

        if (theme) {
            html.classList.add(theme);
            style.innerHTML =
                'html { background-color:' + themeBackgrounds[theme] + '; }';
        }

        if (store) {
            try {
                if (theme) {
                    localStorage.setItem('theme', theme);
                } else {
                    localStorage.removeItem('theme');
                }
            } catch (e) {}
        }
    }

    html.classList.remove('no-js');
    d.head.appendChild(style);

    window.addEventListener('click', function (ev) {
        const theme = ev.target.getAttribute('data-theme');
        if (theme) applyTheme(theme, true);
    });

    window.addEventListener('storage', function (ev) {
        if (ev.key === 'theme') applyTheme(ev.newValue);
    });

    if (window.matchMedia) {
        var darkThemeQuery = window.matchMedia('(prefers-color-scheme: dark)');

        if (!theme && darkThemeQuery.matches) theme = 'dark';

        darkThemeQuery.addEventListener('change', function (query) {
            try {
                if (!localStorage.getItem('theme')) {
                    applyTheme(query.matches ? 'dark' : 'light');
                }
            } catch (e) {}
        });
    }

    applyTheme(theme);
})();
