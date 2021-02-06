import {useState} from 'react';
import renderToString from 'next-mdx-remote/render-to-string';
import matter from 'gray-matter';
import styles from './til.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import {classes} from '../../util';
import {processMarkdownDir} from '../../util/static';

export default function Index({tils}) {
    const [opened, setOpened] = useState(null);

    return (
        <>
            {tils.map(({title, slug, source}) => (
                <article key={slug} className={styles.entry}>
                    <div
                        className={styles.entryHeader}
                        onClick={() => setOpened(opened === slug ? null : slug)}
                    >
                        <Link href={`/til/${slug}`}>
                            <a>{title}</a>
                        </Link>
                        <div
                            className={classes(styles.entryHeaderArrow, {
                                [styles.entryHeaderArrowOpen]: opened === slug,
                            })}
                        >
                            <Image src={`/media/arrow.svg`} layout="fill" />
                        </div>
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
