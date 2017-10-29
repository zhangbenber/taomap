<template>
	<div class="self">
		<ul class="ul">
			<template v-for="(i, index) in tools">
				<li class="split" v-if="i.split" :key="`split-${index}`"></li>
				<li v-else :key="i.id" :title="`${i.name} (${i.shotcut.toUpperCase()})`"
					:class="['i-btn i-btn-i', { active: store.activeTool == i.id }]"
					@mousedown="dispatch('changeTool', i.id)">
					{{i.icon}}
				</li>
			</template>
		</ul>
	</div>
</template>

<script>
import tools from '../constants/tools'

export default {
	name: 'ToolBar',

	data: () => ({
		tools
	})
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
		li {
			margin: 1px 0;
			&.split {
				height: 1px;
				background: @subBorder;
				margin: 2px 0;
				border-bottom: 1px solid rgba(255,255,255,.15);
			}
		}
	}
</style>