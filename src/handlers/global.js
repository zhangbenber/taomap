import tools from '@/constants/tools'
import shotcuts from '@/constants/shotcuts'
import * as toolHandlers from './tool'

let tempSelecting = false

let mouseEvent = function (e, isDown) {

}

let keyEvent = function (e, isDown, code, char) {
	let { store, doc } = this
	if (isDown) {
		let auxCount = Object.values(store.auxKey).filter(i => i).length

		// Zooming
		let zooming = {
			187: 'in',
			189: 'out',
			49: 1,
			48: 'fit'
		}[code]
		if (zooming) {
			this.$root.workarea.zoom(zooming)
			e.preventDefault()

		// Global shotcuts
		} else if (auxCount > 0) {
			let shotcut = shotcuts.find(item => {
				let aux = item.key.slice(0, -1)
				let primary = item.key[item.key.length - 1]
				return (primary === char)
					&& (aux.length == auxCount)
					&& (!aux.some(i => !store.auxKey[i]))
			})
			if (shotcut) {
				e.preventDefault()
				shotcut.callback.call(this)
			}

		// Deletion
		} else if (code === 46) {
			if (doc.selectedObjects.maps.length) {
				this.commit('deleteSelectedMaps')
			}
			e.preventDefault()

		// Tool shotcuts
		} else {
			let tool = tools.find(i => i.shotcut === char)
			if (tool) {
				this.dispatch('changeTool', tool.id)
				e.preventDefault()

			// Adjust Target
			} else {
				let direction = code - 37
				let offset = [[-1, 0], [0, -1], [1, 0], [0, 1]][direction]
				if (offset) {
					this.dispatch('adjustTarget', offset)
					e.preventDefault()
				}
			}
		}
	}
}

export default {
	active() {
		tempSelecting = false
		this.$root.$on('mouseEvent', mouseEvent)
		this.$root.$on('keyEvent', keyEvent)
	},
	suspend() {
		this.$root.$off('mouseEvent', mouseEvent)
		this.$root.$off('keyEvent', keyEvent)
	}
}