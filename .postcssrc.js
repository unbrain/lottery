// https://github.com/michael-ciniawsky/postcss-load-config

module.exports = {
    "plugins": {
        "postcss-import": {},
        "postcss-mixins": {},
        // "postcss-url": {},
        "postcss-units": {
            size: 16,
            precision: 6
        },
        "postcss-pxtorem": {
            rootValue: 16,
            propWhiteList: ['*', '!border', '!border-top', '!border-right', '!border-bottom', '!border-left', '!border-width'],
            selectorBlackList: ['html'],
            mediaQuery: false
        },
        "postcss-short": {},
        "postcss-for": {},
        "postcss-each": {},
        "postcss-cssnext": {
            features: {
                rem: false
            }
        },
        "postcss-discard-comments": {},
        "postcss-discard-duplicates": {},
        "postcss-discard-empty": {}
        // to edit target browsers: use "browserslist" field in package.json
        // "autoprefixer": {}
    }
}