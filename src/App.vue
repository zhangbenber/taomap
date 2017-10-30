<template>
	<div id="app" :dir="i18n('__rtl__') === true ? 'rtl' : 'ltr'">
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
		this.keyboardListener = (e) => {
			let isDown = (e.type === 'keydown')
			let code = e.keyCode
			let char = String.fromCharCode(code).toLowerCase()
			if (code == 18) {
				e.preventDefault()
			}
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
					let tool = tools.find(i => i.shotcut === char)
					if (tool) {
						this.dispatch('changeTool', tool.id)
					} else {
						let direction = code - 37
						let offset = [[-1, 0], [0, -1], [1, 0], [0, 1]][direction]
						if (offset) {
							this.dispatch('adjustTarget', offset)
						}
					}
				}
			}

			this.$root.$emit('keyEvent', e, isDown, code, char)
		}

		this.blurListener = (e) => {
			this.$root.$emit('blurEvent', e)
			this.dispatch('escapeState')
		}

		this.resizeListener = (e) => {
			this.$root.$emit('resizeEvent', e)
		}

		window.addEventListener('keydown', this.keyboardListener)
		window.addEventListener('keyup', this.keyboardListener)
		window.addEventListener('blur', this.blurListener)
		window.addEventListener('resize', this.resizeListener)
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.keyboardListener)
		window.removeEventListener('keyup', this.keyboardListener)
		window.removeEventListener('blur', this.blurListener)
		window.removeEventListener('resize', this.resizeListener)
	},

}
</script>

<style lang="less">
	@import 'app.less';
</style>