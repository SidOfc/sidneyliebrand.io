import {useState, useRef} from 'react';
import styles from './caniuse.module.scss';
import {classes, dateFormat} from '@src/util';
import t from '@src/util/translate';

export default function Caniuse({data}) {
    const [tab, setTab] = useState('notes');
    const [active, setActive] = useState(null);
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
                            %{data.usage.y}
                        </span>
                        {data.usage.a > 0 && (
                            <>
                                <span className={styles.operator}>+</span>
                                <span
                                    title={`%${data.usage.y} partially supported`}
                                    className={styles.yellow}
                                >
                                    %{data.usage.a}
                                </span>
                                <span className={styles.operator}>=</span>
                                <span title={`%${data.usage.y} total`}>
                                    %{data.usage.y + data.usage.a}
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
            <div className={styles.tabs}>
                {['notes', 'links', 'bugs']
                    .filter((type) => data[type]?.length > 0)
                    .map((type) => (
                        <button
                            key={type}
                            type="button"
                            className={classes(styles.tabToggle, {
                                [styles.tabSelected]: tab === type,
                            })}
                            onClick={() => setTab(type)}
                        >
                            {t(`caniuse.tabs.${type}`)}
                        </button>
                    ))}
            </div>
            <div className={styles.tabContents}>
                {tab === 'notes' ? (
                    <>
                        {regularNotes.length > 0 && (
                            <ul>
                                {regularNotes.map(({text}, idx) => (
                                    <li key={idx}>{text}</li>
                                ))}
                            </ul>
                        )}
                        {numberedNotes.length > 0 && (
                            <ul>
                                {numberedNotes.map(({note, text}) => (
                                    <li key={note}>
                                        {note && (
                                            <span className={styles.noteNum}>
                                                {note}
                                            </span>
                                        )}
                                        <span
                                            className={classes({
                                                [styles.activeNote]: active?.notes?.includes(
                                                    note
                                                ),
                                            })}
                                            dangerouslySetInnerHTML={{
                                                __html: text,
                                            }}
                                        />
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                ) : tab === 'links' ? (
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
                ) : tab === 'bugs' ? (
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
                ) : null}
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
