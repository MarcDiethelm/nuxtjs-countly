# nuxtjs-countly

A Nuxt.js plugin providing Countly's web analytics / SDK tracker. [Github](https://github.com/Countly/countly-sdk-web), [API](http://countly.github.io/countly-sdk-web), [docs](https://resources.count.ly/docs/countly-sdk-for-web)

Based on [nuxtjs-countly by gweill](https://www.npmjs.com/package/nuxtjs-countly), a published npm module without public source code. If you are the original author please contact me.

## Installation

```bash
npm install --save @marcdiethelm/nuxtjs-countly
```

In `nuxt.config.js`

add the line to the `modules` array:

```js
'nuxt-countly'
```

and add this configuration data somewhere below:

```js
/*
 ** nuxtjs-countly module configuration
 */
countly: {
	// required, the URL of your Countly server
	url: 'http://countly.dokku.lan'
	
	// required, copy from server's management > apps page
	app_key: 'b0ccb5ea1fd4000000000000448ed463d87d334f',
	
	// optional, for self-hosting. use original or minified.
	trackerSrc: 'http://countly.dokku.lan/sdk/web/countly.min.js',
	
	// automatic tracking, if undefined defaults to ['track_sessions', 'track_pageview', 'track_links']
	trackers: undefined
	
	// default: false
	debug: true
},
```

or more production-like:


```js
/*
 ** nuxtjs-countly module configuration
 */
countly: {
	url: process.env.MYAPP_COUNTLY_URL,
	app_key: process.env.MYAPP_COUNTLY_APP_KEY,
	trackerSrc: process.env.MYAPP_COUNTLY_TRACKER_SRC,
	trackers: [
		'track_sessions',
		'track_pageview',
		'track_links'
	],
	debug: process.env.NODE_ENV !== 'production'
}
```
Comments in this example are omitted for brevity.

## Programmatic usage

Countly is available as `this.$countly` in Vue.js components and also in `context` provided by Nuxt.js. It is typically used as 
```js
this.$countly.q.push()
```
Consult the Countly web SDK [API documentation](http://countly.github.io/countly-sdk-web) for further info on using the `$countly` object.

#### Example

```js
	// To use before Vue is ready.
	asyncData: function(context) {
		let countly = context.$countly
		...
	},
	
	methods: {
		/**
		 * @param {string} action - Countly tracker 'helper method'.
 		 * @param {object} data - Analytics data.
		 */
		track: function(action, data) {
			if (typeof action !== 'string') return console.error(`action is not string, type: ${typeof action}`)
			if (action === 'add_event' && typeof data.key !== 'string')
				return console.error(`data.key is not string, type: ${typeof action}`)

			this.$countly.q.push([action, data])
		}
	}
```

Use it:

```js
this.track('add_event', {
	key: 'email-signup-success',
	segmentation: { email: this.email }
})

this.track('log_error', { 
	email: this.email,
	detail: err.message
})
```

## Troubleshooting

- CORS errors in Firefox despite correct HTTP headers:
  
  Are you running an ad blocker? Blocked connection by an identified tracker script will show as a CORS error in Firefox.
