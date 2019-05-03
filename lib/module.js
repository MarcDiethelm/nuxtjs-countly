const path = require('path')

export default function nuxtCountly(_moduleOptions) {

    const moduleOptions = Object.assign({}, this.options.countly, _moduleOptions)

    if (!moduleOptions.app_key || !moduleOptions.url) {
        console.error('Missing required params : app_key, url')
        return
    }

    if (moduleOptions.trackers instanceof Array) {
		// need to stringify here to prevent _trackers from being an array wrapped in double quotes.
		// Don't know why this happens. Does addPlugin do this?
		moduleOptions._trackers = JSON.stringify(moduleOptions.trackers)
    } else {
        moduleOptions._trackers = JSON.stringify(['track_sessions', 'track_pageview', 'track_links'])
    }

    // Inject Countly analytics script in document
    this.options.head.script.unshift({
        src: moduleOptions.trackerSrc || 'https://cdn.jsdelivr.net/npm/countly-sdk-web@latest/lib/countly.min.js',
		body: true,
		async: ''
    })


	moduleOptions.noScript = moduleOptions.noScript !== undefined ? JSON.stringify(!!moduleOptions.noScript) : true

	if (moduleOptions.noScript) {

		if (!this.options.head.__dangerouslyDisableSanitizersByTagID) {
			this.options.head.__dangerouslyDisableSanitizersByTagID = {}
		}

		if (!this.options.head.noscript) {
			this.options.head.noscript = []
		}

		this.options.head.__dangerouslyDisableSanitizersByTagID['countly-noscript'] = ['innerHTML']

	    this.options.head.noscript.push({
			hid: 'countly-noscript',
	        innerHTML: `<img src="${moduleOptions.url}/pixel.png?app_key=${moduleOptions.app_key}&begin_session=1" />`,
			body: true
	    })
	}

    // Register plugin
	// Renders given template using lodash template during build into project buildDir (.nuxt).
    this.addPlugin({
        src: path.resolve(__dirname, 'plugin.js'),
        ssr: false,
        options: moduleOptions
    })

}

module.exports.meta = require('../package.json')
