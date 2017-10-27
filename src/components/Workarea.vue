<template>
	<div class="f-fs">
		<div class="scroll f-fs" ref="scroll" @scroll="resize">
			<div v-if="viewport && image"
				:style="{width: `${image.width * origin.scale}px`, height: `${image.height * origin.scale}px`}">
			</div>
		</div>
		<div class="box" v-if="viewport && image" :style="{
				width: `${viewport.width}px`,
				height: `${viewport.height}px`,
				cursor: move.isHand ? 'move' : 'crosshair'
			}"
			@keydown.space="move.isHand = true" @keyup.space="move.isHand = false">
			<canvas :width="viewport.width" :height="viewport.height" ref="canvas"
				@mousedown="mouseAction" @mousemove="mouseAction" @mouseup="mouseAction" />
		</div>
		<div v-else @click="$emit('load')" class="load">Load Image</div>
	</div>
</template>

<script>
export default {
	name: 'Workarea',

	props: {
		image: HTMLImageElement
	},

	data: () => ({
		viewport: null,
		origin: {
			x: 0,
			y: 0,
			scale: 5
		},
		move: {
			isMousedown: false,
			isHand: false
		}
	}),

	methods: {
		repaint() {
			if (this.dirty) {
				return
			}
			this.dirty = true
			this.$nextTick(() => {
				this.draw()
			})
		},

		resize() {
			this.viewport = {
				width: this.$refs.scroll.clientWidth,
				height: this.$refs.scroll.clientHeight
			}
			if (this.image) {
				this.origin.x = -this.$refs.scroll.scrollLeft
				this.origin.y = -this.$refs.scroll.scrollTop
				this.repaint()
			}
		},

		mouseAction(e) {
			let { viewport, origin, image, move } = this

			let cord = {
				x: Math.round((e.offsetX - origin.x) / origin.scale),
				y: Math.round((e.offsetY - origin.y) / origin.scale)
			}

			let dx = e.offsetX - this.oldMouseX
			let dy = e.offsetY - this.oldMouseY
			this.oldMouseX = e.offsetX
			this.oldMouseY = e.offsetY
			
			if (e.type === 'mousedown') {
				move.isMousedown = true
			} else if (e.type === 'mouseup') {
				move.isMousedown = false
			}
			if (e.type === 'mousemove' && move.isMousedown && move.isHand) {
				this.$refs.scroll.scrollLeft -= dx
				this.$refs.scroll.scrollTop -= dy
			}
		},

		draw() {
			let { viewport, origin, image } = this

			let back = this.$refs.canvas.getContext('2d')
			back.clearRect(0, 0, viewport.width, viewport.height)

			let imageSmoothingEnabled = origin.scale < 1
			back.mozImageSmoothingEnabled = imageSmoothingEnabled
			back.webkitImageSmoothingEnabled = imageSmoothingEnabled
			back.msImageSmoothingEnabled = imageSmoothingEnabled
			back.imageSmoothingEnabled = imageSmoothingEnabled

			let sx = Math.max(0, Math.floor(-origin.x / origin.scale))
			let sy = Math.max(0, Math.floor(-origin.y / origin.scale))
			let sw = Math.min(image.width - sx, Math.ceil(viewport.width / origin.scale) + 1)
			let sh = Math.min(image.height - sy, Math.ceil(viewport.height / origin.scale) + 1)
			back.drawImage(image, sx, sy, sw, sh,
				origin.x + sx * origin.scale, origin.y + sy * origin.scale,
				sw * origin.scale, sh * origin.scale)

			this.dirty = false
			this.$nextTick(() => {
				if (this.dirty) {
					this.draw()
				}
			})
		}
	},

	mounted() {
		this.$nextTick(() => {
			this.resize()
		})
		this.keyboardAction = (e) => {
			if (e.keyCode === 32) {
				this.move.isHand = (e.type === 'keydown')
			}
		}
		window.addEventListener('keydown', this.keyboardAction)
		window.addEventListener('keyup', this.keyboardAction)
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.keyboardAction)
		window.removeEventListener('keyup', this.keyboardAction)
	},

	watch: {
		image: function () {
			this.$nextTick(() => {
				this.resize()
			})
		}
	}
}
</script>

<style lang="less" scoped>
	.scroll {
		overflow: scroll;
		background: #282828;
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
	}
</style>
