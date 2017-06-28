
module.exports = {

	onRun: function (config, dependencies, jobCallback) {

		var parseString = require('xml2js').parseString;

		try {
			var user = config.globalAuth[config.authName].username;
			var password = config.globalAuth[config.authName].password;
		} catch(e){
			var user = "error";
			var password = "error";
		}

		var adress = "https://jira.infotel.com/si/jira.issueviews:issue-xml/ENVMONITOR-16/ENVMONITOR-16.xml";

		/*Function to get the differents o=informations of a given demand*/

		/*dependencies.request.get(adress,{
						'auth' : {
							'user' : user,
							'pass' : password
						}
					},
					function(err,response,body){
						parseString(body,function(err,data){
							var test = data;
							// console.log('type : ' + data.rss.channel[0].item[0].type[0]._);
							// console.log('Status : ' +  data.rss.channel[0].item[0].status[0]._);
							// console.log( 'Priority : ' + data.rss.channel[0].item[0].priority[0]._);
							// console.log(  'Title : ' + data.rss.channel[0].item[0].title[0]);
							//console.log('id : ' + data.rss.channel[0].item[0].key[0]._);
						});
					});*/

		jobCallback(null, {title: config.widgetTitle});
	}
};