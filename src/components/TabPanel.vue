<template>
	<div class="self f-fs">
		<ul class="tab">
			<li v-for="(item, i) in tabs" :key="i" :class="{active: i == active}" @mousedown="switchTo(i)">
				{{ item.label }}
			</li>
		</ul>
		<div class="content f-fs">
			<slot :name="tabs[active].slot" />
		</div>
	</div>
</template>

<script>
export default {
	name: 'TabPanel',
	props: {
		tabs: Array
	},
	data: () => ({
		active: 0
	}),
	methods: {
		switchTo(i) {
			this.active = i
			this.$emit('switch', i)
		}
	}
}
</script>

<style lang="less" scoped>
	@import '../common.less';
	.self {
		height: 100%;
	}
	.tab {
		overflow: hidden;
		height: 24px;
		margin: 0;
		padding: 0;
		width: 100%;
		list-style: none;
		background: linear-gradient(lighten(@majorBackground, 3%), lighten(@majorBackground, 1%));
		box-shadow:
			inset 0 1px rgba(255,255,255,.075),
			inset 0 -1px lighten(@subBackground, 5%),
			inset 0 -2px @majorBorder;
		li {
			height: 22px;
			line-height: 23px;
			display: inline-block;
			border-right: 1px solid @majorBorder;
			padding: 0 10px;
			text-shadow: 0 -1px rgba(0,0,0,.8);
			color: @subText;
			&:hover {
				background: rgba(255,255,255,.03);
			}
			&.active {
				background: @subBackground;
				border-bottom: 1px solid @subBackground;
				padding-bottom: 1px;
				box-shadow: inset 0 1px rgba(255,255,255,.075);
				color: @majorText;
			}
		}
	}
	.content {
		top: 24px;
		background: @subBackground;
	}
</style>