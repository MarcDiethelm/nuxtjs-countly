const path = require('path')

export default function nuxtCountly(_moduleOptions) {

    const moduleOptions = Object.assign({}, this.options.countly, _moduleOptions)

    if (!moduleOptions.app_key || !moduleOptions.url) {
        console.error('Missing required params : app_key, url')
        return
    }

    if (moduleOptions.trackers === undefined) {
		// need to stringify here to prevent _trackers from being an array wrapped in double quotes.
		// Don't know why this happens. Does addPlugin do this?
        moduleOptions._trackers = JSON.stringify(['track_sessions', 'track_pageview', 'track_links'])
    } else {
		moduleOptions._trackers = JSON.stringify(moduleOptions.trackers)
    }

    // Add Countly analytics script to head
    this.options.head.script.unshift({
        src: moduleOptions.trackerSrc || 'https://cdn.jsdelivr.net/npm/countly-sdk-web@latest/lib/countly.min.js',
		body: true,
		async: ''
    })

    // Register plugin
	// Renders given template using lodash template during build into project buildDir (.nuxt).
    this.addPlugin({
        src: path.resolve(__dirname, 'plugin.js'),
        ssr: false,
        options: moduleOptions
    })


}

module.exports.meta = require('../package.json')
