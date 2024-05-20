import styles from './page.module.scss';
import Link from 'next/link';
import Bullet from '@components/bullet';
import Button from '@components/button';
import Banner from '@components/banner';
import Text from '@components/text';
import {processMarkdownDir, getMetadata} from '@src/util/static';
import {dateFormat, except} from '@src/util';
import content from '@data/content';

export const metadata = getMetadata('/');

export default async function Page() {
    const posts = (await processMarkdownDir('data/blog'))
        .filter((p) => p.published)
        .sort((a, b) => new Date(b.published) - new Date(a.published))
        .map((post) => except(post, 'source'));

    return (
        <>
            <Banner
                src="/media/avatar.jpg"
                alt="Cartoon avatar of Sidney Liebrand"
                width={280}
                height={280}
                title={content.titlePrefix}
                description={metadata.description}
            />
            <section className={styles.blogEntries}>
                {posts.map(
                    ({
                        title,
                        slug,
                        description,
                        published,
                        readTimeInMinutes,
                    }) => (
                        <Link
                            key={title}
                            href={`/blog/${slug}`}
                            title={title}
                            className={styles.blogEntry}
                        >
                            <h2>{title}</h2>
                            <Text color="page-accent">
                                By Sidney Liebrand on{' '}
                                {dateFormat(published, {includeDay: true})}
                                <Bullet />
                                {readTimeInMinutes} min read
                            </Text>
                            <p
                                dangerouslySetInnerHTML={{
                                    __html: description,
                                }}
                            />
                            <Button
                                tabIndex={-1}
                                className={styles.blogEntryButton}
                            >
                                View post
                            </Button>
                        </Link>
                    ),
                )}
            </section>
        </>
    );
}
