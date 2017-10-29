<template>
	<div class="f-fs">
		<div class="scroll f-fs" ref="scroll" @scroll="resize">
			<div v-if="viewport && image" :style="{
					width: `${(image.width * origin.scale < viewport.width) ? 1 : image.width * origin.scale + 50}px`,
					height: `${(image.height * origin.scale < viewport.height) ? 1 : image.height * origin.scale + 50}px`}">
			</div>
		</div>
		<div :class="['box', `cursor-${doc.mouse.cursor}`]"
			v-if="viewport && image" :style="{
				width: `${viewport.width}px`,
				height: `${viewport.height}px`
			}" @mouseleave="dispatch('mouse', null)">
			<canvas :width="viewport.width" :height="viewport.height" ref="back" />
			<canvas :width="viewport.width" :height="viewport.height" ref="front"
				@mousedown="mouseAction" @mousemove="mouseAction" @mouseup="mouseAction" />
		</div>
		<div v-else class="load f-tac">
			<p>{{ i18n('welcome.start') }}</p>
			<button class="i-btn i-btn-b f-mtn f-mbn" @click="dispatch('browseImage')">{{ i18n('welcome.import') }} <span class="f-sub">&lt;Ctrl+I&gt;</span></button>
			<p><a href="#" class="f-link">{{ i18n('welcome.open') }}</a></p>
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
			this.$root.$emit('mouseEvent', e, isDown, this.pos, [dx, dy])
		}
	},

	mounted() {
		this.keyEvent = (e, isDown, code) => {
			if (isDown) {
				let zooming = {
					187: 'in',
					189: 'out',
					49: 1,
					48: 'fit'
				}[code]
				if (zooming) {
					this.zoom(zooming)
					e.preventDefault()
				}
			}
		}

		this.resizeEvent = (e) => {
			this.resize()
		}

		this.$root.$on('keyEvent', this.keyEvent)
		this.$root.$on('resizeEvent', this.resizeEvent)
		this.$root.workarea = this
		
		this.resize()
	},

	beforeDestroy() {
		this.$root.$off('keyEvent', this.keyEvent)
		this.$root.$off('resizeEvent', this.resizeEvent)
		this.$root.workarea = null
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
		&.cursor-default { cursor: default; }
		&.cursor-cross { cursor: crosshair; }
		&.cursor-hand { cursor: grab; }
		&.cursor-hand-down { cursor: grabbing; }
		&.cursor-zoom-in { cursor: zoom-in; }
		&.cursor-zoom-out { cursor: zoom-out; }
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
