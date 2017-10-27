<template>
	<div class="self f-fs">
		<div class="img" v-if="viewport && image" :style="{width: `${viewport.width}px`, height: `${viewport.height}px`}">
			<canvas :width="viewport.width" :height="viewport.height" ref="canvasBack" />
		</div>
		<div v-else @click="$emit('load')">Load Image</div>
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
			scale: 1
		}
	}),
	methods: {
		repaint() {
			let back = this.$refs.canvasBack.getContext('2d')
			let imageSmoothingEnabled = this.origin.scale < 1
			back.mozImageSmoothingEnabled = imageSmoothingEnabled
			back.webkitImageSmoothingEnabled = imageSmoothingEnabled
			back.msImageSmoothingEnabled = imageSmoothingEnabled
			back.imageSmoothingEnabled = imageSmoothingEnabled
			back.drawImage(this.image, 0, 0)
		},
		resize() {
			this.viewport = {
				width: this.$el.scrollWidth,
				height: this.$el.scrollHeight
			}
			if (this.image) {
				this.repaint()
			}
		}
	},
	mounted() {
		this.$nextTick(() => {
			this.resize()
		})
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
	.self {
		overflow: scroll;
		position: relative;
	}
	canvas {
		display: block;
		position: absolute;
	}
</style>
