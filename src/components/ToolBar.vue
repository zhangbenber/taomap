<template>
	<div class="self">
		<ul class="ul">
			<li v-for="i in tools" :key="i.id"
				:title="`${i.name} (${i.shotcut.toUpperCase()})`"
				:class="['i-btn i-btn-i', { active: active == i.id }]"
				@mousedown="$emit('change', i.id)">
				{{i.icon}}
			</li>
		</ul>
	</div>
</template>

<script>
import tools from '../constants/tools'

export default {
	name: 'ToolBar',
	props: {
		active: String
	},
	data: () => ({
		tools
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