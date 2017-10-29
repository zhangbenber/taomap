export default {
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

			let { viewport, origin, image } = this

			this.$nextTick(() => {
				if (image) {
					origin.x = -this.$refs.scroll.scrollLeft + 25
					origin.y = -this.$refs.scroll.scrollTop + 25
					if (image.width * origin.scale < viewport.width) {
						origin.x = (viewport.width - image.width * origin.scale) / 2
					}
					if (image.height * origin.scale < viewport.height) {
						origin.y = (viewport.height - image.height * origin.scale) / 2
					}

					this.repaint()
					if (this.afterResize) {
						this.afterResize()
					}
				}
			})
		},

		zoom(to) {
			let { viewport, origin, image, doc } = this
			let { mouse } = doc
			let zoomPos = mouse.onScreen ?
				[mouse.cord[0] * origin.scale + origin.x, mouse.cord[1] * origin.scale + origin.y] :
				[viewport.width / 2, viewport.height / 2]
			let zoomCord = [
				(zoomPos[0] - origin.x) / origin.scale,
				(zoomPos[1] - origin.y) / origin.scale
			]
			if (typeof to === 'number') {
				origin.scale = to
			} else {
				let arr = [
					.01, .015, .02, .025, .1 / 3, .05, .2 / 3,
					.1, .15, .2, .25, 1 / 3, .5, 2 / 3,
					1, 1.5, 2, 2.5, 10 / 3, 5, 20 / 3, 10, 15, 20
				]
				let result
				if (to === 'out') {
					arr.reverse()
					result = arr.find(i => (i < origin.scale * 0.99))
				} else {
					result = arr.find(i => (i > origin.scale * 1.01))
				}
				origin.scale = result || origin.scale
			}
			this.$nextTick(() => {
				this.$refs.scroll.scrollLeft = Math.round(zoomCord[0] * origin.scale - zoomPos[0] + 25)
				this.$refs.scroll.scrollTop = Math.round(zoomCord[1] * origin.scale - zoomPos[1] + 25)
				this.resize()
			})
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
			back.imageSmoothingQuality = 'medium'

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

	computed: {
		image() {
			return this.doc.state.image
		}
	},

	watch: {
		image: function () {
			this.resize()
		}
	}
}