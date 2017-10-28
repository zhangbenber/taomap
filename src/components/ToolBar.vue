<template>
	<div class="self">
		<ul class="ul">
			<li class="i-btn i-btn-i active">A</li><li class="i-btn i-btn-i">B</li><li class="i-btn i-btn-i">C</li>
		</ul>
	</div>
</template>

<script>
export default {
	name: 'ToolBar',
	data: () => ({
	}),
	methods: {

	}
}
</script>

<style lang="less" scoped>
	@import '../common.less';
	.self {
		box-shadow: inset 0 1px lighten(@subBackground, 8%);
	}
	.ul {
		width: 32px;
		margin: 0 auto;
		padding: 5px 0;
		list-style: none;
		li {
			margin: 1px 0;
		}
	}
</style>