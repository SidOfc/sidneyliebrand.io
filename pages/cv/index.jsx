import styles from './cv.module.scss';
import Link from 'next/link';
import {Tags} from '@components/tag';
import Text from '@components/text';
import Bullet from '@components/bullet';
import Media from '@components/media';
import Head from '@components/head';
import {getPinnedRepositories, getPageData} from '@src/util/static';
import {dateFormat, dateDiff, linkProps} from '@src/util';
import content from '@data/content';

const {profile} = content;
const {programming, education, volunteering} = profile;

export default function Index({title, description, pinnedRepositories}) {
    return (
        <>
            <Head title={title} description={description} />
            <section className={styles.banner}>
                <div className={styles.bannerLogo}>
                    <Media
                        showAlt={false}
                        src="/media/cv-portrait.jpg"
                        alt="Portrait of Sidney Liebrand"
                        width={140}
                        height={210}
                    />
                </div>
                <div className={styles.column}>
                    <h1 className={styles.bannerHeader}>{profile.name}</h1>
                    <Text color="page-accent" className={styles.bannerSubtitle}>
                        {profile.title}
                    </Text>
                    <div className={styles.bannerDetails}>
                        <Link href="https://github.com/SidOfc">
                            <a title="Visit Sidney Liebrand's GitHub page">
                                <Media
                                    invertDark
                                    showAlt={false}
                                    src="/media/github.svg"
                                    alt="Sidney Liebrand's GitHub page"
                                    width={16}
                                    height={16}
                                />{' '}
                                /SidOfc
                            </a>
                        </Link>
                        <Link href="https://linkedin.com/in/sidneyliebrand">
                            <a title="Visit Sidney Liebrand's LinkedIn page">
                                <Media
                                    invertDark
                                    showAlt={false}
                                    src="/media/linkedin.svg"
                                    alt="Sidney Liebrand's LinkedIn page"
                                    width={16}
                                    height={16}
                                />{' '}
                                /sidneyliebrand
                            </a>
                        </Link>
                    </div>
                </div>
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>
                    <span>Familiar technologies</span>
                </h2>
                <div className={`${styles.row} ${styles.clampedRow}`}>
                    <h3 className={styles.h3}>Programming languages</h3>
                    <Tags tags={programming.languages.sort()} />
                </div>
                <div className={`${styles.row} ${styles.clampedRow}`}>
                    <h3 className={styles.h3}>Tools</h3>
                    <Tags tags={programming.tools.sort()} />
                </div>
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>
                    <span>Experience</span>
                </h2>
                {programming.jobs.map((item) => (
                    <Experience key={item.organisation} item={item} />
                ))}
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>
                    <span>Education</span>
                </h2>
                {education.map((item) => (
                    <Experience key={item.organisation} item={item} />
                ))}
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>
                    <span>Volunteering</span>
                </h2>
                <div className={styles.volunteering}>
                    {volunteering.map((item) => (
                        <div key={item.start} className={styles.volunteer}>
                            <strong className={styles.title}>
                                {item.title} at {item.organisation}
                            </strong>
                            <span>{item.city}</span>
                            <span>
                                {dateFormat(item.start, {
                                    includeDay: true,
                                    fallback: 'Unknown',
                                })}
                                &nbsp;-&nbsp;
                                {dateFormat(item.end, {
                                    includeDay: true,
                                    fallback: 'Present',
                                })}
                            </span>
                            {item.link && (
                                <Link href={item.link}>View event</Link>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>
                    <span>Open source projects</span>
                </h2>
                {pinnedRepositories.map((item) => (
                    <div key={item.name} className={styles.block}>
                        <div className={styles.details}>
                            <h3 className={styles.title}>
                                {item.url ? (
                                    <a {...linkProps(item.url)}>{item.name}</a>
                                ) : (
                                    item.name
                                )}
                            </h3>
                            <span
                                className={styles.subtitle}
                                dangerouslySetInnerHTML={{
                                    __html: item.description,
                                }}
                            />
                            <span className={styles.dates}>
                                {dateFormat(item.createdAt, {
                                    fallback: 'Unknown',
                                })}
                                &nbsp;-&nbsp;Present{' '}
                                <Text color="page-accent">
                                    ({dateDiff(item.createdAt)})
                                </Text>
                            </span>
                            <span className={styles.stats}>
                                <Text
                                    color="addition"
                                    title={`${item.stats.additions} additions`}
                                >
                                    {item.stats.additions}++
                                </Text>
                                <Bullet wide />
                                <Text
                                    color="deletion"
                                    title={`${item.stats.deletions} deletions`}
                                >
                                    {item.stats.deletions}--
                                </Text>
                                <Bullet wide />
                                <Text
                                    color="star"
                                    title={`${item.starCount} GitHub stars`}
                                >
                                    {item.starCount}
                                    <small className={styles.star}>
                                        &#9733;
                                    </small>
                                </Text>
                                <Bullet wide />
                                {item.stats.commits} commits,
                                {item.pushedAt && (
                                    <>
                                        {' '}
                                        last commit on{' '}
                                        {dateFormat(item.pushedAt, true)}
                                    </>
                                )}
                            </span>
                            {item.topics && <Tags tags={item.topics.sort()} />}
                        </div>
                    </div>
                ))}
            </section>
        </>
    );
}

function Experience({item, showLogo = item.logo}) {
    const organisation = item.link ? (
        <a {...linkProps(item.link)}>{item.organisation}</a>
    ) : (
        item.organisation
    );

    return (
        <div className={styles.experienceBlock}>
            <div className={styles.experienceLogo}>
                {showLogo && (
                    <Media
                        className={styles.experienceLogoImage}
                        src={`/media/${item.logo.url}`}
                        width={item.logo.width}
                        height={item.logo.height}
                    />
                )}
            </div>
            <h3 className={styles.experienceTitle}>
                {item.title} at {organisation}
            </h3>
            <span className={styles.experienceTimespan}>
                {dateFormat(item.start, {fallback: 'Unknown'})}
                &nbsp;-&nbsp;
                {dateFormat(item.end, {fallback: 'Present'})}{' '}
                <Text color="page-accent">
                    ({dateDiff(item.start, item.end)})
                </Text>
            </span>
            <div className={styles.experienceTags}>
                {item.tags.length > 0 && <Tags tags={item.tags.sort()} />}
            </div>
            <p
                className={styles.experienceExcerpt}
                dangerouslySetInnerHTML={{__html: item.description}}
            />
        </div>
    );
}

export async function getStaticProps() {
    const {title, description} = getPageData('/cv');
    const pinnedRepositories = await getPinnedRepositories();

    pinnedRepositories.sort((a, b) =>
        Math.min(1, Math.max(-1, b.starCount - a.starCount))
    );

    return {
        props: {title, description, pinnedRepositories},
    };
}
