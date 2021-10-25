import {useEffect, useState, useRef} from 'react';
import {createPortal} from 'react-dom';

function createPortalRoot(name) {
    const portal = document.createElement('div');
    portal.setAttribute('id', name);

    return portal;
}

export default function usePortal(id) {
    const elementRef = useRef(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        elementRef.current ||= document.createElement('div');

        const foundRoot = document.getElementById(id);
        const rootElem = foundRoot || createPortalRoot(id);

        if (!foundRoot) document.body.appendChild(rootElem);
        rootElem.appendChild(elementRef.current);

        setMounted(true);

        return () => {
            if (elementRef.current)
                elementRef.current.parentNode?.removeChild(elementRef.current);
            if (rootElem.childNodes.length < 1)
                rootElem.parentNode?.removeChild(rootElem);
        };
    }, [id]);

    return {
        teleport(children) {
            return elementRef.current
                ? createPortal(children, elementRef.current)
                : null;
        },
    };
}
