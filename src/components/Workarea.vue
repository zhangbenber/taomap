<template>
	<div class="f-fs">
		<div class="scroll f-fs" ref="scroll" @scroll="resize">
			<div v-if="viewport && image" :style="{
					width: `${(image.width * origin.scale < viewport.width) ? 1 : image.width * origin.scale + 50}px`,
					height: `${(image.height * origin.scale < viewport.height) ? 1 : image.height * origin.scale + 50}px`}">
			</div>
		</div>
		<div :class="['box', `t-${store.activeTool}`, {
				hand: this.store.auxKey.space,
				grabbing: this.store.auxKey.space && doc.mouse.isDown
			}]" v-if="viewport && image" :style="{
				width: `${viewport.width}px`,
				height: `${viewport.height}px`
			}" @mouseleave="dispatch('mouse', null)">
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
		pos: [0, 0]
	}),

	methods: {
		mouseAction(e) {
			let { viewport, image, doc, store, origin } = this
			let { auxKey } = store
			let { mouse } = doc

			let cord = [
				Math.round((e.offsetX - origin.x) / origin.scale),
				Math.round((e.offsetY - origin.y) / origin.scale)
			]

			let dx = e.offsetX - this.pos[0]
			let dy = e.offsetY - this.pos[1]

			this.pos = [e.offsetX, e.offsetY]
			
			let isDown
			if (e.type === 'mousedown') {
				isDown = true
			} else if (e.type === 'mouseup') {
				isDown = false
			}
			this.dispatch('mouse', cord, isDown)

			if (mouse.isDown && auxKey.space) {
				this.$refs.scroll.scrollLeft -= dx
				this.$refs.scroll.scrollTop -= dy
			}
		}
	},

	mounted() {
		this.$root.$on('keyEvent', (e) => {
			if (e.type === 'keydown') {
				if (e.keyCode === 187) {
					this.zoom('in')
				} else if (e.keyCode === 189) {
					this.zoom('out')
				}
			}
		})

		this.$root.$on('resizeEvent', (e) => {
			this.resize()
		})

		this.resize()
	},

	beforeDestroy() {
		this.$root.$off('keyEvent')
		this.$root.$off('resizeEvent')
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
		&.t-poly, &.t-rect { cursor: crosshair; }
		&.hand { cursor: grab; }
		&.grabbing { cursor: grabbing; }
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
