import clone from 'deep-clone'

let newDocument = () => ({
	mouseCord: null,
	history: [],
	historyStep: -1,
	state: {},
	action: null
})

let store = {
	activeTool: 'sel',
	auxKey: {},
	documents: [newDocument()],
	activeDocument: 0
}

let actions = {
	changeTool(tool) {
		this.store.activeTool = tool
	},

	auxKey(key, isDown) {
		this.$set(this.store.auxKey, key, isDown)
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
