import {useState, useCallback} from 'react';
import styles from './wow-raid-roster.module.scss';
import Head from '@components/head';
import Dropdown from '@components/dropdown';
import Popup from '@components/popup';
import Media from '@components/media';
import Button from '@components/button';
import {pauseEscape, resumeEscape} from '@hooks/use-escape';
import {getPageData} from '@src/util/static';
import {classes, handleKeys} from '@src/util';

function iconUrl(...args) {
    const urlItems = args.map((arg) => arg.toLowerCase().replace(' ', '-'));

    return `/media/wow-raid-roster/${urlItems.join('-')}.jpg`;
}

export default function Index({title, description, classData}) {
    const [size, setSize] = useState(10);
    const [editingIndex, setEditingIndex] = useState(null);
    const [data, setData] = useState({});
    const [name, setName] = useState('');
    const [role, setRole] = useState(0);
    const classId = (role & 0xf0) >> 4;
    const specId = role & 0x0f;
    const cls = classData.find(({id}) => id === classId);
    const spec = cls?.specs?.find(({id}) => id === specId);
    const edit = useCallback((index) => {
        const {role, name} = data[index] || {name: '', role: 0};

        setEditingIndex(index);
        setName(name);
        setRole(role);
    }, [data]);
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
        setData((prev) => ({...prev, [editingIndex]: {role, name}}))
        close();
    }, [role, name, editingIndex, close]);

    const getData = (group, row) => {
        const index = group * 5 + row;
        const {role, name} = data[index] || {name: '', role: 0};
        const classId = (role & 0xf0) >> 4;
        const specId = role & 0x0f;
        const cls = classData.find(({id}) => id === classId);
        const spec = cls?.specs?.find(({id}) => id === specId);

        return {
            index,
            name,
            cls: cls?.name || '',
            spec: spec?.name || '',
            icon: cls && spec && iconUrl(cls.name, spec.name)
        };
    };

    return (
        <>
            {Number.isInteger(editingIndex) && (
                <Popup onClose={close}>
                    <div className={styles.editForm}>
                        {cls ? (
                            <div className={styles.roles}>
                                <Media
                                    key={cls.name}
                                    width={40}
                                    height={40}
                                    alt={cls.name}
                                    showAlt={false}
                                    src={iconUrl(cls.name)}
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
                                        src={iconUrl(cls.name, spec.name)}
                                        className={classes(
                                            styles.role,
                                            cls.name,
                                            {selected: specId === spec.id}
                                        )}
                                        onClick={() => updateSpec(spec.id)}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className={styles.roles}>
                                {classData.map((cls) => (
                                    <Media
                                        key={cls.name}
                                        width={40}
                                        height={40}
                                        alt={cls.name}
                                        showAlt={false}
                                        src={iconUrl(cls.name)}
                                        className={styles.role}
                                        onClick={() => updateClass(cls.id)}
                                    />
                                ))}
                            </div>
                        )}
                        <input
                            className={classes(
                                styles.nameInput,
                                styles.[`${(cls?.name)}Color`]
                            )}
                            type="text"
                            value={name}
                            placeholder="Name"
                            onFocus={pauseEscape}
                            onBlur={resumeEscape}
                            onChange={(e) => setName(e.target.value)}
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
                    onChange={setSize}
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
                                        .map(({index, name, cls, spec}) => (
                                        <li
                                            key={index}
                                            className={styles[cls]}
                                            onClick={() => edit(index)}
                                        >
                                            {cls && spec && <Media
                                                width={40}
                                                height={40}
                                                alt={`${spec} ${cls}`}
                                                showAlt={false}
                                                src={iconUrl(cls, spec)}
                                                className={styles.roleIcon}
                                            />}
                                            {name}
                                        </li>
                                    ))}
                            </ol>
                        </div>
                    ))}
            </section>
        </>
    );
}

const classData = [
    {
        id: 1,
        name: 'Druid',
        color: '#ff7c0a',
        specs: [
            {id: 1, name: 'Balance'},
            {id: 2, name: 'Feral Combat'},
            {id: 3, name: 'Restoration'},
        ],
    },
    {
        id: 2,
        name: 'Hunter',
        color: '#aad372',
        specs: [
            {id: 1, name: 'Beast Mastery'},
            {id: 2, name: 'Marksmanship'},
            {id: 3, name: 'Survival'},
        ],
    },
    {
        id: 3,
        name: 'Mage',
        color: '#68ccef',
        specs: [
            {id: 1, name: 'Arcane'},
            {id: 2, name: 'Fire'},
            {id: 3, name: 'Frost'},
        ],
    },
    {
        id: 4,
        name: 'Paladin',
        color: '#f48cba',
        specs: [
            {id: 1, name: 'Holy'},
            {id: 2, name: 'Protection'},
            {id: 3, name: 'Retribution'},
        ],
    },
    {
        id: 5,
        name: 'Priest',
        color: '#ffffff',
        specs: [
            {id: 1, name: 'Discipline'},
            {id: 2, name: 'Holy'},
            {id: 3, name: 'Shadow'},
        ],
    },
    {
        id: 6,
        name: 'Rogue',
        color: '#fff468',
        specs: [
            {id: 1, name: 'Assassination'},
            {id: 2, name: 'Combat'},
            {id: 3, name: 'Subtlety'},
        ],
    },
    {
        id: 7,
        name: 'Shaman',
        color: '#2359ff',
        specs: [
            {id: 1, name: 'Elemental'},
            {id: 2, name: 'Enhancement'},
            {id: 3, name: 'Restoration'},
        ],
    },
    {
        id: 8,
        name: 'Warlock',
        color: '#9382c9',
        specs: [
            {id: 1, name: 'Affliction'},
            {id: 2, name: 'Demonology'},
            {id: 3, name: 'Destruction'},
        ],
    },
    {
        id: 9,
        name: 'Warrior',
        color: '#c69b6d',
        specs: [
            {id: 1, name: 'Arms'},
            {id: 2, name: 'Fury'},
            {id: 3, name: 'Protection'},
        ],
    },
];

export async function getStaticProps() {
    const {title, description} = getPageData('/wow-raid-roster');

    return {
        props: {title, description, classData},
    };
}
