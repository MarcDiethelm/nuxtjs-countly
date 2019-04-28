export default (ctx, inject) => {

    if (!window['Countly']) {
		console.error(new ReferenceError('Global var Countly is not defined. Did the tracker script load?'))
        return
    }

    const Countly = window['Countly']
    Countly.q = Countly.q || []
    Countly.app_key = '<%= options.app_key %>'
    Countly.url = '<%= options.url %>'

    const trackers = <%= options._trackers %>
    trackers.forEach(function(tracker) {
        Countly.q.push([tracker])
    })

    Countly.init()
    ctx.$countly = Countly
    inject('countly', Countly)
}
