import {useState, useEffect, useLayoutEffect} from 'react';

export default function useDarkMode() {
    const [isDark, setDark] = useState(false);

    useLayoutEffect(() => {
        setDark(document.body.getAttribute('class')?.includes('dark'));
    }, []);

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
