import styles from './cv.module.scss';
import {Container as Tags} from '../../components/tag';
import profile from '../../data/profile.json';
import Image from 'next/image';
import Link from 'next/link';
import {dateFormat, dateDiff} from '../../util';
import {getPinnedRepositories} from '../../util/static';

export default function Index({pinnedRepositories}) {
    const {programming, education, volunteering} = profile;

    return (
        <>
            <div className={styles.banner}>
                <div className={styles.bannerLogo}>
                    <Image
                        src="/media/cv-portrait.jpg"
                        width={140}
                        height={210}
                    />
                </div>
                <div className={styles.column}>
                    <h1 className={styles.bannerHeader}>{profile.name}</h1>
                    <span className={styles.bannerSubtitle}>
                        {profile.title}
                    </span>
                    <span className={styles.bannerDetails}>
                        <span>
                            {profile.city}, {profile.country}
                        </span>
                        <Link href="https://github.com/sidofc">
                            <a title="Sidney Liebrand's GitHub page">
                                <Image
                                    src="/media/github.svg"
                                    width={16}
                                    height={16}
                                />{' '}
                                /sidofc
                            </a>
                        </Link>
                        <Link href="https://linkedin.com/in/sidneyliebrand">
                            <a title="Sidney Liebrand's LinkedIn page">
                                <Image
                                    src="/media/linkedin.svg"
                                    width={16}
                                    height={16}
                                />{' '}
                                /sidneyliebrand
                            </a>
                        </Link>
                    </span>
                </div>
            </div>
            <h2 className={styles.h2}>Familiar technologies</h2>
            <div className={styles.column}>
                <div className={styles.row}>
                    <strong>Languages</strong>
                    <Tags tags={programming.languages} />
                </div>
                <div className={styles.row}>
                    <strong>Tools</strong>
                    <Tags tags={programming.tools} />
                </div>
            </div>
            <h2 className={styles.h2}>Experience</h2>
            <div className={styles.column}>
                {programming.jobs.map((item) => (
                    <div key={item.organisation} className={styles.block}>
                        <div className={styles.logo}>
                            <Image
                                src={`/media/${item.logo.url}`}
                                width={item.logo.width}
                                height={item.logo.height}
                            />
                        </div>
                        <Details
                            {...item}
                            title={`${item.title} at ${item.organisation}`}
                        />
                    </div>
                ))}
            </div>
            <h2 className={styles.h2}>Education</h2>
            <div className={styles.column}>
                {education.map((item) => (
                    <div key={item.organisation} className={styles.block}>
                        <div className={styles.logo}>
                            <Image
                                src={`/media/${item.logo.url}`}
                                width={item.logo.width}
                                height={item.logo.height}
                            />
                        </div>
                        <Details
                            {...item}
                            title={`${item.title} at ${item.organisation}`}
                        />
                    </div>
                ))}
            </div>
            <h2 className={styles.h2}>Volunteering</h2>
            <div className={styles.volunteering}>
                {volunteering.map((item) => (
                    <div key={item.start} className={styles.volunteer}>
                        <Title
                            as="strong"
                            title={`${item.title} at ${item.organisation}`}
                            className={styles.title}
                        />
                        <span>{item.city}</span>
                        <span>
                            {item.start
                                ? dateFormat(item.start, true)
                                : 'Unknown'}{' '}
                            -{' '}
                            {item.end ? dateFormat(item.end, true) : 'Present'}
                        </span>
                        {item.link && (
                            <a
                                href={item.link}
                                target="_blank"
                                rel="noopener,noreferrer"
                            >
                                View event
                            </a>
                        )}
                    </div>
                ))}
            </div>
            <h2 className={styles.h2}>Open source projects</h2>
            {pinnedRepositories.map((item) => (
                <div key={item.name} className={styles.block}>
                    <Details
                        link={item.url}
                        title={item.name}
                        tags={item.topics}
                        start={item.createdAt}
                        subtitle={item.description}
                        customData={
                            <span className={styles.stats}>
                                <span className={styles.additions}>
                                    {item.stats.additions}++
                                </span>
                                <span className={styles.bullet}>&bull;</span>
                                <span className={styles.deletions}>
                                    {item.stats.deletions}--
                                </span>
                                <span className={styles.bullet}>&bull;</span>
                                <span className={styles.light}>
                                    {item.stats.commits} commits,
                                    {item.pushedAt && (
                                        <>
                                            {' '}
                                            last commit on{' '}
                                            {dateFormat(item.pushedAt, true)}
                                        </>
                                    )}
                                </span>
                            </span>
                        }
                    />
                </div>
            ))}
        </>
    );
}

function Title({title, link, as: Component = 'h3', ...props}) {
    return (
        <Component {...props} title={title}>
            {link ? (
                <a href={link} target="_blank" rel="noopener,noreferrer">
                    {title}
                </a>
            ) : (
                title
            )}
        </Component>
    );
}

function Details({
    link,
    title,
    subtitle,
    tags,
    description,
    start,
    end,
    customData,
    showDuration = true,
}) {
    return (
        <div className={styles.details}>
            <Title title={title} link={link} className={styles.title} />
            {subtitle && (
                <span
                    className={styles.subtitle}
                    dangerouslySetInnerHTML={{__html: subtitle}}
                />
            )}
            <span className={styles.dates}>
                {start ? dateFormat(start) : 'Unknown'} -{' '}
                {end ? dateFormat(end) : 'Present'}{' '}
                <span className={styles.light}>({dateDiff(start, end)})</span>
            </span>
            {customData}
            {tags && <Tags tags={tags} />}
            {description && (
                <p dangerouslySetInnerHTML={{__html: description}} />
            )}
        </div>
    );
}

export async function getStaticProps() {
    const pinnedRepositories = await getPinnedRepositories();

    return {
        props: {pinnedRepositories},
    };
}
