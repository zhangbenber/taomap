<template>
	<div class="editor f-fs">
		<div class="tools panel">
			<ToolBar />
		</div>
		<div class="split split-v"></div>		
		<div class="workarea">
			<Workarea />
		</div>
		<div class="split split-v">

		</div>
		<div class="side panel">
			<div class="corner f-ct">
				<TabPanel :tabs="[
					{ label: i18n('panel.exactview'), slot: 'exact-view' },
					{ label: i18n('panel.history'), slot: 'history' }
				]">
					<template slot="exact-view">
						<ExactView />
					</template>
					<template slot="history">
						<History />
					</template>
				</TabPanel>
			</div>
				<div class="split split-h">
			
				</div>
			<div class="attr f-ct">
				<TabPanel :tabs="[
					{ label: i18n('panel.properties'), slot: 'porp' },
					{ label: i18n('panel.export'), slot: 'export' }
				]">
				</TabPanel>
			</div>
		</div>
	</div>
</template>

<script>
import Workarea from './Workarea'
import ToolBar from './ToolBar'
import TabPanel from './TabPanel'
import ExactView from './ExactView'
import History from './History'

export default {
	name: 'Editor',
	components: {
		Workarea, ToolBar, TabPanel, ExactView, History
	},

	data: () => ({
	})
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
	.corner {
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