import {promises as fs} from 'fs';
import remoteRenderToString from 'next-mdx-remote/render-to-string';
import matter from 'gray-matter';
import {emojify} from 'node-emoji';
import {Octokit} from '@octokit/rest';
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

const ERAS = [-2, -1, 0, 1];
const SUPPORT_LEVELS = ['y', 'n', 'a', 'p', 'u', 'x', 'd'];
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
    'android',
    'samsung',
    'and_uc',
];
const VISIBLE_VERSIONS = Object.entries(caniuse.agents)
    .filter(([name]) => VISIBLE_BROWSERS.includes(name))
    .reduce((acc, [name, data]) => {
        acc[name] = ERAS.map((era) => {
            const found = data.version_list.find((item) => item.era === era);

            return found ? found.version : null;
        });

        return acc;
    }, {});

function getFeature(id) {
    const feature = caniuse.data[id];

    return {
        id,
        title: feature.title,
        description: feature.description,
        status: feature.status,
        spec: feature.spec,
        usage: {
            y: feature.usage_perc_y,
            a: feature.usage_perc_a,
        },
        stats: VISIBLE_BROWSERS.reduce((acc, browser) => {
            const versions = VISIBLE_VERSIONS[browser];
            const versionSupport = feature.stats[browser];

            acc[browser] = versions.reduce((acc, version) => {
                if (version && versionSupport[version]) {
                    acc.push({
                        version,
                        flags: versionSupport[version]
                            .split(/\s+/i)
                            .filter((x) => SUPPORT_LEVELS.includes(x)),
                    });
                } else {
                    acc.push({version: null, flags: []});
                }

                return acc;
            }, []);

            return acc;
        }, {}),
    };
}
