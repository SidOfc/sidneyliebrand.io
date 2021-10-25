import {useEffect, useState} from 'react';
import {handleKeys} from '@src/util';

let escapeQueue = 0;
let escapePaused = false;

// Enables "layering" of escape keypresses in components.
// The "last" component to `useEscape` will be the first
// to "trigger". An `escapeQueue` counter is maintained to
// be able to figure out which handler may be triggered.
export default function useEscape(handler) {
    const [position] = useState(escapeQueue + 1);

    useEffect(() => {
        escapeQueue = position;
        const close = handleKeys('escape', (event) => {
            !escapePaused &&
                handler &&
                escapeQueue === position &&
                handler(event);
        });

        window.addEventListener('keydown', close);

        return () => {
            window.removeEventListener('keydown', close);
            escapeQueue -= 1;
        };
    });
}

export function pauseEscape() {
    escapePaused = true;
}

export function resumeEscape() {
    escapePaused = false;
}
