<template>
	<div>
		<Workarea :image="image" @load="loadImage" />
		<ImagePicker ref="imagePicker" />
	</div>
</template>

<script>
import Workarea from './Workarea'
import ImagePicker from './ImagePicker'
export default {
	name: 'Editor',
	components: {
		Workarea, ImagePicker
	},
	data: () => ({
		image: null
	}),
	methods: {
		loadImage() {
			this.$refs.imagePicker.open().then(file => {
				let url = URL.createObjectURL(file)
				let img = new Image()
				img.onload = () => {
					this.image = img
					console.log(this.image)
				}
				img.src = url
			})
		}
	}
}
</script>