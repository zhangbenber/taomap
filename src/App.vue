<template>
	<div id="app">
		<Editor :doc="doc" />
	</div>
</template>

<script>
import Editor from './components/Editor'

import tools from './constants/tools'
import auxKeys from './constants/auxKeys'
import shotcuts from './constants/shotcuts'

export default {
	name: 'App',
	
	components: {
		Editor
	},
	
	mounted() {
		this.keyboardAction = (e) => {
			let isDown = (e.type === 'keydown')
			let code = e.keyCode
			let char = String.fromCharCode(code).toLowerCase()
			
			console.log(code)
			let auxKey = auxKeys[code]
			if (auxKey) {
				this.dispatch('auxKey', auxKey, isDown)
			}

			if (isDown) {
				let auxCount = Object.values(this.store.auxKey).filter(i => i).length
				if (auxCount > 0) {
					let shotcut = shotcuts.find(item => {
						let aux = item.key.slice(0, -1)
						let primary = item.key[item.key.length - 1]
						return (primary === char)
							&& (aux.length == auxCount)
							&& (!aux.some(i => !this.store.auxKey[i]))
					})
					if (shotcut) {
						e.preventDefault()
						shotcut.callback.call(this)
					}
				} else {
					let tool = tools.find(i => i.shotcut == char)
					if (tool) {
						this.dispatch('changeTool', tool.id)
					}
				}
			}
		}

		window.addEventListener('keydown', this.keyboardAction)
		window.addEventListener('keyup', this.keyboardAction)
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.keyboardAction)
		window.removeEventListener('keyup', this.keyboardAction)
	},

}
</script>

<style lang="less">
	@import 'app.less';
</style>