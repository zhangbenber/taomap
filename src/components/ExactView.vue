<template>
	<div class="f-fs">
		<div class="scroll" ref="scroll">
			<div class="box" v-if="viewport && image" :style="{
					width: `${viewport.width}px`,
					height: `${viewport.height}px`
				}">
				<canvas :width="viewport.width" :height="viewport.height"
					ref="canvas" v-show="!!pos" />
			</div>
			<div  v-else class="load f-tac">
				<p class="f-sub">&lt; No Images Loaded &gt;</p>
			</div>
		</div>
	</div>
</template>

<script>
import Painter from '../mixins/Painter'

export default {
	name: 'ExactView',
	mixins: [Painter],

	props: {
		pos: Array
	},

	methods: {

	},

	mounted() {
		this.origin.scale = 15
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
		}
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
		transform: translateY(-25px);
	}
</style>
