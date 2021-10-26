import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/router';
import styles from './wow-raid-roster.module.scss';
import Head from '@components/head';
import Dropdown from '@components/dropdown';
import Popup from '@components/popup';
import Media from '@components/media';
import Button from '@components/button';
import {pauseEscape, resumeEscape} from '@hooks/use-escape';
import {getPageData} from '@src/util/static';
import {classes, handleKeys} from '@src/util';
import wowClasses from '@data/wow-classes.json';

export default function Index({title, description}) {
    const router = useRouter();
    const [size, setSize] = useState(10);
    const [editingIndex, setEditingIndex] = useState(null);
    const [data, setData] = useState({});
    const [name, setName] = useState('');
    const [role, setRole] = useState(0);
    const classId = (role & 0xf0) >> 4;
    const specId = role & 0x0f;
    const cls = wowClasses.find(({id}) => id === classId);
    const spec = cls?.specs?.find(({id}) => id === specId);
    const edit = useCallback(
        (index) => {
            const {name, role} = data[index] || {name: '', role: 0};

            setEditingIndex(index);
            setName(name);
            setRole(role);
        },
        [data]
    );
    const close = useCallback(() => {
        setEditingIndex(null);
        setName('');
        setRole(0);
    }, []);
    const updateClass = useCallback((classId) => setRole(classId << 4), []);
    const updateSpec = useCallback(
        (specId) => setRole((classId << 4) | specId),
        [classId]
    );
    const save = useCallback(() => {
        const nextData = {...data, [editingIndex]: {name, role}};
        router.push(`#${encode(size, nextData)}`);
        setData(nextData);
        close();
    }, [role, name, editingIndex, close, router, size, data]);
    const updateSize = useCallback(
        (size) => {
            setSize(size);
            router.push(`#${encode(size, data)}`);
        },
        [data, router]
    );
    const getData = (group, row) => {
        const index = group * 5 + row;
        const {name, role} = data[index] || {name: '', role: 0};
        const classId = (role & 0xf0) >> 4;
        const specId = role & 0x0f;
        const cls = wowClasses.find(({id}) => id === classId);
        const spec = cls?.specs?.find(({id}) => id === specId);

        return {
            index,
            name,
            cls: cls?.name,
            spec: spec?.name,
            icon: spec?.icon,
        };
    };

    useEffect(() => {
        const handler = () => {
            if (!location.hash) return;

            const {size, data} = decode(location.hash.slice(1));

            setSize(size ?? 10);
            setData(data ?? {});
        };

        handler();
        window.addEventListener('popstate', handler);

        return () => window.removeEventListener('popstate', handler);
    }, []);

    return (
        <>
            {Number.isInteger(editingIndex) && (
                <Popup>
                    <div className={styles.editForm}>
                        {cls ? (
                            <div className={styles.roles}>
                                <Media
                                    key={cls.name}
                                    width={40}
                                    height={40}
                                    alt={cls.name}
                                    showAlt={false}
                                    src={cls.icon}
                                    className={classes(
                                        styles.role,
                                        cls.name,
                                        'selected'
                                    )}
                                    onClick={() => updateClass(0)}
                                />

                                {cls.specs.map((spec) => (
                                    <Media
                                        key={spec.name}
                                        width={40}
                                        height={40}
                                        alt={`${spec.name} ${cls.name}`}
                                        showAlt={false}
                                        src={spec.icon}
                                        className={classes(
                                            styles.role,
                                            cls.name,
                                            {selected: specId === spec.id}
                                        )}
                                        onClick={() =>
                                            updateSpec(
                                                specId === spec.id
                                                    ? null
                                                    : spec.id
                                            )
                                        }
                                    />
                                ))}
                                <div
                                    className={classes(
                                        styles.selectedClass,
                                        styles[`${cls?.name}Color`]
                                    )}
                                >
                                    {spec?.name} {cls.name}
                                </div>
                            </div>
                        ) : (
                            <div className={styles.roles}>
                                {wowClasses.map((cls) => (
                                    <Media
                                        key={cls.name}
                                        width={40}
                                        height={40}
                                        alt={cls.name}
                                        showAlt={false}
                                        src={cls.icon}
                                        className={styles.role}
                                        onClick={() => updateClass(cls.id)}
                                    />
                                ))}
                            </div>
                        )}
                        <input
                            className={classes(
                                styles.nameInput,
                                styles[`${cls?.name}Color`]
                            )}
                            type="text"
                            value={name}
                            placeholder="Name"
                            onFocus={pauseEscape}
                            onBlur={resumeEscape}
                            onChange={(e) =>
                                setName(
                                    e.target.value
                                        .replace(/\W/gi, '')
                                        .replace(/[\d_]/gi, '')
                                        .slice(0, 15)
                                )
                            }
                            onKeyDown={handleKeys('enter', save)}
                        />
                        <div className={styles.buttons}>
                            <Button
                                className={styles.cancelBtn}
                                onClick={close}
                            >
                                Cancel
                            </Button>
                            <Button
                                disabled={!classId || !specId || !name}
                                className={styles.saveBtn}
                                onClick={save}
                            >
                                Save
                            </Button>
                        </div>
                    </div>
                </Popup>
            )}
            <Head title={title} description={description} />
            <section className={styles.raidSize}>
                <Dropdown
                    items={[10, 25, 40]}
                    value={size}
                    onChange={updateSize}
                    asCaption={(size) => `${size} man`}
                />
            </section>
            <section className={styles.groups}>
                {Array(size / 5)
                    .fill()
                    .map((_, idx) => (
                        <div key={idx} className={styles.group}>
                            <div className={styles.groupTitle}>
                                Group {idx + 1}
                            </div>
                            <ol>
                                {Array(5)
                                    .fill(idx)
                                    .map(getData)
                                    .map(({index, name, cls, icon}) => (
                                        <li
                                            key={index}
                                            className={styles[cls]}
                                            onClick={() => edit(index)}
                                        >
                                            {icon && (
                                                <Media
                                                    width={40}
                                                    height={40}
                                                    alt={`${spec} ${cls}`}
                                                    showAlt={false}
                                                    src={icon}
                                                    className={styles.roleIcon}
                                                />
                                            )}
                                            <span className={styles.trunc}>
                                                <span>{name}</span>
                                            </span>
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    ))}
            </section>
        </>
    );
}

export async function getStaticProps() {
    const {title, description} = getPageData('/wow-raid-roster');

    return {
        props: {title, description},
    };
}

function encode(size, data) {
    const items = Object.entries(data)
        .map(([key, {name, role}]) => name && role && `${key}${name}${role}`)
        .filter(Boolean);

    return `${size}.${items.join('.')}`;
}

function decode(input) {
    const [size, ...items] = input.split('.');

    return {
        size: parseInt(size),
        data: items.reduce((items, item) => {
            const [key, name, role] = item.match(/(\d+)(\D+)(\d+)/).slice(1);
            items[key] = {name, role: parseInt(role)};

            return items;
        }, {}),
    };
}
