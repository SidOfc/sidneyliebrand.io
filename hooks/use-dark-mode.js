import {useState, useCallback, useEffect} from 'react';

export default function useDarkMode() {
    const [isDark, setDark] = useState(() => {
        return process.browser
            ? document
                  .querySelector('html')
                  .getAttribute('class')
                  ?.includes('dark')
            : false;
    });
    const toggleDark = useCallback(() => setDark((prev) => !prev), []);

    useEffect(() => {
        try {
            const html = document.querySelector('html');
            if (isDark) {
                html.setAttribute('class', 'dark');
                localStorage.setItem('theme', 'dark');
            } else {
                html.setAttribute('class', '');
                localStorage.removeItem('theme');
            }
        } catch (e) {}
    }, [isDark]);

    return {isDark, toggleDark};
}
