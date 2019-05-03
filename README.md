# @marcdiethelm/nuxtjs-countly

A Nuxt.js plugin providing Countly's web SDK / analytics / tracker. [Github](https://github.com/Countly/countly-sdk-web), [API](http://countly.github.io/countly-sdk-web), [docs](https://resources.count.ly/docs/countly-sdk-for-web)

The plugin lazy loads the Countly tracker by adding a script element as last child in html `body` with `async=true`. It then checks for script load every 500ms for 30s, until the script is loaded or it times out. After successful script load `window.Countly` is injected into Vue components and Nuxt context as `$countly`.

> Based on [nuxtjs-countly by gweill](https://www.npmjs.com/package/nuxtjs-countly), a published npm module without public source code. If you are the original author please contact me.


## Installation and Config

```bash
npm install --save @marcdiethelm/nuxtjs-countly
```

In `nuxt.config.js`...

- add this line to the `modules` array:

```js
'@marcdiethelm/nuxtjs-countly'
```

- and add this **configuration** data somewhere below:

```js
/*
 ** Countly tracker configuration (@marcdiethelm/nuxtjs-countly)
 */
countly: {
	// Required, the URL of your Countly server
	url: process.env.MYAPP_COUNTLY_URL || 'http://mycountly.lan',
	
	// Required, copy from server's management > apps page
	app_key: process.env.MYAPP_COUNTLY_APP_KEY || 'b0ccb5ea1fd4000000000000448ed463d87d334f',
	
	// For self-hosting... use original .js or .min.js (minified)
	// Default: https://cdn.jsdelivr.net/npm/countly-sdk-web@latest/lib/countly.min.js
	trackerSrc: process.env.MYAPP_COUNTLY_TRACKER_SRC || 'http://mycountly.lan/sdk/web/countly.min.js',
	
	// Automatic tracking, if not array defaults to ['track_sessions', 'track_pageview', 'track_links']
	trackers: null,
	
	// Append a <noscript> tag with tracking pixel <img> to <body>, default: true
	noScript: true,
	
	// Log Countly debug info to console, default: false
	debug: process.env.NODE_ENV !== 'production'
}
```


## Programmatic usage

Countly is available as `this.$countly` in Vue.js components and also in `context` provided by Nuxt.js. (No import is needed.) It is typically used as

```js
this.$countly.q.push()
```
Consult the Countly web SDK [API documentation](http://countly.github.io/countly-sdk-web) for further info on using the `$countly` object.

#### Examples

Note the function `this.onCountlyLoad` called on tracker script load, which accepts callbacks.

```js
// ./examples/component.vue

asyncData: function(context) {
	let countly = context.app.$countly
},

created: function() {
	// only in browser
	if (this.$countly) {
		this.$countly.q.push([
			'add_event',
			{
				key: 'page-created'
			}
		])
	}
},

mounted: function() {
	this.$countly.q.push([
		'add_event',
		{
			key: 'page-mounted'
		}
	])

	this.onCountlyLoad(() => {
		this.$countly.q.push([
			'add_event',
			{
				key: 'countly-loaded'
			}
		])
	})
}
```

This plugin provides a `$track` helper method, which performs some input checking and pushes to the queue:

```js
this.$track('add_event', {
	key: 'email-signup-success',
	segmentation: { email: this.email }
})

this.$track('log_error', { 
	email: this.email,
	detail: err.message
})
```


## Troubleshooting

- CORS errors in Firefox despite correct HTTP headers:
  
  Are you running an ad blocker? Blocked connection by an identified tracker script will show as a CORS error in Firefox.
