import styles from './cv.module.scss';
import {Container as Tags} from '../../components/tag';
import Text from '../../components/text';
import Bullet from '../../components/bullet';
import profile from '../../data/profile.json';
import Image from 'next/image';
import Link from 'next/link';
import {dateFormat, dateDiff} from '../../util';
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
                    <Text as="h1" className={styles.bannerHeader}>
                        {profile.name}
                    </Text>
                    <Text color="page-accent" className={styles.bannerSubtitle}>
                        {profile.title}
                    </Text>
                    <div className={styles.bannerDetails}>
                        <Text>
                            {profile.city}, {profile.country}
                        </Text>
                        <Text
                            href="https://github.com/sidofc"
                            title="Sidney Liebrand's GitHub page"
                        >
                            <Image
                                src="/media/github.svg"
                                width={16}
                                height={16}
                            />{' '}
                            /sidofc
                        </Text>
                        <Text
                            href="https://linkedin.com/in/sidneyliebrand"
                            title="Sidney Liebrand's LinkedIn page"
                        >
                            <Image
                                src="/media/linkedin.svg"
                                width={16}
                                height={16}
                            />{' '}
                            /sidneyliebrand
                        </Text>
                    </div>
                </div>
            </section>
            <section className={styles.column}>
                <Text as="h2" className={styles.h2}>
                    Familiar technologies
                </Text>
                <div className={styles.row}>
                    <Text as="strong">Languages</Text>
                    <Tags tags={programming.languages} />
                </div>
                <div className={styles.row}>
                    <Text as="strong">Tools</Text>
                    <Tags tags={programming.tools} />
                </div>
            </section>
            <section className={styles.column}>
                <Text as="h2" className={styles.h2}>
                    Experience
                </Text>
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
                <Text as="h2" className={styles.h2}>
                    Education
                </Text>
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
                <Text as="h2" className={styles.h2}>
                    Volunteering
                </Text>
                <div className={styles.volunteering}>
                    {volunteering.map((item) => (
                        <div key={item.start} className={styles.volunteer}>
                            <Text as="strong" className={styles.title}>
                                {item.title} at {item.organisation}
                            </Text>
                            <Text>
                                {item.city}
                                <br />
                                {dateFormat(item.start, {
                                    day: true,
                                    fallback: 'Unknown',
                                })}
                                &nbsp;-&nbsp;
                                {dateFormat(item.end, {
                                    day: true,
                                    fallback: 'Present',
                                })}
                            </Text>
                            {item.link && (
                                <Text href={item.link}>View event</Text>
                            )}
                        </div>
                    ))}
                </div>
            </section>
            <section className={styles.column}>
                <Text as="h2" className={styles.h2}>
                    Open source projects
                </Text>
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
                                    <Text>
                                        {item.stats.commits} commits,
                                        {item.pushedAt && (
                                            <>
                                                {' '}
                                                last commit on{' '}
                                                {dateFormat(
                                                    item.pushedAt,
                                                    true
                                                )}
                                            </>
                                        )}
                                    </Text>
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
            <Text as="h3" href={link} className={styles.title}>
                {title}
            </Text>
            {subtitle && (
                <Text
                    className={styles.subtitle}
                    dangerouslySetInnerHTML={{__html: subtitle}}
                />
            )}
            <Text className={styles.dates}>
                {dateFormat(start, {fallback: 'Unknown'})}
                &nbsp;-&nbsp;
                {dateFormat(end, {fallback: 'Present'})}{' '}
                <Text color="page-accent">({dateDiff(start, end)})</Text>
            </Text>
            {customData}
            {tags && <Tags tags={tags} />}
            {description && (
                <Text as="p" dangerouslySetInnerHTML={{__html: description}} />
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
