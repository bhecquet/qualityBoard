
module.exports = {

	onRun: function (config, dependencies, jobCallback) {

		jobCallback(null, {title: config.widgetTitle});
	}
};