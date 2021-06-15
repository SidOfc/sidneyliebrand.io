import {useState, useRef} from 'react';
import styles from './caniuse.module.scss';
import {classes, dateFormat} from '@src/util';
import t from '@src/util/translate';

let _uid = 0;
export default function Caniuse({data}) {
    const [active, setActive] = useState(null);
    const {current: uid} = useRef(_uid++);
    const activeTimeoutRef = useRef();
    const regularNotes = data.notes.filter(({note}) => note === null);
    const numberedNotes = data.notes.filter(({note}) => Number.isInteger(note));
    const activate = (cell) => () => {
        clearTimeout(activeTimeoutRef.current);
        activeTimeoutRef.current = setTimeout(() => setActive(cell), 125);
    };

    return (
        <section className={styles.caniuse}>
            <div className={styles.header}>
                <span className={styles.title}>
                    <a
                        href={`https://caniuse.com/${data.id}`}
                        target="_blank"
                        rel="noreferrer"
                    >
                        {data.title}
                    </a>
                    <span className={styles.status}>{data.status}</span>
                </span>
                <span className={styles.headerMeta}>
                    <span className={classes(styles.textRow, styles.rowStatus)}>
                        <span
                            title={`%${data.usage.y} supported`}
                            className={styles.green}
                        >
                            %{data.usage.y.toFixed(2)}
                        </span>
                        {data.usage.a > 0 && (
                            <>
                                <span className={styles.operator}>+</span>
                                <span
                                    title={`%${data.usage.y} partially supported`}
                                    className={styles.yellow}
                                >
                                    %{data.usage.a.toFixed(2)}
                                </span>
                                <span className={styles.operator}>=</span>
                                <span title={`%${data.usage.y} total`}>
                                    %{(data.usage.y + data.usage.a).toFixed(2)}
                                </span>
                            </>
                        )}
                    </span>
                </span>
                <p
                    className={styles.description}
                    dangerouslySetInnerHTML={{__html: data.description}}
                />
                <small className={styles.updated}>
                    updated{' '}
                    {dateFormat(new Date(data.updated), {includeDay: true})}
                </small>
            </div>
            <div className={styles.table}>
                <div className={styles.tableHeader}>
                    {data.stats.map(({id, name}) => (
                        <div key={name} className={styles.column}>
                            <div className={styles.browser} data-name={id}>
                                {name}
                            </div>
                        </div>
                    ))}
                </div>
                <div
                    className={classes(styles.tableBody, styles.tableBodyPast)}
                >
                    {data.stats.map(({id, name, versions}) => (
                        <div key={name} className={styles.column}>
                            {versions
                                .filter(({era}) => era < 0)
                                .map((cell, idx) => (
                                    <VersionCell
                                        item={cell}
                                        prefix={data.prefixes[id]}
                                        key={idx}
                                        onMouseEnter={activate(cell)}
                                        onMouseLeave={activate(null)}
                                    />
                                ))}
                        </div>
                    ))}
                </div>
                <div
                    className={classes(
                        styles.tableBody,
                        styles.tableBodyCurrent
                    )}
                >
                    {data.stats.map(({id, name, versions}) => {
                        const cell = versions.find(({era}) => era === 0);

                        return (
                            <div key={name} className={styles.column}>
                                <VersionCell
                                    item={cell}
                                    prefix={data.prefixes[id]}
                                    key={name}
                                    onMouseEnter={activate(cell)}
                                    onMouseLeave={activate(null)}
                                />
                            </div>
                        );
                    })}
                </div>
                <div className={styles.tableBody}>
                    {data.stats.map(({name, versions}) => (
                        <div key={name} className={styles.column}>
                            {versions
                                .filter(({era}) => era > 0)
                                .map((cell, idx) => (
                                    <VersionCell
                                        item={cell}
                                        key={idx}
                                        onMouseEnter={activate(cell)}
                                        onMouseLeave={activate(null)}
                                    />
                                ))}
                        </div>
                    ))}
                </div>
            </div>
            {['notes', 'links', 'bugs'].map((type) => (
                <input
                    key={type}
                    type="radio"
                    name={data.id}
                    id={`${data.id}-${type}-${uid}`}
                    value={type}
                    className={styles.tabRadio}
                    defaultChecked={type === 'notes'}
                />
            ))}
            <div className={styles.tabs}>
                {['notes', 'links', 'bugs']
                    .filter((type) => data[type]?.length > 0)
                    .map((type) => (
                        <label
                            key={type}
                            data-tab={type}
                            htmlFor={`${data.id}-${type}-${uid}`}
                            className={styles.tabToggle}
                        >
                            {t(`caniuse.tabs.${type}`)}
                        </label>
                    ))}
            </div>
            <div className={styles.tabContents} data-tab="notes">
                {regularNotes.length > 0 && (
                    <ul>
                        {regularNotes.map(({text}, idx) => (
                            <li key={idx}>{text}</li>
                        ))}
                    </ul>
                )}
                <ul>
                    {numberedNotes.map(({note, text}) => (
                        <li key={note}>
                            {note && (
                                <span className={styles.noteNum}>{note}</span>
                            )}
                            <span
                                className={classes({
                                    [styles.activeNote]:
                                        active?.notes?.includes(note),
                                })}
                                dangerouslySetInnerHTML={{
                                    __html: text,
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.tabContents} data-tab="links">
                <ul>
                    {data.links.map(({url, title}) => (
                        <li key={url}>
                            <span className={styles.bullet} />
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener, noreferrer"
                            >
                                {title}
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
            <div className={styles.tabContents} data-tab="bugs">
                <ul>
                    {data.bugs.map((description, idx) => (
                        <li
                            key={idx}
                            dangerouslySetInnerHTML={{
                                __html: `
                            <span class="${styles.bullet}"></span>
                            <span>${description}</span>
                            `,
                            }}
                        />
                    ))}
                </ul>
            </div>
        </section>
    );
}

function VersionCell({item, prefix, ...props}) {
    const flags = item?.flags || [];

    return (
        <div
            {...props}
            title={
                flags.includes('y')
                    ? 'Supported'
                    : flags.includes('n')
                    ? 'Not supported'
                    : flags.includes('u')
                    ? 'Unknown'
                    : flags.includes('a')
                    ? 'Partial support'
                    : null
            }
            className={classes(
                styles.cell,
                ...flags.map((flag) => styles[`flag-${flag}`])
            )}
        >
            <div className={styles.cellDetails}>
                <span className={styles.notes}>
                    {item.notes.map((note) => (
                        <span
                            className={styles.note}
                            title={`See note ${note}`}
                            key={note}
                        >
                            {note}
                        </span>
                    ))}
                </span>
                {item.prefixed && (
                    <span
                        title={`Supported with '-${prefix}-' prefix`}
                        className={styles.prefixed}
                    >
                        -{prefix}-
                    </span>
                )}
                {item.disabled && (
                    <span className={styles.disabled} title="Disabled">
                        &#9873;
                    </span>
                )}
            </div>
            {item?.version || <>&nbsp;</>}
        </div>
    );
}
