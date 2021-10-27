import styles from './input.module.scss';
import {classes, handleKeys} from '@src/util';

export default function Input({
    placeholder,
    value,
    className,
    onFocus,
    onBlur,
    onChange,
    onEnter,
}) {
    return (
        <input
            className={classes(className, styles.input)}
            type="text"
            value={value}
            placeholder={placeholder}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={onEnter ? handleKeys('enter', onEnter) : null}
        />
    );
}
