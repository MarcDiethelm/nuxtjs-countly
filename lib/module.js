const path = require('path')

module.exports = function nuxtCountly(_moduleOptions) {
    const moduleOptions = Object.assign({}, this.options.countly, _moduleOptions)

    if (!moduleOptions.app_key || !moduleOptions.url) {
        console.warn('Missing compulsory params : app_key, url, abort')
        return
    }

    if (moduleOptions.trackers) {
        moduleOptions._trackers = JSON.stringify(moduleOptions.trackers.split(/[ ,]/).filter(d => d))
    } else {
        moduleOptions._trackers = JSON.stringify(['track_sessions', 'track_pageview', 'track_links'])
    }

    // Add google analytics script to head
    this.options.head.script.push({
        src: moduleOptions.CDNCountlyURL || 'https://cdn.jsdelivr.net/npm/countly-sdk-web@latest/lib/countly.min.js',
        async: true
    })

    // Register plugin
    this.addPlugin({
        src: path.resolve(__dirname, 'plugin.js'),
        ssr: false,
        options: moduleOptions
    })
}
