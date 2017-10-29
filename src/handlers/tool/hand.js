let mouseEvent = function (e, pos, delta) {
	let { doc, store } = this
	let { mouse } = doc

	this.dispatch('setCursor', mouse.isDown ? 'hand-down' : 'hand')
	if (mouse.isDown) {
		if (!this.$root.workarea) {
			return
		}
		let scroll = this.$root.workarea.$refs.scroll
		scroll.scrollLeft -= delta[0]
		scroll.scrollTop -= delta[1]
	}
}

export default {
	active() {
		console.log('Hand active')
		this.dispatch('setCursor', 'hand')
		this.$root.$on('mouseEvent', mouseEvent)
	},
	deactive() {
		console.log('Hand deactive')
		this.$root.$off('mouseEvent', mouseEvent)
	}
}