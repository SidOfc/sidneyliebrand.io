import {useState} from 'react';
import styles from './caniuse.module.scss';
import Bullet from '@components/bullet';
import {classes} from '@src/util';

const TYPES = [
    ['y', 'supported'],
    ['n', 'unsupported'],
    ['a', 'partial'],
    ['x', 'prefixed'],
    ['p', 'polyfill'],
    ['u', 'unknown'],
    ['d', 'disabled'],
];

export default function Caniuse({data}) {
    const [showNotes, setShowNotes] = useState(false);

    return (
        <section className={styles.caniuse} data-embed>
            <div className={styles.header}>
                <span className={styles.headerLeft}>
                    <span className={styles.title}>{data.title}</span>
                    <p
                        className={styles.description}
                        dangerouslySetInnerHTML={{__html: data.description}}
                    />
                </span>
                <span className={styles.headerRight}>
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
            </div>
            <div className={styles.table}>
                {data.stats.map(({id, name, versions}) => (
                    <div key={name} className={styles.column}>
                        <div className={styles.browser} data-name={id}>
                            {name}
                        </div>
                        {versions.map((item, idx) => (
                            <div
                                key={idx}
                                className={classes(
                                    styles.cell,
                                    ...(item?.flags || []).map(
                                        (flag) => styles[`flag-${flag}`]
                                    )
                                )}
                            >
                                {(item?.notes?.length || 0) > 0 && (
                                    <div className={styles.notes}>
                                        {item.notes.map((note) => (
                                            <span key={note}>{note}</span>
                                        ))}
                                    </div>
                                )}
                                {item?.version || <>&nbsp;</>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
            <div className={styles.legendAndNotes}>
                <div className={styles.legend}>
                    {TYPES.map(([type, caption]) => (
                        <div
                            key={type}
                            className={classes(
                                styles.legendItem,
                                styles[`flag-${type}`]
                            )}
                        >
                            {caption}
                        </div>
                    ))}
                </div>
                {data.notesByNum.length > 0 && (
                    <button
                        type="button"
                        className={styles.notesToggle}
                        onClick={() => setShowNotes((prev) => !prev)}
                    >
                        {showNotes ? 'Hide' : 'Show'}{' '}
                        {data.notesByNum.length === 1
                            ? '1 note'
                            : `${data.notesByNum.length} notes`}
                    </button>
                )}
            </div>
            {showNotes && (
                <ul className={styles.notesByNum}>
                    {data.notesByNum.map(({note, text}) => (
                        <li
                            key={note}
                            dangerouslySetInnerHTML={{
                                __html: `
                            <span class="${styles.noteNum}">${note}</span>
                            ${text}
                            `,
                            }}
                        ></li>
                    ))}
                </ul>
            )}
        </section>
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
