import {useState} from 'react';
import renderToString from 'next-mdx-remote/render-to-string';
import matter from 'gray-matter';
import styles from './til.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import CodeBlock from '../../components/code-block';
import {classes} from '../../util';
import {processMarkdownDir} from '../../util/static';

export default function Index({tils}) {
    const [opened, setOpened] = useState(null);

    return (
        <>
            {tils.map((til) => (
                <div key={til.slug} className={styles.entry}>
                    <div
                        className={styles.entryHeader}
                        onClick={() =>
                            setOpened(opened === til.slug ? null : til.slug)
                        }
                    >
                        <Link href={`/til/${til.slug}`}>
                            <a>{til.title}</a>
                        </Link>
                        <div
                            className={classes(styles.entryHeaderArrow, {
                                [styles.entryHeaderArrowOpen]:
                                    opened === til.slug,
                            })}
                        >
                            <Image src={`/media/arrow.svg`} layout="fill" />
                        </div>
                    </div>
                    {opened === til.slug && (
                        <div
                            className={styles.entryContent}
                            dangerouslySetInnerHTML={{
                                __html: til.source.renderedOutput,
                            }}
                        />
                    )}
                </div>
            ))}
        </>
    );
}

export async function getStaticProps() {
    const tils = await processMarkdownDir('data/til', {
        components: {pre: CodeBlock},
    });

    return {
        props: {
            tils: tils.sort(
                (a, b) => new Date(b.published) - new Date(a.published)
            ),
        },
    };
}
