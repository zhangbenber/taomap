<template>
	<div class="f-fs">
		<div class="scroll f-fs" ref="scroll" @scroll="resize">
			<div v-if="viewport && image" :style="{
					width: `${(image.width * origin.scale < viewport.width) ? 1 : image.width * origin.scale + 50}px`,
					height: `${(image.height * origin.scale < viewport.height) ? 1 : image.height * origin.scale + 50}px`}">
			</div>
		</div>
		<div :class="['box', {
				hand: this.store.auxKey.space,
				grabbing: this.store.auxKey.space && mouse.isDown
			}]" v-if="viewport && image" :style="{
				width: `${viewport.width}px`,
				height: `${viewport.height}px`
			}"
			@mouseenter="mouse.onScreen = true" @mouseleave="mouse.onScreen = false">
			<canvas :width="viewport.width" :height="viewport.height" ref="canvas"
				@mousedown="mouseAction" @mousemove="mouseAction" @mouseup="mouseAction" />
		</div>
		<div v-else class="load f-tac">
			<p>Start from Loading a New Image</p>
			<button class="i-btn i-btn-b f-mtn f-mbn" @click="dispatch('browseImage')">Import Image</button>
			<p><a href="#" class="f-link">Open an existing project</a></p>
		</div>
	</div>
</template>

<script>
import Painter from '../mixins/Painter'

export default {
	name: 'Workarea',
	mixins: [Painter],

	data: () => ({
		mouse: {
			onScreen: false,
			isDown: false,
			pos: [0, 0]
		}
	}),

	methods: {
		mouseAction(e) {
			let { viewport, origin, image, mouse, store } = this
			let { auxKey } = store

			let cord = [
				Math.round((e.offsetX - origin.x) / origin.scale),
				Math.round((e.offsetY - origin.y) / origin.scale)
			]

			let dx = e.offsetX - mouse.pos[0]
			let dy = e.offsetY - mouse.pos[1]
			mouse.pos[0] = e.offsetX
			mouse.pos[1] = e.offsetY

			this.$emit('move', cord)
			
			if (e.type === 'mousedown') {
				mouse.isDown = true
			} else if (e.type === 'mouseup') {
				mouse.isDown = false
			}

			if (e.type === 'mousemove' && mouse.isDown && auxKey.space) {
				this.$refs.scroll.scrollLeft -= dx
				this.$refs.scroll.scrollTop -= dy
			}
		}
	},

	watch: {
		'mouse.onScreen': function(on) {
			if (!on) {
				this.$emit('move', null)
			}
		}
	},

	mounted() {
		this.keyboardAction = (e) => {
			if (e.type === 'keydown') {
				if (e.keyCode === 187) {
					this.zoom('in')
				} else if (e.keyCode === 189) {
					this.zoom('out')
				}
			}
		}

		this.resizeListener = (e) => {
			this.resize()
		}

		window.addEventListener('keydown', this.keyboardAction)
		window.addEventListener('keyup', this.keyboardAction)
		window.addEventListener('resize', this.resizeListener)
		this.resize()
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.keyboardAction)
		window.removeEventListener('keyup', this.keyboardAction)
		window.removeEventListener('resize', this.resizeListener)
	}
}
</script>

<style lang="less" scoped>
	@import '../common.less';
	
	.scroll {
		overflow: scroll;
		background: @majorBackground;
	}
	.box {
		cursor: crosshair;
		&.hand {
			cursor: grab;
		}
		&.grabbing {
			cursor: grabbing;
		}
	}
	canvas {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
	}
	.load {
		position: relative;
		z-index: 1;
		top: 50%;
		transform: translateY(-65px);
	}
</style>
