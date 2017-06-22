module.exports = {

	onRun: function (config, dependencies, jobCallback) {

		jobCallback(null, {project: config.project} );

	}
};