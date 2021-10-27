import {useCallback} from 'react';
import styles from './dropdown.module.scss';

export default function Dropdown({
    name,
    items,
    value,
    onChange,
    disabled,
    allowReset,
    placeholder = 'None',
    resetValue = null,
    asCaption = String,
}) {
    const selectedIndex = items.indexOf(value);
    const selectedItem = items[selectedIndex];
    const onChangeHandler = useCallback(
        ({target: {value: v}}) => {
            const isResetValue = v === '-1';

            if (!disabled && (isResetValue ? allowReset : true)) {
                onChange(isResetValue ? resetValue : items[v]);
            }
        },
        [items, resetValue, onChange, disabled, allowReset]
    );

    return (
        <div className={styles.dropdown}>
            <select
                id={name}
                name={name}
                className={styles.select}
                value={selectedIndex}
                onChange={onChangeHandler}
                tabIndex={disabled ? -1 : 0}
            >
                <option value="-1" disabled={!allowReset} hidden={!allowReset}>
                    {placeholder}
                </option>
                {items.map((item, idx) => (
                    <option key={idx} value={idx}>
                        {asCaption(item)}
                    </option>
                ))}
            </select>
            <div className={styles.overlay}>
                {selectedItem ? asCaption(selectedItem) : placeholder}
            </div>
        </div>
    );
}
