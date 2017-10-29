import clone from 'deep-clone'
import * as toolHandlers from './handlers/tool'

let newDocument = () => ({
	history: [],
	historyStep: -1,
	state: {
		image: null,
		maps: [],
		slices: []
	},
	mouse: {
		onScreen: false,
		isDown: false,
		cord: null,
		offset: [0, 0],
		snapped: [false, false],
		cursor: ''
	},
	action: null
})

let store = {
	activeTool: 'sel',
	auxKey: {},
	documents: [newDocument()],
	activeDocument: 0
}

let actions = {
	auxKey(key, isDown) {
		if (this.store.auxKey[key] == isDown) {
			return
		}
		this.$set(this.store.auxKey, key, isDown)
		if (key == 'space') {
			if (this.store.activeTool == 'hand') {
				return
			}
			let oldHandler = toolHandlers[this.store.activeTool]
			if (isDown) {
				if (oldHandler && oldHandler.suspend) {
					oldHandler.suspend.call(this)
				}
				toolHandlers.hand.active.call(this)
			} else {
				toolHandlers.hand.deactive.call(this)
				if (oldHandler && oldHandler.active) {
					oldHandler.active.call(this)
				}
			}
		}
	},

	escapeState() {
		this.dispatch('mouse', null)
		Object.keys(this.store.auxKey).forEach(key => {
			this.$set(this.store.auxKey, key, false)
		})
	},

	mouse(cord, isDown) {
		let { mouse } = this.doc
		if (!cord) {
			mouse.onScreen = false
			mouse.isDown = false
		} else {
			mouse.onScreen = true
			mouse.cord = cord
		}
		if (isDown !== undefined) {
			mouse.isDown = isDown
		} else {
			mouse.offset = [0, 0]
			mouse.snapped = [false, false]
		}
	},

	setCursor(cursor) {
		this.doc.mouse.cursor = cursor
	},

	adjustCursor(offset) {
		let { mouse } = this.doc
		mouse.offset = mouse.offset.map((o, i) => Math.min(Math.max(o + offset[i], -5), 5))
		mouse.snapped = [false, false]
	},

	changeTool(tool) {
		let oldHandler = toolHandlers[this.store.activeTool]
		if (oldHandler && oldHandler.suspend) {
			oldHandler.suspend.call(this)
		}
		if (oldHandler && oldHandler.deactive) {
			oldHandler.deactive.call(this)
		}
		this.store.activeTool = tool
		let newHandler = toolHandlers[tool]
		if (newHandler && newHandler.active) {
			newHandler.active.call(this)
		}
	},

	browseImage() {
		let input = document.createElement('input')
		input.type = 'file'
		input.accept = 'image/*'
		input.onchange = () => {
			let img = new Image()
			img.onload = () => {
				this.commit('loadImage', img)
				img = null
			}
			img.src = URL.createObjectURL(input.files[0])
			input = null
		}
		input.click()
	},

	undo() {
		this.dispatch('goHistory', this.doc.historyStep - 1)
	},

	redo() {
		this.dispatch('goHistory', this.doc.historyStep + 1)
	},

	goHistory(index) {
		let { doc } = this
		if (doc.history[index] && doc.history[index].historyMeta.live) {
			doc.historyStep = index
			doc.state = doc.history[doc.historyStep]
		}
	}
}

let modifiers = {
	loadImage(state, image) {
		state.image = image
		return {
			desc: 'Open',
			icon: '\ue6f0'
		}
	}
}

export default {
	data: () => ({ store }),

	methods: {
		dispatch(type) {
			let action = actions[type]
			if (!action) {
				console.warn(`Undefined mutation type \`${type}\``)
			} else {
				action.apply(this, Array.prototype.slice.call(arguments, 1))
			}
		},

		commit(type) {
			let modifier = modifiers[type]
			if (!modifier) {
				console.warn(`Undefined commit type \`${type}\``)
			} else {

				let { doc } = this
				let state = clone(doc.state)
				doc.history = doc.history.slice(0, ++doc.historyStep)
				let payload = Array.prototype.slice.call(arguments, 1)
				payload.unshift(state)
				let meta = modifier.apply(this, payload)
				state.historyMeta = Object.assign({
					time: new Date().getTime(),
					live: true
				}, (meta || {}))

				doc.history.push(state)
				doc.state = state
			}
		}
	},

	computed: {
		doc() {
			return this.store.documents[this.store.activeDocument]
		}
	}
}
