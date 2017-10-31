import clone from 'deep-clone'
import * as polygon from '@/utils/polygon'

let interaction = null
let mapArea = -1

let mouseEvent = function (e, isDown, pos, delta) {
	let { store, doc } = this
	let { mouse } = doc

	let mouseCord = mouse.cord.map((v, i) => v + mouse.offset[i])

	if (!doc.state.maps[mapArea] || !polygon.hintMap(doc, mapArea, mouse.cord)) {
		let newMapArea = polygon.hintMaps(doc, mouse.cord)
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
			if (store.auxKey.ctrl) {
				let newMaps = doc.selectedObjects.maps.slice()
				let oldIndex = newMaps.indexOf(mapArea)
				if (oldIndex > -1) {
					newMaps.splice(oldIndex, 1)
				} else {
					newMaps.push(mapArea)
				}
				this.dispatch('selectObjects', {
					maps: newMaps
				}, true)
			} else {
				if (doc.selectedObjects.maps.indexOf(mapArea) < 0) {
					this.dispatch('selectObjects', {
						maps: [mapArea]
					}, !store.auxKey.shift)
				}
			}
			if (!store.auxKey.ctrl && !store.auxKey.shift && doc.selectedObjects.maps.length) {
				let origin = []
				doc.state.maps.forEach((map, i) => {
					if (doc.selectedObjects.maps.indexOf(i) > -1) {
						origin.push(clone(map))
						this.$set(map, 'hide', true)
					}
				})
				interaction = {
					type: 'moveMaps',
					startCord: mouseCord,
					origin
				}
			}
		} else {
			this.dispatch('selectObjects', {}, true)
			interaction = {
				type: 'newRect',
				startCord: mouseCord
			}
		}
	}

	if (mouse.isDown) {
		switch (interaction && interaction.type) {
			case 'newRect': {
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

			case 'moveMaps': {
				let startCord = interaction.startCord
				let deltaX = mouseCord[0] - startCord[0]
				let deltaY = mouseCord[1] - startCord[1]
				interaction.maps = interaction.origin.map(map => {
					let m = clone(map)
					if (m.rect) {
						m.rect[0] += deltaX
						m.rect[1] += deltaY
						m.rect[2] += deltaX
						m.rect[3] += deltaY
					}else if (m.circle) {
						m.rect[0] += deltaX
						m.rect[1] += deltaY
					}
					if (m.poly) {
						m.poly.forEach(v => {
							v[0] += deltaX
							v[1] += deltaY
						})
					}
					return m
				})
				this.dispatch('updateInteraction', interaction)
				break
			}
		}
	}

	if (isDown === false) {
		switch (interaction && interaction.type) {
			case 'newRect': {
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

			case 'moveMaps': {
				this.dispatch('removeSelectedMaps')
				this.commit('submitInteracting', {
					desc: 'history.movemap',
					icon: '\ueb52'
				})
				this.dispatch('selectObjects', {
					maps: Array(interaction.maps.length).fill().map(
						(a, i) => doc.state.maps.length - i - 1
					)
				})
				interaction = null
				break
			}
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