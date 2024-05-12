import {useState, useEffect, useCallback} from 'react';
import {useRouter} from 'next/router';
import styles from './wow-raid-roster.module.scss';
import Head from '@components/head';
import Dropdown from '@components/dropdown';
import Input from '@components/input';
import Popup from '@components/popup';
import Media from '@components/media';
import Button from '@components/button';
import {pauseEscape, resumeEscape} from '@hooks/use-escape';
import {getPageData} from '@src/util/static';
import {classes} from '@src/util';
import wowClasses from '@data/wow-classes.json';

export default function Index({title, description}) {
    const router = useRouter();
    const [model, setModel] = useState({name: '', size: 10, items: {}});
    const [teams, setTeams] = useState([]);
    const updateModel = useCallback(
        (next) => setModel((current) => ({...current, ...next})),
        [],
    );

    const addTeam = useCallback(() => {
        if (!model.name.trim()) return;

        const next = [...teams, {...model, name: model.name.trim()}];

        setTeams(next);
        setModel((current) => ({...current, name: '', items: {}}));

        router.push(`#${encode(next)}`);
    }, [router, model, teams]);

    const updateTeam = useCallback(
        (teamIndex, payload) => {
            const next = [...teams];
            next[teamIndex] = {
                ...next[teamIndex],
                items: {...next[teamIndex].items, ...payload},
            };

            setTeams(next);

            router.push(`#${encode(next)}`);
        },
        [router, teams],
    );

    const deleteTeam = useCallback(
        (teamIndex) => {
            const next = [...teams];
            next.splice(teamIndex, 1);

            setTeams(next);

            if (next.length === 0) {
                router.push('');
            } else {
                router.push(`#${encode(next)}`);
            }
        },
        [router, teams],
    );

    useEffect(() => {
        const handler = () => {
            if (!location.hash) return;

            setTeams(decode(location.hash.slice(1)));
        };

        handler();
        window.addEventListener('popstate', handler);

        return () => window.removeEventListener('popstate', handler);
    }, []);

    return (
        <>
            <Head title={title} description={description} />
            {teams.map((team, teamIndex) => (
                <Team
                    key={teamIndex}
                    data={team}
                    onUpdate={(payload) => updateTeam(teamIndex, payload)}
                    onDelete={() => deleteTeam(teamIndex)}
                />
            ))}
            <section className={styles.teamForm}>
                <div className={styles.field}>
                    <Dropdown
                        items={[10, 25, 40]}
                        value={model.size}
                        className={styles.fieldInput}
                        onChange={(size) => updateModel({size})}
                        asCaption={(size) => `${size} man`}
                    />
                </div>
                <div className={styles.field}>
                    <Input
                        placeholder="Team name"
                        value={model.name}
                        className={styles.fieldInput}
                        onChange={(name) =>
                            updateModel({
                                name: name
                                    .replace(/[^a-z \d]/gi, '')
                                    .trimStart(),
                            })
                        }
                        onEnter={addTeam}
                    />
                </div>
                <div className={classes(styles.field, styles.fieldButton)}>
                    <Button
                        disabled={!model.name}
                        className={styles.saveBtn}
                        onClick={addTeam}
                    >
                        Add
                    </Button>
                </div>
            </section>
        </>
    );
}

