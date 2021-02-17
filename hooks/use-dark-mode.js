import {useState, useEffect} from 'react';

export default function useDarkMode() {
    const [isDark, setDark] = useState(() => {
        return process.browser
            ? document.body.getAttribute('class')?.includes('dark')
            : false;
    });

    useEffect(() => {
        try {
            if (isDark) {
                document.body.setAttribute('class', 'dark');
                localStorage.setItem('dark', 'true');
            } else {
                document.body.setAttribute('class', '');
                localStorage.removeItem('dark');
            }
        } catch (e) {}
    }, [isDark]);

    return {isDark, toggleDark: () => setDark(!isDark)};
}
