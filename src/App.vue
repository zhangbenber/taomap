<template>
	<div id="app">
		<Editor :doc="doc" />
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
	@import 'app.less';
</style>