import styles from './popup.module.scss';
import usePortal from '@hooks/use-portal';
import useEscape from '@hooks/use-escape';
import useScrollLock from '@hooks/use-scroll-lock';

export default function Popup({onClose, children}) {
    const {teleport} = usePortal('modal');

    useScrollLock();
    useEscape((event) => onClose && onClose(event));

    return teleport(
        <div
            className={styles.popup}
            onClick={(event) => {
                event.stopPropagation();
                onClose?.(event);
            }}
        >
            <div
                className={styles.popupContent}
                onClick={(event) => event.stopPropagation()}
            >
                {children}
            </div>
        </div>,
    );
}
