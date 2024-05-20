import {promises as fs} from 'fs';
import matter from 'gray-matter';
import {emojify} from 'node-emoji';
import {retry} from '@octokit/plugin-retry';
import {Octokit} from '@octokit/rest';
import {markdown} from 'markdown';
import {slug, readTime} from '@src/util';
import content from '@data/content';
import caniuse from 'caniuse-db/fulldata-json/data-2.0.json';
const {profile, pages, host, titlePrefix} = content;

export function getMetadata(targetPath = '/', attrs = {}) {
    const page = pages.find((page) => page.path.endsWith(targetPath));
    const {
        title,
        description,
        og = {},
        path = targetPath,
        canonical = `${host}${path}`.replace(/\/+$/, ''),
    } = {...(page ?? {}), ...(attrs ?? {})};
    const fullTitle = [titlePrefix, title].filter(Boolean).join(' - ');

    return {
        description,
        title: fullTitle,
        authors: [{name: profile.name, url: host}],
        creator: profile.name,
        publisher: profile.name,
        manifest: '/site.webmanifest',
        metadataBase: new URL(host),
        robots: {index: true, follow: true},
        openGraph: {
            url: canonical,
            type: 'website',
            siteName: titlePrefix,
            ...og,
        },
        other: {'msapplication-TileColor': '#ffc40d'},
        icons: {
            apple: {url: '/apple-icon.png', sizes: '180x180'},
            icon: [
                {url: '/favicon.ico', sizes: '48x48'},
                {url: '/favicon-16x16.png', sizes: '16x16'},
                {url: '/favicon-32x32.png', sizes: '32x32'},
            ],
            other: [
                {
                    rel: 'mask-icon',
                    url: '/safari-pinned-tab.svg',
                    color: '#a676ff',
                },
            ],
        },
        alternates: {
            canonical,
            types: {
                'application/rss+xml': '/feed.xml',
                'application/atom+xml': '/atom.xml',
            },
        },
    };
}

export async function getPinnedRepositories() {
    const auth = (await fs.readFile('.api-access-token')).toString();
    const RetriableOctokit = Octokit.plugin(retry);
    const api = new RetriableOctokit({auth, request: {retries: 3}});
    const completion = async (fn, attempts = 3) => {
        const response = await fn();

        if (response.status === 200 || attempts === 0) {
            return response;
        }

        return new Promise((resolve, reject) => {
            setTimeout(
                () =>
                    completion(fn, attempts - 1)
                        .then(resolve)
                        .catch(reject),
                1000,
            );
        });
    };

    return Promise.all(
        profile.programming.repos.map(async (name, index) => {
            const options = {owner: 'sidofc', repo: name};
            const [repo, topics, stats] = await Promise.all([
                api.repos.get(options).then(({data}) => data),
                api.repos
                    .getAllTopics(options)
                    .then(({data}) => data.names || []),
                completion(() => api.repos.getContributorsStats(options)).then(
                    (response) => {
                        const data = Array.isArray(response.data)
                            ? response.data
                            : [];

                        return data.reduce(
                            (acc, {total, weeks}) =>
                                weeks.reduce(
                                    (acc, week) => {
                                        acc.additions += week.a;
                                        acc.deletions += week.d;

                                        return acc;
                                    },
                                    {...acc, commits: acc.commits + total},
                                ),
                            {commits: 0, additions: 0, deletions: 0},
                        );
                    },
                ),
            ]);

            return {
                id: repo.id,
                index,
                name: repo.name,
                url: repo.html_url,
                createdAt: repo.created_at,
                pushedAt: repo.pushed_at,
                description: repo.description,
                starCount: repo.stargazers_count,
                topics,
                stats,
            };
        }),
    );
}

export async function processMarkdownFile(filePath) {
    const filename = filePath.split('/').pop();
    const rawMarkdown = await fs.readFile(filePath);
    const {content, data} = matter(caniuseEmbedData(rawMarkdown.toString()));

    return {
        ...data,
        readTimeInMinutes: readTime(rawMarkdown.toString()),
        markdown: emojify(content),
        slug: slug(filename),
    };
}

export async function processMarkdownSlug(dirPath, urlSlug) {
    const filenames = await fs.readdir(dirPath);
    const found = filenames.find((filename) => slug(filename) === urlSlug);

    return found ? processMarkdownFile(`${dirPath}/${found}`) : {};
}

export async function getMarkdownDirSlugs(dirPath) {
    const filenames = await fs.readdir(dirPath);

    return filenames.map(slug);
}

