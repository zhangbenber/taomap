<template>
	<ul class="self f-scroll">
		<li v-for="(item, i) in doc.history" :key="i" :class="['f-ln1', {
			active: doc.historyStep == i,
			invalid: !item.historyMeta.live || doc.historyStep < i
		}]" @click="dispatch('goHistory', i)">
			<span class="ico">{{item.historyMeta.icon || ''}}</span>{{i18n(item.historyMeta.desc || 'history.unknown')}}
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
		height: 20px;
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
		.ico {
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
			[dir=rtl] & { margin: 0 0 0 4px; transform: scaleX(-1); }
		}
	}
</style>
