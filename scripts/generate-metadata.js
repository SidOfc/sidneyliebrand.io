const {getPosts, createSitemap, createFeed, createAtom} = require('./util');

(async function metadata() {
    const posts = await getPosts();
    const date = new Date();

    return Promise.all([
        createSitemap('public/sitemap.xml'),
        createFeed('public/feed.xml', {posts, date}),
        createAtom('public/atom.xml', {posts, date}),
    ]);
})();
