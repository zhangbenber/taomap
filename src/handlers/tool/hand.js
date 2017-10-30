let mouseEvent = function (e, isDown, pos, delta) {
	if (isDown === true || isDown === false) {
		this.dispatch('setCursor', isDown ? 'hand-down' : 'hand')
	}

	if (this.doc.mouse.isDown) {
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
		this.dispatch('showTarget', false)
		this.$root.$on('mouseEvent', mouseEvent)
	},
	deactive() {
		this.$root.$off('mouseEvent', mouseEvent)
	}
}