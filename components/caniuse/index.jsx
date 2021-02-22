import styles from './caniuse.module.scss';
import Bullet from '@components/bullet';
import {classes} from '@src/util';

export default function Caniuse({data}) {
    console.log({data});
    return (
        <section className={styles.caniuse}>
            <div className={styles.header}>
                <span className={styles.headerLeft}>
                    <span className={styles.title}>{data.title}</span>
                    <p className={styles.description}>{data.description}</p>
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
                {Object.entries(data.stats).map(([name, versions]) => (
                    <div key={name} className={styles.column}>
                        <div className={styles.browser} data-name={name}>
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
                                {item?.version || <>&nbsp;</>}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
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
