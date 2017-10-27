<template>
	<div id="app">
		<Editor />
	</div>
</template>

<script>
import Editor from './components/Editor'

export default {
	name: 'App',
	components: {
		Editor
	}
}
</script>

<style lang="less">
	@import 'common.less';
	@import 'app.less';
</style>