export default (ctx, inject) => {
    var Countly = window['Countly']
    if (!window['Countly']) {
        console.warn('Countly not loaded.')
        return
    }

    Countly.q = Countly.q || []
    Countly.app_key = '<%= options.app_key %>'
    Countly.url = '<%= options.url %>'

    const trackers = <%= options._trackers %>
    trackers.forEach(function(tracker) {
        Countly.q.push([tracker])
    })

    Countly.init()
    ctx.$countly = Countly
    inject('Countly', Countly)
}
