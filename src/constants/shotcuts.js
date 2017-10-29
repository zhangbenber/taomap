export default [
	{
		key: ['ctrl', 'i'],
		callback: function () {
			this.dispatch('browseImage')
		}
	},
	{
		key: ['ctrl', 'z'],
		callback: function () {
			this.dispatch('undo')
		}
	},
	{
		key: ['ctrl','shift', 'z'],
		callback: function () {
			this.dispatch('redo')
		}
	}
]