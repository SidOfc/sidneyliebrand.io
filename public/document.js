(function () {
    var themeBackgrounds = window.themeBackgrounds || {};
    var themeNames = Object.keys(themeBackgrounds);
    var d = document;
    var html = d.querySelector('html');
    var style = d.createElement('style');

    html.classList.remove('no-js');
    d.head.appendChild(style);

    function applyTheme(theme, store) {
        if (theme) {
            themeNames.forEach(function (name) {
                html.classList.remove(name);
            });

            html.classList.add(theme);
            style.innerHTML =
                'html { background-color:' + themeBackgrounds[theme] + '; }';

            if (store) {
                try {
                    localStorage.setItem('theme', theme);
                } catch (e) {}
            }
        }
    }

    window.addEventListener(
        'click',
        function (ev) {
            applyTheme(ev.target.getAttribute('data-theme'), true);
        },
        {passive: true}
    );

    try {
        var theme = localStorage.getItem('theme');

        if (window.matchMedia) {
            var darkThemeQuery = window.matchMedia(
                '(prefers-color-scheme: dark)'
            );

            if (!theme && darkThemeQuery.matches) theme = 'dark';

            darkThemeQuery.addEventListener('change', function (query) {
                if (!localStorage.getItem('theme')) {
                    applyTheme(query.matches ? 'dark' : 'light');
                }
            });
        }

        applyTheme(theme);
    } catch (e) {}
})();
