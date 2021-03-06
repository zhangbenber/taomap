let mouseEvent = function (e, isDown) {
	if (isDown) {
		if (!this.$root.workarea) {
			return
		}
		this.$root.workarea.zoom(this.store.auxKey.alt ? 'out' : 'in')
	}
}

let keyEvent = function (e, isDown, code, char) {
	this.dispatch('setCursor', this.store.auxKey.alt ? 'zoom-out' : 'zoom-in')
}

export default {
	active() {
		this.dispatch('setCursor', 'zoom-in')
		this.dispatch('showTarget', false)
		this.$root.$on('mouseEvent', mouseEvent)
		this.$root.$on('keyEvent', keyEvent)
	},
	suspend() {
		this.$root.$off('mouseEvent', mouseEvent)
		this.$root.$off('keyEvent', keyEvent)
	}
}