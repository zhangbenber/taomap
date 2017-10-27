<template>
	<input type="file" accept="image/*" key="unique" ref="input" @change="done" />
</template>

<script>
export default {
	name: 'ImagePicker',
	data: () => ({
		unique: 0
	}),
	methods: {
		open() {
			this.$refs.input.click()
			return new Promise((resolve, reject) => {
				this.resolver = resolve
			})
			
		},
		done(e) {
			this.resolver(e.target.files[0])
		}
	}
}
</script>

<style lang="less" scoped>
	input {
		display: none;
	}
</style>
