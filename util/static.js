import renderToString from 'next-mdx-remote/render-to-string';
import matter from 'gray-matter';
import profile from '../data/profile.json';
import {Octokit} from '@octokit/rest';
import {slug} from './';
import {promises as fs} from 'fs';

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

export async function processMarkdownFile(filePath, renderOpts = {}) {
    const filename = filePath.split('/').pop();
    const rawMarkdown = await fs.readFile(filePath);
    const {content, data} = matter(rawMarkdown);
    const source = await renderToString(content, {
        ...renderOpts,
        scope: data,
    });

    return {
        ...data,
        source,
        slug: slug(filename),
    };
}

export async function processMarkdownSlug(dirPath, urlSlug, renderOpts = {}) {
    const filenames = await fs.readdir(dirPath);
    const found = filenames.find((filename) => slug(filename) === urlSlug);

    return found ? processMarkdownFile(`${dirPath}/${found}`, renderOpts) : {};
}

export async function getMarkdownDirSlugs(dirPath) {
    const filenames = await fs.readdir(dirPath);

    return filenames.map(slug);
}

export async function processMarkdownDir(dirPath, renderOpts = {}) {
    const filenames = await fs.readdir(dirPath);

    return Promise.all(
        filenames.map((filename) =>
            processMarkdownFile(`${dirPath}/${filename}`, renderOpts)
        )
    );
}
