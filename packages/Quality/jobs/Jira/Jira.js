
module.exports = {

	onRun: function (config, dependencies, jobCallback) {

		//To parse an XML file into a JS object
		var parseString = require('xml2js').parseString;

		//Get the authetication inforations if given
		try {
			var user = config.globalAuth[config.authName].username;
			var password = config.globalAuth[config.authName].password;
		} catch(e){
			var user = "error";
			var password = "error";
		}

		/*Function to get all issues concerning a given project*/
		var IssuesList = new Array();//Will be fill with all the informations regarding issues.					
		var IssuesTab = [];

		var adress = config.jiraServer + config.jiraRequest + "key=" + config.project + "&maxResults=500";//Adress of the issues
		var nbIssues = nbUndefined = nbSecond = nbMajeur = 0;
		var nbOpen = nbDone = nbInProcess = 0;//For statistics


		try{
			dependencies.request.get(
					adress,
					{
						'auth' : {
							'user' : user,
							'pass' : password
						}
					},
					function(err,response,data){
						var issues = "";
						try{
							issues = JSON.parse(data);
						} catch(e){
							IssuesList.push('No informations recieved');
							jobCallback(null, {title: config.widgetTitle, IssuesList : IssuesList});
						}
						if(issues.issues){
							if(issues.issues.length){
								issues.issues.forEach(function(issue){
									if(issue.key){
										IssuesTab.push(issue.key);
									}
								});
							}
						}//Request to get all the issues' key
						if(IssuesTab.length){
							IssuesTab.forEach(function(issue,pos){
								var id,title,status,priority,type,version;
								adress = config.jiraServer + config.jiraXML + issue + "/" + issue + ".xml";
		
								dependencies.request.get(adress,{
										'auth' : {
											'user' : user,
											'pass' : password
										}
									},
									function(err,response,body){
										parseString(body,function(err,data){
											type =  data.rss.channel[0].item[0].type[0]._;
											status =  data.rss.channel[0].item[0].status[0]._;
											priority = data.rss.channel[0].item[0].priority[0]._;
											title = data.rss.channel[0].item[0].title[0];
											id = data.rss.channel[0].item[0].key[0]._;
											version = data.rss.$.version;
										nbIssues += 1;
										var issueDescription = {
											'id' : id,
											'type' : type,
											'status' : status,
											'priority' : priority,
											'title' : title
										};//A JS object containing the issue informations
										switch(priority){
											case "Undefined":
												nbUndefined= nbUndefined +1;
												break;
											case "Secondaire":
												nbSecond= nbSecond +1;
												break;
											case "Majeure":
												nbMajeur= nbMajeur +1;
												break;
											default :
												console.log(priority);
												break;
										}//To get the number of priorities , regarding the priority
										switch(status){
											case 'A faire':
												nbOpen = nbOpen + 1;
												break;
											case 'Fini':
												nbDone = nbDone + 1;
												break;
											case 'En cours':
												nbInProcess = nbInProcess + 1;
												break;
											default:
												console.log(status);
												break;
										}//To get the number of priorities , regarding the status
										IssuesList.push(issueDescription);
										//To be sure all the data are recieved for the callback
										if(IssuesList.length == IssuesTab.length){
											jobCallback(null, {title: config.widgetTitle, project : config.project, 
																IssuesList : IssuesList, jiraServer : config.jiraServer,
																nbOpen : nbOpen, nbIssues : nbIssues, nbDone : nbDone,
																nbInProcess : nbInProcess, nbMajeur : nbMajeur,
																nbSecond : nbSecond, nbUndefined : nbUndefined,
																version : version});
		
										}
										});
									});
								});
						}
					}
				);
		} catch(e){
			IssuesList.push('No informations recieved');
			jobCallback(null, {title: config.widgetTitle, IssuesList : IssuesList});
		}
	}
};