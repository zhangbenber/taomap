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
			} else if (to === 'fit') {
				origin.scale = Math.min(
					(viewport.height - 20) / image.height,
					(viewport.width - 20) / image.width
				)
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
			let toCanvasCord = p => p.map((v, i) =>
				Math.floor(v * this.origin.scale + this.origin[['x', 'y'][i]])
					+ (this.origin.scale >= 3 ? 0 : 0.5)
			)

			let { viewport, origin, image, doc } = this
			let { selectedObjects, state } = doc

			if (!this.$refs.back) {
				this.dirty = false
				this.$nextTick(() => {
					if (this.dirty) {
						this.draw()
					}
				})
				return
			}

			// Draw image on `back`

			let back = this.$refs.back.getContext('2d')
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

			// Draw mask on `front`

			let front = this.$refs.front.getContext('2d')
			front.clearRect(0, 0, viewport.width, viewport.height)
			front.lineWidth = this.origin.scale >= 3 ? 2 : 1

			// For image map areas
			front.strokeStyle = '#68c'
			front.fillStyle = 'rgba(102,136,204,.3)'
			let points = []
			state.maps.concat(doc.interaction.maps).forEach((map, index) => {
				if (map.hide) {
					return
				}
				let selected = selectedObjects.maps.indexOf(index) > -1
				front.beginPath()
				map.poly.forEach((p, i) => {
					let point = toCanvasCord(p)
					if (selected) {
						points.push(point)
					}
					if (i == 0) {
						front.moveTo(point[0], point[1])
					} else {
						front.lineTo(point[0], point[1])
					}
				})
				front.closePath()
				front.fill()
				front.stroke()
			})

			// For image map control handlers
			front.fillStyle = '#57a'
			let size = this.origin.scale >= 3 ? 10 : 5
			points.forEach(p => {
				front.fillRect(p[0] - size / 2, p[1] - size / 2, size, size)
			})

			
			
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
	},

	mounted() {
		this.$root.$on('repaint', this.repaint)
	},

	beforeDestory() {
		this.$root.$off('repaint', this.repaint)
	}
}