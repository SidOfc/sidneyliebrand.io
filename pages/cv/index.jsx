import styles from './cv.module.scss';
import {Container as Tags} from '../../components/tag';
import Text from '../../components/text';
import Bullet from '../../components/bullet';
import profile from '../../data/profile.json';
import Image from '../../components/image';
import Link from 'next/link';
import {dateFormat, dateDiff, linkProps} from '../../util';
import {getPinnedRepositories} from '../../util/static';

export default function Index({pinnedRepositories}) {
    const {programming, education, volunteering} = profile;

    return (
        <>
            <section className={styles.banner}>
                <div className={styles.bannerLogo}>
                    <Image
                        src="/media/cv-portrait.jpg"
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
                        <Link href="https://github.com/sidofc">
                            <a>
                                <Image
                                    showAlt={false}
                                    src="/media/github.svg"
                                    alt="Sidney Liebrand's GitHub page"
                                    width={16}
                                    height={16}
                                />{' '}
                                /sidofc
                            </a>
                        </Link>
                        <Link href="https://linkedin.com/in/sidneyliebrand">
                            <a>
                                <Image
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
                <h2 className={styles.h2}>Familiar technologies</h2>
                <div className={styles.row}>
                    <strong>Programming languages</strong>
                    <Tags tags={programming.languages} />
                </div>
                <div className={styles.row}>
                    <strong>Tools</strong>
                    <Tags tags={programming.tools} />
                </div>
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>Experience</h2>
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
            </section>
            <section className={styles.column}>
                <h2 className={styles.h2}>Education</h2>
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
                                    <Text color="addition">
                                        {item.stats.additions}++
                                    </Text>
                                    <Bullet wide />
                                    <Text color="deletion">
                                        {item.stats.deletions}--
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

function Title({title, link, as: Component = 'h3', ...props}) {
    return (
        <Component {...props} title={title}>
            {link ? <Link href={link}>{title}</Link> : title}
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
