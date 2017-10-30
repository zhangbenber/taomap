import * as polygon from '@/utils/polygon'

let interaction = null
let mapArea = -1

let mouseEvent = function (e, isDown, pos, delta) {
	let { mouse } = this.doc

	let mouseCord = mouse.cord.map((v, i) => v + mouse.offset[i])

	if (!this.doc.state.maps[mapArea] || !polygon.hintTest(this.doc.state.maps[mapArea], mouse.cord)) {
		let newMapArea = polygon.findIndex(this.doc.state.maps, mouse.cord)
		if (newMapArea != mapArea) {
			if (newMapArea > -1) {
				this.dispatch('setCursor', 'default')
			} else {
				this.dispatch('setCursor', 'cross')
			}
			mapArea = newMapArea
		}
	}

	if (isDown) {
		if (mapArea > -1) {
			this.dispatch('selectObjects', {
				maps: [mapArea]
			}, true)
			return
		}
		interaction = {
			type: 'newRect',
			startCord: mouseCord
		}
		this.dispatch('selectObjects', {}, true)
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
		switch (interaction && interaction.type) {
			case 'newRect':
				let rect = interaction.maps[0].rect
				if (!rect || rect[0] == rect[2] || rect[1] == rect[3]) {
					this.dispatch('updateInteraction')
				} else {
					this.commit('submitInteracting', {
						desc: 'history.newrect',
						icon: '\ueb52'
					})
					this.dispatch('selectObjects', {
						maps: [this.doc.state.maps.length - 1]
					})
				}
				interaction = null
				break
		}
	}

}

let keyEvent = function (e, isDown, code, char) {
	if (code) {
		mouseEvent.call(this)
	}
}

export default {
	active() {
		this.dispatch('setCursor', 'cross')
		this.dispatch('showTarget', true)
		mapArea = -1
		this.$root.$on('mouseEvent', mouseEvent)
		this.$root.$on('keyEvent', keyEvent)
	},
	suspend() {
		this.$root.$off('mouseEvent', mouseEvent)
		this.$root.$off('keyEvent', keyEvent)
	}
}