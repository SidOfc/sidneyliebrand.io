module.exports = {
    webpack(config, {isServer}) {
        // https://coderberry.com/posts/mdx_next
        // fixes import [module] from [node_lib] errors
        // related to next-mdx-remote
        if (!isServer) {
            config.node = {
                fs: 'empty',
                path: 'empty',
            };
        }

        return config;
    },
};
