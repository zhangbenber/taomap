<template>
	<div id="app" :dir="i18n('__rtl__') === true ? 'rtl' : 'ltr'">
		<Editor :doc="doc" />
	</div>
</template>

<script>
import Editor from './components/Editor'

import auxKeys from './constants/auxKeys'
import globalHandler from './handlers/global'

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
		globalHandler.active && globalHandler.active.call(this)
		this.dispatch('changeTool', this.store.activeTool)
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.keyboardListener)
		window.removeEventListener('keyup', this.keyboardListener)
		window.removeEventListener('blur', this.blurListener)
		window.removeEventListener('resize', this.resizeListener)
		this.dispatch('changeTool', this.store.activeTool)
		globalHandler.suspend && globalHandler.suspend.call(this)
		globalHandler.deactive && globalHandler.deactive.call(this)
	},

}
</script>

<style lang="less">
	@import 'app.less';
</style>