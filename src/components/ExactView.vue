<template>
	<div class="f-fs">
		<div class="scroll" ref="scroll">
			<div class="box" v-if="viewport && image" :style="{
					width: `${viewport.width}px`,
					height: `${viewport.height}px`
				}" v-show="mouse.onScreen">
				<canvas :width="viewport.width" :height="viewport.height" ref="back" />
				<canvas :width="viewport.width" :height="viewport.height"
					ref="grid" class="grid" />
				<canvas :width="viewport.width" :height="viewport.height" ref="front" />
				<canvas width="100" height="100" ref="target" class="target"
					:style="{
						left: `${~~(viewport.width / 2 - 50)}px`,
						top: `${~~(viewport.height / 2 - 50)}px`,
						transform: `translate(${
							mouse.offset[0] * origin.scale
						}px, ${
							mouse.offset[1] * origin.scale
						}px)`
					}" v-show="doc.mouse.showTarget" />
			</div>
			<div  v-else class="load f-tac">
				<p class="f-sub">{{ i18n('exactview.noimage') }}</p>
			</div>
		</div>
	</div>
</template>

<script>
import Painter from '../mixins/Painter'

export default {
	name: 'ExactView',
	mixins: [Painter],

	methods: {
		drawTarget() {
			let offset = this.mouse.offset

			let element = this.$refs.target
			if (!element) {
				return
			}
			let target = element.getContext('2d')
			
			target.lineCap = 'round'
			let arr = [
				[50, 0, 50, 100],
				[0, 50, 100, 50]
			]

			target.beginPath()
			arr.forEach((i, index) => {
				target.moveTo(i[0], i[1])
				target.lineTo(i[2], i[3])
			})
			target.lineWidth = 4
			target.strokeStyle = '#fff'
			target.stroke()

			target.lineWidth = 2
			if (offset[0] !== null && offset[1] === null) {
				arr[2] = arr[0]
			}
			arr.forEach((i, index) => {
				target.beginPath()
				target.moveTo(i[0], i[1])
				target.lineTo(i[2], i[3])
				target.strokeStyle = this.mouse.snapped[index % 2] ? '#c00' : '#000'
				target.stroke()
			})
		},

		afterResize() {
			// Draw grids
			let { viewport, origin, image } = this
			let grid = this.$refs.grid.getContext('2d')
			grid.clearRect(0, 0, viewport.width, viewport.height)
			let offset = [(-viewport.width / 2) % origin.scale - .5, (-viewport.height / 2) % origin.scale - .5]
			let count = [~~(viewport.width / origin.scale + 1), ~~(viewport.height / origin.scale + 1)]

			grid.strokeStyle = '#fff'
			grid.beginPath()
			Array(count[0]).fill().forEach((ignore, i) => {
				grid.moveTo(origin.scale * i - offset[0], 0)
				grid.lineTo(origin.scale * i - offset[0], viewport.height)
			})
			Array(count[1]).fill().forEach((ignore, i) => {
				grid.moveTo(0, origin.scale * i - offset[1])
				grid.lineTo(viewport.width, origin.scale * i - offset[1])
			})
			grid.stroke()
			
			grid.strokeStyle = '#000'
			grid.beginPath()
			Array(count[0]).fill().forEach((ignore, i) => {
				grid.moveTo(origin.scale * i - 1 - offset[0], 0)
				grid.lineTo(origin.scale * i - 1 - offset[0], viewport.height)
			})
			Array(count[1]).fill().forEach((ignore, i) => {
				grid.moveTo(0, origin.scale * i - offset[1] - 1)
				grid.lineTo(viewport.width, origin.scale * i - offset[1] - 1)
			})
			grid.stroke()
			this.drawTarget()
		}
	},

	computed: {
		mouse() {
			return this.doc.mouse
		},
		pos() {
			return this.mouse.cord
		},
		targetFlag() {
			return [...this.mouse.offset, ...this.mouse.snapped]
		}
	},

	mounted() {
		this.origin.scale = 15
		this.$nextTick(() => {
			this.resize()
		})
	},
	
	watch: {
		pos(p) {
			if (!p) {
				return
			}
			let { origin, viewport } = this
			origin.x = -origin.scale * p[0] + viewport.width / 2
			origin.y = -origin.scale * p[1] + viewport.height / 2
			this.repaint()
		},

		targetFlag: function() { this.drawTarget() },
	}
}
</script>

<style lang="less" scoped>
	@import '../common.less';
	.scroll {
		position: absolute;
		left: 5px;
		top: 5px;
		right: 5px;
		bottom: 5px;
		border: 1px solid @subBorder;
		background: @subBackground;
	}
	canvas {
		display: block;
		position: absolute;
		left: 0;
		top: 0;
	}
	.grid {
		opacity: .12;
	}
	.target {
		opacity: .5;
		transition: transform .075s;
	}
	.load {
		position: relative;
		z-index: 1;
		top: 50%;
		transform: translateY(-10px);
	}
</style>