export async function processMarkdownDir(dirPath) {
    const filenames = await fs.readdir(dirPath);

    return Promise.all(
        filenames.map((filename) =>
            processMarkdownFile(`${dirPath}/${filename}`),
        ),
    );
}

function caniuseEmbedData(content) {
    return interpolate(content, 'caniuse', (id) =>
        JSON.stringify(getFeature(id)),
    );
}

function flagData(str) {
    const flags = str.split(/\s+/i);
    const notes = flags
        .filter((x) => x.startsWith('#'))
        .map((x) => parseInt(x.replace('#', ''), 10));

    if (flags.includes('p')) flags.push('n');

    return {
        notes,
        flags: flags.filter(
            (flag) => !['d', 'x', 'p'].includes(flag) && !flag.startsWith('#'),
        ),
        disabled: flags.includes('d'),
        prefixed: flags.includes('x'),
    };
}

function equalFlags(a, b) {
    return (
        a.notes.every((note) => b.notes.includes(note)) &&
        b.notes.every((note) => a.notes.includes(note)) &&
        a.flags.every((flag) => b.flags.includes(flag)) &&
        b.flags.every((flag) => a.flags.includes(flag)) &&
        a.disabled === b.disabled &&
        a.prefixed === b.prefixed
    );
}

function compressStats(stats) {
    const result = Object.entries(stats).reduce((acc, [agent, support]) => {
        acc[agent] = caniuse.agents[agent].version_list
            .filter(({version}) => support[version])
            .map((cell) => ({...cell, ...flagData(support[cell.version])}))
            .reduce((groups, cell) => {
                const group = groups[groups.length - 1];

                if (
                    group &&
                    equalFlags(group[0], cell) &&
                    ![1, 0].includes(cell.era)
                ) {
                    group.push(cell);
                } else {
                    groups.push([cell]);
                }

                return groups;
            }, [])
            .map((group) => {
                if (group.length === 1) return group[0];

                const first = group[0];
                const last = group[group.length - 1];
                let firstVersion = first.version;
                let lastVersion = last.version;

                if (firstVersion.match(/^(?:\d+\.)+\d+(?:-(?:\d+\.)+\d+)$/)) {
                    firstVersion = firstVersion.split('-').shift();
                }

                if (lastVersion.match(/^(?:\d+\.)+\d+(?:-(?:\d+\.)+\d+)$/)) {
                    lastVersion = lastVersion.split('-').pop();
                }

                return {
                    ...last,
                    version: `${firstVersion}-${lastVersion}`,
                };
            });

        return acc;
    }, {});

    return result;
}

function getFeature(id) {
    const feature = require(`caniuse-db/features-json/${id}.json`);
    const compressedStats = compressStats(feature.stats);
    const browsers = Object.keys(caniuse.agents);
    const stats = browsers.map((id) => ({
        id,
        name: caniuse.agents[id].browser,
        versions: compressedStats[id],
    }));
    const prefixes = browsers.reduce(
        (acc, id) => ({
            ...acc,
            [id]: caniuse.agents[id].prefix,
        }),
        {},
    );

    return {
        id,
        prefixes,
        links: [
            ...(feature.links || []),
            ...(feature.spec
                ? [{url: feature.spec, title: 'Specification'}]
                : []),
        ].filter(
            (l, idx, links) =>
                links.findIndex((ll) => l.url === ll.url) === idx,
        ),
        bugs: (feature.bugs || []).map(({description}) =>
            inlineMarkdown(description),
        ),
        updated: caniuse.updated * 1000,
        notes: [
            ...feature.notes
                .split(/(?:\r?\n){2,}/g)
                .filter((content) => content)
                .map((content) => ({
                    note: null,
                    text: inlineMarkdown(content),
                })),
            ...Object.entries(feature.notes_by_num)
                .map(([note, content]) => ({
                    note: parseInt(note, 10),
                    text: inlineMarkdown(content),
                }))
                .sort(({a}, {b}) => (a > b ? 1 : a === b ? 0 : -1)),
        ],
        title: feature.title,
        description: inlineMarkdown(feature.description),
        status: feature.status,
        usage: {
            y: feature.usage_perc_y,
            a: feature.usage_perc_a,
        },
        stats,
    };
}

function inlineMarkdown(content) {
    return markdown.toHTML(content.trim()).replace(/^<p>\s*|\s*<\/p>$/gi, '');
}

function interpolate(content, label, replace) {
    const findRegExp = new RegExp(`{{${label}:.*?}}`, 'g');
    const stripRegExp = new RegExp(`^{{${label}:|}}$`, 'g');

    return content.replace(findRegExp, (match) =>
        replace(match.replace(stripRegExp, '')),
    );
}
