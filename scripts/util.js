const {promises: fs, readFileSync} = require('fs');
const matter = require('gray-matter');
const {host, pages} = require('../data/seo.json');
const profile = require('../data/profile.json');
const xml = require('prettify-xml');
const {encode: htmlentities} = require('html-entities');

function slug(str) {
    return str
        .replace(/\.\w+$/g, '')
        .replace(/\W+/g, ' ')
        .replace(/\s+/g, '-')
        .toLowerCase();
}

async function getPosts() {
    return fs.readdir('data/blog').then((paths) =>
        paths
            .map((path) => ({
                ...matter(readFileSync(`data/blog/${path}`)).data,
                path: `/blog/${slug(path)}`,
                priority: 0.5,
                changefreq: 'yearly',
            }))
            .filter((p) => p.published)
            .sort((a, b) => new Date(b.published) - new Date(a.published))
    );
}

async function getPages() {
    const posts = await getPosts();

    return [...pages, ...posts];
}

async function createSitemap(destination) {
    const pages = await getPages();
    const sitemap = xml(
        `
        <?xml version="1.0" encoding="utf-8" ?>
        <urlset xmlns="https://sitemaps.org/schemas/sitemap/0.9">
            ${pages
                .map(({path, priority = 0.1, changefreq = 'yearly'}) =>
                    `
                    <url>
                        <loc>${host}${path.replace(/\/+$/i, '')}</loc>
                        <priority>${priority}</priority>
                        <changefreq>${changefreq}</changefreq>
                    </url>
                    `.trim()
                )
                .join('')}
        </urlset>
        `
    );

    return fs.writeFile(destination, sitemap);
}

function feedItem({title, description, path, published}) {
    const url = `${host}${path.replace(/\/+$/i, '')}`;

    return `
    <item>
        <title>${title}</title>
        <description>${htmlentities(description, {level: 'xml'})}</description>
        <link>${url}</link>
        <guid isPermalink="true">${url}</guid>
        <pubdate>${new Date(published).toUTCString()}</pubdate>
    </item>
    `.trim();
}

function atomItem({title, description, path, published, updated = published}) {
    const url = `${host}${path.replace(/\/+$/i, '')}`;

    return `
    <entry>
        <title>${title}</title>
        <summary>${htmlentities(description, {level: 'xml'})}</summary>
        <id>${url}</id>
        <link rel="alternate" href="${url}" />
        <published>${published}</published>
        <updated>${updated}</updated>
    </entry>
    `;
}

async function createFeed(destination, options = {}) {
    const posts = options.posts || (await getPosts());
    const date = options.date || new Date();
    const feed = xml(
        `
        <?xml version="1.0" encoding="utf-8" ?>
        <rss version="2.0">
            <channel>
                <title>${profile.name}'s blog</title>
                <description>The official ${host} RSS feed</description>
                <link>${host}</link>
                <lastBuildDate>${date.toUTCString()}</lastBuildDate>
                <copyright>Copyright ${host} ${date.getFullYear()}</copyright>
                <category term="technology" />
                ${posts.map(feedItem).join('\n')}
            </channel>
        </rss>
        `
    );

    return fs.writeFile(destination, feed);
}

async function createAtom(destination, options = {}) {
    const posts = options.posts || (await getPosts());
    const date = options.date || new Date();
    const atom = xml(
        `
        <?xml version="1.0" encoding="utf-8" ?>
        <feed xmlns="https://www.w3.org/2005/Atom">
            <title>${profile.name}'s blog</title>
            <subtitle>The official ${host} Atom feed</subtitle>
            <id>${host}</id>
            <link href="${host}" />
            <link href="${host}/atom.xml" rel="self" />
            <updated>${date.toJSON()}</updated>
            <rights>Copyright ${host} ${date.getFullYear()}</rights>
            <category term="technology" />
            <author>
                <name>${profile.name}</name>
            </author>
            ${posts.map(atomItem).join('\n')}
        </feed>
        `
    );

    return fs.writeFile(destination, atom);
}

module.exports = {
    getPosts,
    createSitemap,
    createFeed,
    createAtom,
};
