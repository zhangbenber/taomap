let mouseEvent = function (e, isDown, pos, delta) {

}

let keyEvent = function (e, isDown, code, char) {

}

export default {
	active() {
		this.dispatch('setCursor', 'default')
		this.dispatch('showTarget', false)
		this.$root.$on('mouseEvent', mouseEvent)
		this.$root.$on('keyEvent', keyEvent)
	},
	suspend() {
		this.$root.$off('mouseEvent', mouseEvent)
		this.$root.$off('keyEvent', keyEvent)
	}
}