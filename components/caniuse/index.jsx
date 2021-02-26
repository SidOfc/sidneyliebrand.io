import {useState} from 'react';
import styles from './caniuse.module.scss';
import Bullet from '@components/bullet';
import {classes, dateFormat} from '@src/util';

export default function Caniuse({data}) {
    const [tab, setTab] = useState('notes');

    return (
        <section className={styles.caniuse} data-embed>
            <div className={styles.header}>
                <span className={styles.title}>{data.title}</span>
                <span className={styles.headerMeta}>
                    <span className={classes(styles.textRow, styles.rowStatus)}>
                        <span className={styles.status}>{data.status}</span>
                        <Bullet />
                        <span
                            className={classes(
                                styles.usage,
                                styles[percentColor(data.usage.y)]
                            )}
                        >
                            %{data.usage.y}
                        </span>
                    </span>
                    <span className={styles.textRow}>
                        <a
                            href={`https://caniuse.com/${data.id}`}
                            rel="noreferrer"
                            target="_blank"
                            title="View on caniuse.com"
                        >
                            caniuse
                        </a>
                    </span>
                    {data.spec && (
                        <span className={styles.textRow}>
                            <a
                                href={data.spec}
                                rel="noreferrer"
                                target="_blank"
                                title="View spec on w3.org"
                            >
                                spec
                            </a>
                        </span>
                    )}
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
                                .map((item, idx) => (
                                    <VersionCell
                                        item={item}
                                        prefix={data.prefixes[id]}
                                        key={idx}
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
                    {data.stats.map(({id, name, versions}) => (
                        <div key={name} className={styles.column}>
                            <VersionCell
                                item={versions.find(({era}) => era === 0)}
                                prefix={data.prefixes[id]}
                                key={name}
                            />
                        </div>
                    ))}
                </div>
                <div className={styles.tableBody}>
                    {data.stats.map(({name, versions}) => (
                        <div key={name} className={styles.column}>
                            {versions
                                .filter(({era}) => era > 0)
                                .map((item, idx) => (
                                    <VersionCell item={item} key={idx} />
                                ))}
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.tabs}>
                {[
                    ['notes', 'notesByNum'],
                    ['resources', 'links'],
                    ['bugs', 'bugs'],
                ].map(
                    ([type, property]) =>
                        (data[property]?.length || 0) > 0 && (
                            <button
                                key={type}
                                type="button"
                                className={classes(styles.tabToggle, {
                                    [styles.tabSelected]: tab === type,
                                })}
                                onClick={() => setTab(type)}
                            >
                                {type}
                            </button>
                        )
                )}
            </div>
            <div className={styles.tabContents}>
                {tab === 'notes' ? (
                    <ul>
                        {data.notesByNum.map(({note, text}) => (
                            <li
                                key={note}
                                dangerouslySetInnerHTML={{
                                    __html: `
                            <span class="${styles.noteNum}">${note}</span>
                            <span>${text}</span>
                            `,
                                }}
                            />
                        ))}
                    </ul>
                ) : tab === 'resources' ? (
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

function VersionCell({item, prefix}) {
    const flags = item?.flags || [];

    return (
        <div
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

function percentColor(percent) {
    if (percent <= 33) {
        return 'color-red';
    } else if (percent <= 80) {
        return 'color-yellow';
    } else if (percent <= 100) {
        return 'color-green';
    }
}
