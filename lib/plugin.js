import Vue from 'vue'

export default ({ app }, inject) => {

	const w = window
	const opt = {
		app_key: '<%= options.app_key %>',
		url: '<%= options.url %>',
		trackers: JSON.parse('<%= options._trackers %>'),

		// default: check for tracker script load every 500ms for 30s
		// these options are undocumented
		cancelCheckingAfter: <%= parseInt(options.cancelCheckingAfter) %> || 60,
		interval: <%= parseInt(options.interval) %> || 500
	}

	// Create a simple placeholder $countly.q object for use before the tracker script is loaded
	let _Countly = {
		app_key: opt.app_key,
		url: opt.url,
		isLoaded: false,
		q: []
	}
	Vue.prototype.$countly = _Countly
	app.$countly = _Countly


	// Provide a callback for successful tracker script load
	const onCountlyLoadCallers = []
	Vue.prototype.onCountlyLoad = function(cb) {
		if (_Countly.isLoaded)cb()
		else onCountlyLoadCallers.push(cb);
	}


	// Populate the loaded Countly object and replace the placeholder object
	function onScriptLoaded() {

		w.clearInterval(areWeThereYet)

		Countly = w['Countly']
		Countly.app_key = opt.app_key
		Countly.url = opt.url
		Countly.isLoaded = true;
		Countly.q = _Countly.q

		opt.trackers.forEach( trackerName => Countly.q.push([trackerName]) )

		Countly.init()
		Vue.prototype.$countly = Countly
		app.$countly = Countly

		// Execute registered callbacks
		_Countly.isLoaded = true
		onCountlyLoadCallers.forEach( cb => cb() )
	}


	// Wait until tracker script is loaded
	let counter = opt.cancelCheckingAfter
	const areWeThereYet = w.setInterval(
		() => {
			if (!!w['Countly']) {
				onScriptLoaded()
			}
			(counter--) || timeout()
		},
		opt.interval
	)

	function timeout() {
		w.clearInterval(areWeThereYet)
		console.log(new ReferenceError('Tracker script load timed out'))
	}


	Vue.prototype.$track = function(action, data) {
		if (typeof action !== 'string') return console.error(`action is not string, type: ${typeof action}`)
		if (action === 'add_event' && typeof data.key !== 'string')
			return console.error(`data.key is not string, type: ${typeof action}`)

		this.$countly.q.push([action, data])
	}
}
