import {useEffect} from 'react';

let lockCount = 0;
export default function useScrollLock() {
    return useEffect(() => {
        lockCount += 1;
        document.body.classList.add('no-scroll');

        return () => {
            lockCount -= 1;
            if (lockCount === 0) document.body.classList.remove('no-scroll');
        };
    }, []);
}
