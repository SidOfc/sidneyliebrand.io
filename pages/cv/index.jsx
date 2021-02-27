import styles from './cv.module.scss';
import Link from 'next/link';
import {Container as Tags} from '@components/tag';
import Text from '@components/text';
import Bullet from '@components/bullet';
import Media from '@components/media';
import Head from '@components/head';
import {getPinnedRepositories, getPageData} from '@src/util/static';
import {dateFormat, dateDiff, linkProps, mediaUrl} from '@src/util';
import {profile} from '@data/content.json';

export default function Index({title, description, pinnedRepositories}) {
    const {programming, education, volunteering} = profile;

    return (
        <>
            <Head title={title} description={description} />
            <section className={styles.banner}>
                <div className={styles.bannerLogo}>
                    <Media
                        showAlt={false}
                        src={mediaUrl('cv-portrait.jpg')}
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
                        <span>{`${profile.city}, ${profile.country}`}</span>
                        <Link href="https://github.com/SidOfc">
                            <a title="Visit Sidney Liebrand's GitHub page">
                                <Media
                                    invertDark
                                    showAlt={false}
                                    src={mediaUrl('github.svg')}
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
                                    src={mediaUrl('linkedin.svg')}
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
                <h2 className={styles.h2}>Familiar technologies</h2>
                <div className={styles.row}>
                    <strong>Programming languages</strong>
                    <Tags tags={programming.languages.sort()} />
                </div>
                <div className={styles.row}>
                    <strong>Tools</strong>
                    <Tags tags={programming.tools.sort()} />
                </div>
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>Experience</h2>
                {programming.jobs.map((item) => (
                    <div key={item.organisation} className={styles.block}>
                        <div className={styles.logo}>
                            <Media
                                src={mediaUrl(item.logo.url)}
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
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>Education</h2>
                {education.map((item) => (
                    <div key={item.organisation} className={styles.block}>
                        <div className={styles.logo}>
                            <Media
                                src={mediaUrl(item.logo.url)}
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
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>Volunteering</h2>
                <div className={styles.volunteering}>
                    {volunteering.map((item) => (
                        <div key={item.start} className={styles.volunteer}>
                            <strong className={styles.title}>
                                {item.title} at {item.organisation}
                            </strong>
                            <span>{item.city}</span>
                            <span>
                                {dateFormat(item.start, {
                                    day: true,
                                    fallback: 'Unknown',
                                })}
                                &nbsp;-&nbsp;
                                {dateFormat(item.end, {
                                    day: true,
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
                                        {item.starCount}&#9733;
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
                            }
                        />
                    </div>
                ))}
            </section>
        </>
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
}) {
    return (
        <div className={styles.details}>
            <h3 className={styles.title}>
                {link ? <a {...linkProps(link)}>{title}</a> : title}
            </h3>
            {subtitle && (
                <span
                    className={styles.subtitle}
                    dangerouslySetInnerHTML={{__html: subtitle}}
                />
            )}
            <span className={styles.dates}>
                {dateFormat(start, {fallback: 'Unknown'})}
                &nbsp;-&nbsp;
                {dateFormat(end, {fallback: 'Present'})}{' '}
                <Text color="page-accent">({dateDiff(start, end)})</Text>
            </span>
            {customData}
            {tags && <Tags tags={tags.sort()} />}
            {description && (
                <p dangerouslySetInnerHTML={{__html: description}} />
            )}
        </div>
    );
}

export async function getStaticProps() {
    const {title, description} = getPageData('/cv');
    const pinnedRepositories = await getPinnedRepositories();

    return {
        props: {title, description, pinnedRepositories},
    };
}
