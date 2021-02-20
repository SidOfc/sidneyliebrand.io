import NextHead from 'next/head';
import {useRouter} from 'next/router';
import {host, profile} from '@data/content';

export default function Head({title, description}) {
    const {asPath} = useRouter();

    return (
        <NextHead>
            <title>{title}</title>
            <link rel="cannonical" href={`${host}${asPath}`} />
            <link rel="manifest" href="/site.webmanifest" />
            <link
                rel="mask-icon"
                href="/safari-pinned-tab.svg"
                color="#a676ff"
            />
            <link
                rel="icon"
                sizes="48x48"
                type="image/icon"
                href="/favicon.ico"
            />
            <link
                rel="icon"
                sizes="16x16"
                type="image/png"
                href="/favicon-16x16.png"
            />
            <link
                rel="icon"
                sizes="32x32"
                type="image/png"
                href="/favicon-32x32.png"
            />
            <link
                rel="apple-touch-icon"
                sizes="180x180"
                type="image/png"
                href="/apple-touch-icon.png"
            />
            <link
                rel="alternate"
                type="application/atom+xml"
                title={`The official ${host} Atom feed`}
                href="/atom.xml"
            />
            <link
                rel="alternate"
                type="application/rss+xml"
                title={`The official ${host} RSS feed`}
                href="/feed.xml"
            />
            <meta
                name="viewport"
                content="width=device-width, initial-scale=1.0"
            />
            <meta name="theme-color" content="#ffffff" />
            <meta name="msapplication-TileColor" content="#ffc40d" />
            <meta name="robots" content="index, follow" />
            <meta name="author" content={profile.name} />
            <meta name="description" content={description} />
            <meta property="og:title" content={title} />
            <meta property="og:type" content="website" />
            <meta property="og:url" content={host} />
            <meta property="og:site_name" content={host} />
            <meta property="og:description" content={description} />
            <meta name="dc:creator" content={profile.name} />
            <meta name="dc:title" content={title} />
            <meta name="dc:description" content={description} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:creator" content={profile.accounts.twitter} />
        </NextHead>
    );
}
