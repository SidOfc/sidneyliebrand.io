import {promises as fs} from 'fs';
import remoteRenderToString from 'next-mdx-remote/render-to-string';
import matter from 'gray-matter';
import {emojify} from 'node-emoji';
import {Octokit} from '@octokit/rest';
import {markdown} from 'markdown';
import {MARKDOWN_OPTIONS} from '@src/util/mdx';
import {slug, readTime} from '@src/util';
import {profile, pages} from '@data/content.json';
import caniuse from 'caniuse-db/fulldata-json/data-2.0.json';

export async function renderToString(content, opts = {}) {
    return remoteRenderToString(emojify(content), {
        ...opts,
        ...MARKDOWN_OPTIONS,
    });
}

export function getPageData(path) {
    return pages.find((page) => page.path.endsWith(path));
}

export async function getPinnedRepositories() {
    const auth = (await fs.readFile('.api-access-token')).toString();
    const api = new Octokit({auth});

    return Promise.all(
        profile.programming.repos.map(async (name, index) => {
            const options = {owner: 'sidofc', repo: name};
            const [repo, topics, stats] = await Promise.all([
                api.repos
                    .get(options)
                    .then(({data}) => data)
                    .catch(() => ({})),
                api.repos
                    .getAllTopics(options)
                    .then(({data}) => data.names || [])
                    .catch(() => []),
                api.repos
                    .getContributorsStats(options)
                    .then(({data}) =>
                        data.reduce(
                            (acc, {total, weeks}) =>
                                weeks.reduce(
                                    (acc, week) => {
                                        acc.additions += week.a;
                                        acc.deletions += week.d;

                                        return acc;
                                    },
                                    {...acc, commits: acc.commits + total}
                                ),
                            {commits: 0, additions: 0, deletions: 0}
                        )
                    )
                    .catch(() => []),
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
        })
    );
}

export async function processMarkdownFile(filePath) {
    const filename = filePath.split('/').pop();
    const rawMarkdown = await fs.readFile(filePath);
    const {content, data} = matter(caniuseEmbedData(rawMarkdown.toString()));
    const source = await renderToString(content, {scope: data});

    return {
        ...data,
        readTimeInMinutes: readTime(rawMarkdown.toString()),
        source,
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
            processMarkdownFile(`${dirPath}/${filename}`)
        )
    );
}

function caniuseEmbedData(content) {
    return content.replace(/cani:[\w-]+/g, (match) =>
        JSON.stringify(getFeature(match.replace(/^cani:/, '')))
    );
}

const VISIBLE_BROWSERS = [
    'ie',
    'edge',
    'firefox',
    'chrome',
    'safari',
    'opera',
    'and_ff',
    'and_chr',
    'ios_saf',
    'op_mob',
    'op_mini',
    'android',
    'samsung',
    'and_uc',
];

function flagData(str) {
    const flags = str.split(/\s+/i);
    const notes = flags
        .filter((x) => x.startsWith('#'))
        .map((x) => parseInt(x.replace('#', ''), 10));

    if (flags.includes('p')) flags.push('n');

    return {
        notes,
        flags: flags.filter((flag) => !['d', 'x', 'p'].includes(flag)),
        disabled: flags.includes('d'),
        prefixed: flags.includes('x'),
    };
}

function compressStats(stats) {
    const result = Object.entries(stats).reduce((acc, [agent, support]) => {
        acc[agent] = caniuse.agents[agent].version_list
            .filter(({version}) => support[version])
            .reduce((groups, {version, era}) => {
                const group = groups[groups.length - 1];
                const flags = support[version];

                if (
                    group &&
                    group[0].flags === flags &&
                    ![1, 0].includes(era)
                ) {
                    group.push({version, era, flags});
                } else {
                    groups.push([{version, era, flags}]);
                }

                return groups;
            }, [])
            .map((group) => {
                if (group.length === 1)
                    return {...group[0], ...flagData(group[0].flags)};

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
                    version: `${firstVersion}-${lastVersion}`,
                    era: last.era,
                    ...flagData(last.flags),
                };
            });

        return acc;
    }, {});

    return result;
}

function getFeature(id) {
    const feature = require(`caniuse-db/features-json/${id}.json`);
    const compressedStats = compressStats(feature.stats);
    const stats = VISIBLE_BROWSERS.map((id) => ({
        id,
        name: caniuse.agents[id].browser,
        versions: compressedStats[id],
    }));
    const prefixes = VISIBLE_BROWSERS.reduce(
        (acc, id) => ({
            ...acc,
            [id]: caniuse.agents[id].prefix,
        }),
        {}
    );
    const activeNotes = Object.values(stats)
        .map(({versions}) => versions)
        .reduce((acc, versions) => {
            versions.forEach(({notes}) => acc.push(...notes));
            return acc;
        }, [])
        .filter((note, idx, notes) => notes.indexOf(note) === idx);

    return {
        id,
        prefixes,
        links: feature.links || [],
        bugs: (feature.bugs || []).map(({description}) =>
            markdown
                .toHTML(description.trim())
                .replace(/^<p>\s*|\s*<\/p>$/gi, '')
        ),
        updated: caniuse.updated * 1000,
        notesByNum: activeNotes
            .filter((note) => feature.notes_by_num[note])
            .sort((a, b) => (a > b ? 1 : a === b ? 0 : -1))
            .map((note) => ({
                note,
                text: markdown
                    .toHTML(feature.notes_by_num[note].trim())
                    .replace(/^<p>\s*|\s*<\/p>$/gi, ''),
            })),
        title: feature.title,
        description: `${markdown
            .toHTML(feature.description.trim())
            .replace(/^<p>\s*|\s*<\/p>$/gi, '')}`,
        status: feature.status,
        spec: feature.spec,
        usage: {
            y: feature.usage_perc_y,
            a: feature.usage_perc_a,
        },
        stats,
    };
}
