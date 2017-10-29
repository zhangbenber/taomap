<template>
	<ul class="self f-scroll">
		<li v-for="(item, i) in doc.history" :key="i" :class="{
			active: doc.historyStep == i,
			invalid: !item.historyMeta.live || doc.historyStep < i
		}" @click="dispatch('goHistory', i)">
			<span class="ico">{{item.historyMeta.icon || ''}}</span>{{item.historyMeta.desc || '< Unkown >'}}
		</li>
	</ul>
</template>

<script>
export default {
	name: 'History',

	methods: {
	}
}
</script>

<style lang="less" scoped>
	@import '../common.less';

	.self {
		border-top: 1px solid @subBorder;
	}
	li {
		padding: 2px 5px;
		border-bottom: 1px solid @subBorder;
		cursor: pointer;
		&.active {
			background: @selBackground;
			color: @selText;
		}
		&.invalid {
			color: @subText;
			font-style: italic;
		}
		span {
			font-family: 'iconfont'!important;
			display: inline-block;
			text-align: center;
			font-size: 17px;
			vertical-align: bottom;
			width: 20px;
			margin-right: 4px;
			text-shadow: 0 -1px #000;
			opacity: .7;
			font-style: normal;
		}
	}
</style>
