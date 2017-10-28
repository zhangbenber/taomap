<template>
	<div class="editor f-fs">
		<div class="tools panel">
			<ToolBar />
		</div>
		<div class="split split-v"></div>		
		<div class="workarea">
			<Workarea :image="image" @load="loadImage" />
		</div>
		<div class="split split-v">

		</div>
		<div class="side panel">
			<div class="exact-view f-ct">
				<TabPanel :tabs="[
					{ label: 'Exact View', slot: 'exact-view' }
				]">
				</TabPanel>
			</div>
				<div class="split split-h">
			
				</div>
			<div class="attr f-ct">
				<TabPanel :tabs="[
					{ label: 'Properties', slot: 'porp' },
					{ label: 'Export', slot: 'export' }
				]">
				</TabPanel>
			</div>
		</div>
		<ImagePicker ref="imagePicker" />
	</div>
</template>

<script>
import Workarea from './Workarea'
import ImagePicker from './ImagePicker'
import ToolBar from './ToolBar'
import TabPanel from './TabPanel'
export default {
	name: 'Editor',
	components: {
		Workarea, ImagePicker, ToolBar, TabPanel
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
				}
				img.src = url
			})
		}
	}
}
</script>

<style lang="less" scoped>
	@import '../common.less';
	.editor {
		display: flex;
		border: solid @majorBorder;
		border-width: 0 1px;
	}
	.panel {
		padding-top: 10px;
		position: relative;
		&::before {
			content: '.';
			font-size: 0;
			color: transparent;
			position: absolute;
			left: 0;
			top: 0;
			right: 0;
			height: 8px;
			border: solid @majorBorder;
			border-width: 1px 0;
			background: linear-gradient(@majorBackground, darken(@majorBackground, 3%));
			box-shadow: inset 0 1px rgba(255,255,255,.1);
		}
	}
	.tools {
		flex: none;
		background: @subBackground;
		width: 40px;
		height: 100%;
	}
	.workarea {
		flex: auto;
		height: 100%;
		position: relative;
	}
	.side {
		flex: none;
		width: 300px;
		height: 100%;
		display: flex;
		flex-direction: column;
	}
	.exact-view {
		flex: none;
		height: 250px;
	}
	.attr {
		flex: auto;
	}
	.split {
		flex: none;
		background: lighten(@majorBackground, 4%);
		border: 1px solid @majorBorder;
	}
	.split-v {
		height: 100%;
		width: 1px;
		border-width: 0 1px;
	}
	.split-h {
		height: 1px;
		border-width: 1px 0;
		z-index: 1;
		margin: 0 -1px;
	}
</style>