function Team({data, onUpdate, onDelete}) {
    const [editingIndex, setEditingIndex] = useState(null);
    const {name, role} = data.items[editingIndex] || {name: '', role: 0};
    const groupCount = data.size / 5;
    // const classId = (role & 0xf0) >> 4;
    // const specId = role & 0x0f;
    // const cls = wowClasses.find(({id}) => id === classId);
    // const spec = cls?.specs?.find(({id}) => id === specId);
    const close = useCallback(() => setEditingIndex(null), []);
    const save = useCallback(
        (current) => {
            onUpdate({[editingIndex]: current});
            close();
        },
        [onUpdate, editingIndex, close],
    );

    const getData = (group, row) => {
        const index = group * 5 + row;
        const {name, role} = data.items[index] || {name: '', role: 0};
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

    function times(amount, callback) {
        return Array(amount)
            .fill()
            .map((_, ...args) => callback(...args));
    }

    return (
        <section className={styles.team}>
            <div className={styles.teamTitle}>
                <span>{data.name}</span>
                <Button className={styles.cancelBtn} onClick={onDelete}>
                    Delete
                </Button>
            </div>
            {times(groupCount, (group) => (
                <ol key={group} className={styles.group}>
                    <li className={styles.groupTitle}>Group {group + 1}</li>
                    {Array(5)
                        .fill()
                        .map((_, row) => {
                            const item = getData(group, row);

                            return (
                                <li
                                    key={item.index}
                                    className={styles[item.cls]}
                                    onClick={() => setEditingIndex(item.index)}
                                >
                                    {item.icon && (
                                        <Media
                                            width={40}
                                            height={40}
                                            alt={`${item.spec} ${item.cls}`}
                                            showAlt={false}
                                            src={item.icon}
                                            className={styles.roleIcon}
                                        />
                                    )}
                                    <span className={styles.trunc}>
                                        <span>{item.name}</span>
                                    </span>
                                </li>
                            );
                        })}
                </ol>
            ))}
            <div className={styles.bench}>
                {times(2, (group) => (
                    <ol key={groupCount + group} className={styles.group}>
                        {group === 0 && (
                            <li className={styles.groupTitle}>Bench</li>
                        )}
                        {Array(5)
                            .fill()
                            .map((_, row) => {
                                const item = getData(groupCount + group, row);

                                return (
                                    <li
                                        key={item.index}
                                        className={styles[item.cls]}
                                        onClick={() =>
                                            setEditingIndex(item.index)
                                        }
                                    >
                                        {item.icon && (
                                            <Media
                                                width={40}
                                                height={40}
                                                alt={`${item.spec} ${item.cls}`}
                                                showAlt={false}
                                                src={item.icon}
                                                className={styles.roleIcon}
                                            />
                                        )}
                                        <span className={styles.trunc}>
                                            <span>{item.name}</span>
                                        </span>
                                    </li>
                                );
                            })}
                    </ol>
                ))}
            </div>
            {Number.isInteger(editingIndex) && (
                <Form data={{name, role}} onSubmit={save} onCancel={close} />
            )}
        </section>
    );
}

function Icon({cls, spec, className, onClick}) {
    return !cls ? null : (
        <Media
            key={cls.name}
            width={40}
            height={40}
            alt={spec ? `${cls.name} ${spec.name}` : cls.name}
            showAlt={false}
            src={spec?.icon || cls.icon}
            className={classes(className, styles.role, cls.name)}
            onClick={onClick}
        />
    );
}
function Form({data, onSubmit, onCancel}) {
    const [name, setName] = useState(data.name || '');
    const [role, setRole] = useState(data.role || 0);
    const classId = (role & 0xf0) >> 4;
    const specId = role & 0x0f;
    const cls = wowClasses.find(({id}) => id === classId);
    const spec = cls?.specs?.find(({id}) => id === specId);
    const updateClass = useCallback((classId) => setRole(classId << 4), []);
    const updateSpec = useCallback(
        (specId) => setRole((classId << 4) | specId),
        [classId],
    );
    const onSubmitHandler = useCallback(
        () => onSubmit?.({name, role}),
        [name, role, onSubmit],
    );

    return (
        <Popup>
            <div className={styles.editForm}>
                {cls ? (
                    <div className={styles.roles}>
                        <Icon
                            cls={cls}
                            className="selected"
                            onClick={() => updateClass(0)}
                        />

                        {cls.specs.map((spec) => (
                            <Icon
                                key={spec.id}
                                cls={cls}
                                spec={spec}
                                className={specId === spec.id && 'selected'}
                                onClick={() =>
                                    updateSpec(
                                        specId === spec.id ? null : spec.id,
                                    )
                                }
                            />
                        ))}
                        <div
                            className={classes(
                                styles.selectedClass,
                                styles[`${cls?.name}Color`],
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
                <Input
                    className={classes(
                        styles.nameInput,
                        styles[`${cls?.name}Color`],
                    )}
                    value={name}
                    placeholder="Name"
                    onFocus={pauseEscape}
                    onBlur={resumeEscape}
                    onChange={(name) =>
                        setName(name.replace(/[^a-z]/gi, '').slice(0, 15))
                    }
                    onEnter={onSubmitHandler}
                />
                <div className={styles.buttons}>
                    <Button className={styles.cancelBtn} onClick={onCancel}>
                        Cancel
                    </Button>
                    {onSubmit && (
                        <Button
                            disabled={!classId || !specId || !name}
                            className={styles.saveBtn}
                            onClick={onSubmitHandler}
                        >
                            Save
                        </Button>
                    )}
                </div>
            </div>
        </Popup>
    );
}

export async function getStaticProps() {
    const {title, description} = getPageData('/wow-raid-roster');

    return {
        props: {title, description},
    };
}

function encode(teams) {
    return teams
        .map((team) => {
            const items = Object.entries(team.items)
                .map(
                    ([key, {name, role}]) =>
                        name && role && `${key}${name}${role}`,
                )
                .filter(Boolean);

            return `${team.size}${team.name}${
                items.length ? '.' : ''
            }${items.join('.')}`;
        })
        .join('_');
}

function decode(input) {
    return input.split('_').reduce((teams, teamStr, idx) => {
        const [header, ...itemStrs] = teamStr.split('.');
        const [size, name] = header.match(/^(\d+)([a-z \d]+)?/).slice(1);

        teams.push({
            size: parseInt(size),
            name: name || `Team ${idx + 1}`,
            items: itemStrs.reduce((items, itemStr) => {
                const [key, name, role] = itemStr
                    .match(/^(\d+)(\D+)(\d+)$/)
                    .slice(1);
                items[key] = {name, role: parseInt(role)};

                return items;
            }, {}),
        });

        return teams;
    }, []);
}
