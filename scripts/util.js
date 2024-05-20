const {promises: fs, readFileSync} = require('fs');
const matter = require('gray-matter');
const {host, titlePrefix, profile} = require('../data/content.json');
const sassVars = require('../data/sass-variables.json');
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
                path,
            }))
            .map((metadata) => ({
                ...metadata,
                path: `/blog/${slug(metadata.path)}`,
                priority: 0.5,
                changefreq: 'yearly',
            }))
            .filter((p) => p.published)
            .sort((a, b) => new Date(b.published) - new Date(a.published)),
    );
}

async function createSitemap(destination, {entries}) {
    return fs.writeFile(
        destination,
        xml(
            `
            <?xml version="1.0" encoding="utf-8" ?>
            <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
                ${entries
                    .map(({path, priority = 0.1, changefreq = 'yearly'}) =>
                        `
                        <url>
                            <loc>${host}${path.replace(/\/+$/i, '')}</loc>
                            <priority>${priority}</priority>
                            <changefreq>${changefreq}</changefreq>
                        </url>
                        `.trim(),
                    )
                    .join('')}
            </urlset>
            `,
        ),
    );
}

function feedItem({title, description, path, published}) {
    const url = `${host}${path.replace(/\/+$/i, '')}`;
    const xmlDescription = htmlentities(description, {level: 'xml'});
    const fullTitle = [titlePrefix, title].filter((x) => x).join(' - ');

    return `
        <item>
            <title>${fullTitle}</title>
            <description>${xmlDescription}</description>
            <link>${url}</link>
            <guid isPermalink="true">${url}</guid>
            <pubdate>${new Date(published).toUTCString()}</pubdate>
        </item>
    `.trim();
}

async function createFeed(destination, {entries, date}) {
    const feed = xml(
        `
        <?xml version="1.0" encoding="utf-8" ?>
        <rss version="2.0">
            <channel>
                <title>${titlePrefix}</title>
                <description>The official ${host} RSS feed</description>
                <link>${host}</link>
                <lastBuildDate>${date.toUTCString()}</lastBuildDate>
                <copyright>Copyright ${host} ${date.getFullYear()}</copyright>
                <category term="technology" />
                ${entries.map(feedItem).join('\n')}
            </channel>
        </rss>
        `,
    );

    return fs.writeFile(destination, feed);
}

function atomItem({title, description, path, published, updated = published}) {
    const url = `${host}${path.replace(/\/+$/i, '')}`;
    const fullTitle = [titlePrefix, title].filter((x) => x).join(' - ');

    return `
        <entry>
            <title>${fullTitle}</title>
            <summary>${htmlentities(description, {level: 'xml'})}</summary>
            <id>${url}</id>
            <link rel="alternate" href="${url}" />
            <published>${published}</published>
            <updated>${updated}</updated>
        </entry>
    `;
}

async function createAtom(destination, {entries, date}) {
    return fs.writeFile(
        destination,
        xml(
            `
            <?xml version="1.0" encoding="utf-8" ?>
            <feed xmlns="https://www.w3.org/2005/Atom">
                <title>${titlePrefix}</title>
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
                ${entries.map(atomItem).join('\n')}
            </feed>
            `,
        ),
    );
}

async function createWebmanifest(destination) {
    const webmanifest = JSON.stringify({
        name: 'sidneyliebrand.io',
        short_name: 'sl.io',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
        ],
        theme_color: sassVars.themes.light['primary-fg'],
        background_color: sassVars.themes.light['primary-bg'],
        display: 'standalone',
    });

    return fs.writeFile(destination, webmanifest);
}

async function createRobotsTxt(destination) {
    return fs.writeFile(
        destination,
        ['User-agent: *', 'Allow: /', `Sitemap: ${host}/sitemap.xml`].join(
            '\n',
        ),
    );
}

module.exports = {
    getPosts,
    createSitemap,
    createFeed,
    createAtom,
    createWebmanifest,
    createRobotsTxt,
};
