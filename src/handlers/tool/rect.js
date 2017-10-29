let interaction = null

let mouseEvent = function (e, isDown, pos, delta) {
	let { mouse } = this.doc

	let mouseCord = mouse.cord.map((v, i) => v + mouse.offset[i])

	if (isDown) {
		let x = mouse.cord[0], y = mouse.cord[1]
		interaction = {
			type: 'newRect',
			startCord: [x, y]
		}
	}

	if (mouse.isDown) {
		switch (interaction && interaction.type) {
			case 'newRect':
				let startCord = interaction.startCord
				let leftTop = [
					Math.min(interaction.startCord[0], mouseCord[0]),
					Math.min(interaction.startCord[1], mouseCord[1])
				]
				let bottomRight = [
					Math.max(interaction.startCord[0], mouseCord[0]),
					Math.max(interaction.startCord[1], mouseCord[1])
				]
				interaction.maps = [{
					rect: leftTop.concat(bottomRight),
					poly: [leftTop, [bottomRight[0], leftTop[1]], bottomRight, [leftTop[0], bottomRight[1]]]
				}]
				this.dispatch('updateInteraction', interaction)
				break
		}
	}

	if (isDown === false) {
		if (interaction) {
			this.commit('submitInteracting', {
				desc: 'Create Rect Map Area',
				icon: '\ueb52'
			})
			interaction = null
		}
	}

}

let keyEvent = function (e, isDown, code, char) {

}

export default {
	active() {
		this.dispatch('setCursor', 'cross')
		this.$root.$on('mouseEvent', mouseEvent)
		this.$root.$on('keyEvent', keyEvent)
	},
	suspend() {
		this.$root.$off('mouseEvent', mouseEvent)
		this.$root.$off('keyEvent', keyEvent)
	}
}