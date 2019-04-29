<script>
export default {

	asyncData: function(context) {
		let $countly = context.app.$countly
	}

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
}
</script>
