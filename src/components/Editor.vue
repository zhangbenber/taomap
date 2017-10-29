<template>
	<div class="editor f-fs">
		<div class="tools panel">
			<ToolBar :active="activeTool" @change="activeTool = $event" />
		</div>
		<div class="split split-v"></div>		
		<div class="workarea">
			<Workarea :image="image" :active-tool="activeTool"
				:keyboard-state="keyboardState" @move="mouseCord = $event" />
		</div>
		<div class="split split-v">

		</div>
		<div class="side panel">
			<div class="corner f-ct">
				<TabPanel :tabs="[
					{ label: 'Exact View', slot: 'exact-view' },
					{ label: 'History', slot: 'history' }
				]">
					<template slot="exact-view">
						<ExactView :image="image" :pos="mouseCord" />
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
					{ label: 'Properties', slot: 'porp' },
					{ label: 'Export', slot: 'export' }
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

import tools from '../constants/tools'

export default {
	name: 'Editor',
	porps: {
		doc: Object
	},
	components: {
		Workarea, ToolBar, TabPanel, ExactView, History
	},

	data: () => ({
		activeTool: 'sel',
		keyboardState: {
			space: false
		},
		mouseCord: null
	}),

	computed: {
		image() {
			return this.doc.state.image || null
		}
	},

	mounted() {
		this.keyboardAction = (e) => {
			let code = e.keyCode
			let isDown = (e.type === 'keydown')

			switch (code) {
				case 32:
					this.keyboardState.space = isDown
					break;
			}

			if (isDown) {
				let shotcut = String.fromCharCode(code).toLowerCase()
				let tool = tools.find(i => i.shotcut == shotcut)
				if (tool) {
					this.activeTool = tool.id
				}
			}
		}

		window.addEventListener('keydown', this.keyboardAction)
		window.addEventListener('keyup', this.keyboardAction)
	},

	beforeDestroy() {
		window.removeEventListener('keydown', this.keyboardAction)
		window.removeEventListener('keyup', this.keyboardAction)
	},

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