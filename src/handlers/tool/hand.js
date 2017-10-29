let mouseEvent = function (e, isDown, pos, delta) {
	let { mouse } = this.doc

	if (isDown === true || isDown === false) {
		this.dispatch('setCursor', isDown ? 'hand-down' : 'hand')
	}

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
		this.dispatch('setCursor', 'hand')
		this.$root.$on('mouseEvent', mouseEvent)
	},
	deactive() {
		this.$root.$off('mouseEvent', mouseEvent)
	}
}