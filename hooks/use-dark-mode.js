import {useState, useEffect, useLayoutEffect} from 'react';

export default function useDarkMode() {
    const [isDark, setDark] = useState(() => {
        return process.browser
            ? document.body.getAttribute('class')?.includes('dark')
            : false;
    });

    useEffect(() => {
        if (isDark) {
            document.body.setAttribute('class', 'dark');
            try {
                localStorage.setItem('dark', 'true');
            } catch (e) {}
        } else {
            document.body.setAttribute('class', '');
            try {
                localStorage.removeItem('dark');
            } catch (e) {}
        }
    }, [isDark]);

    return {isDark, toggleDark: () => setDark(!isDark)};
}
