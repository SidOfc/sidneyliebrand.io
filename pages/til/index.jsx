import {useState} from 'react';
import renderToString from 'next-mdx-remote/render-to-string';
import matter from 'gray-matter';
import styles from './til.module.scss';
import Image from '../../components/image';
import Banner from '../../components/banner';
import Link from 'next/link';
import {classes} from '../../util';
import {processMarkdownDir} from '../../util/static';

export default function Index({tils}) {
    const [opened, setOpened] = useState(null);

    return (
        <>
            <Banner
                src="/media/avatar.jpg"
                width={280}
                height={280}
                title="Things I learned"
                description="This page lists some of the things I learned over time. They aren't necessarily front-end related though, but have been very useful to me to this very day!"
            />
            <section className={styles.entries}>
                {tils.map(({title, slug, source}) => (
                    <article key={slug} className={styles.entry}>
                        <div
                            className={styles.entryHeader}
                            onClick={() =>
                                setOpened(opened === slug ? null : slug)
                            }
                        >
                            <Link href={`/til/${slug}`}>
                                <a>{title}</a>
                            </Link>
                            <Image
                                className={classes(styles.entryHeaderArrow, {
                                    [styles.entryHeaderArrowOpen]:
                                        opened === slug,
                                })}
                                src="/media/arrow.svg"
                                width={20}
                                height={20}
                            />
                        </div>
                        {opened === slug && (
                            <section
                                className={styles.entryContent}
                                dangerouslySetInnerHTML={{
                                    __html: source.renderedOutput,
                                }}
                            />
                        )}
                    </article>
                ))}
            </section>
        </>
    );
}

export async function getStaticProps() {
    const tils = await processMarkdownDir('data/til');

    return {
        props: {
            tils: tils.sort(
                (a, b) => new Date(b.published) - new Date(a.published)
            ),
        },
    };
}
