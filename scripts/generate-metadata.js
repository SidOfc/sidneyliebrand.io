const util = require('./util');
const {pages} = require('../data/content.json');

(async function () {
    const posts = await util.getPosts();
    const date = new Date();

    return Promise.all([
        util.createWebmanifest('public/site.webmanifest'),
        util.createFeed('public/feed.xml', {entries: posts, date}),
        util.createAtom('public/atom.xml', {entries: posts, date}),
        util.createSitemap('public/sitemap.xml', {
            entries: [...pages, ...posts],
        }),
    ]);
})();
