/***************************
**		 Jira Module 	  **
****************************/

/*
* declaration of variables
*/

//Module to parse an xml file
var parseString = require('xml2js').parseString;
//Issues tab
var IssuesList = [];//issues informations
var IssuesTab = [];//issues keys
var Version = [];//Tab of version
//Adress to the differents informations
var listeAdress = "";//To get the list of issues
var issueAdressBase = "";//To get information on an issue
var versionAdress = ""; //To get the version id

/*
* Export module, to send info to the widget
*/
module.exports = {

	onInit: function (config, dependencies) {
		/*
		* The onInit part is called once at the 
		* beginning. It is use to configure path for
		* example.
		*/
	
	},

	onRun: function (config, dependencies, jobCallback) {
		/*
		* The onRun part is called every intervall. It sends
		* data to the widget.
		*/

		//Define the request method
		var request 	= dependencies.request;

		var IssuesTab 	= [];
		var IssuesList 	= [];

		//To count the number of issues by categories
		var nbIssues 	= nbUndefined 	= nbSecond 		= nbMajeur = 0;
		var nbOpen 		= nbDone 		= nbInProcess 	= 0;
		//get the authentication informations
		try {
			var user 		= config.globalAuth[config.authName].username;
			var password 	= config.globalAuth[config.authName].password;
		} catch(e){
			var user 		= "error";
			var password 	= "error";
		}
		//This object will allow the authentication
		var option = {
			'auth' : {
				'user' : user,
				'pass' : password
			}
		};
		//Those adress will be use to get information on the Jira server
		listeAdress 	= config.jiraServer + config.jiraRequest + "key=" + config.project + "&maxResults=500";
				//MaxResult to get the 500 first issue(default = 50)
		issueAdressBase = config.jiraServer + config.jiraIssueRequest;
				//the <issue> part wil be change into the real issue key
		versionAdress 	= config.jiraServer + config.jiraVersionRequest;

		//var of the differents criteria
		var PriorityFilters	= config.PriorityFilters;
		var StatusFilters	= config.StatusFilters;
		var TypeFilters 	= config.TypeFilters;
		var VersionFilter	= config.VersionFilter;

		//Check if an issue is to be add, given a criteria list
		function check(issueValue,criterion){
			var DoIPushVar = false;
			if(criterion.length == 0){
				DoIPushVar 	= true;
			} else{
				DoIPushVar 	= isIn(issueValue,criterion);
			}
			return DoIPushVar;
		}

		//Push the issue if and only if it correspond to the criteria.
		function pushIfOk(issueDescription,IssuesList){
			//Each variable concern a given criterion
			var DoIPushPrior 	= false;
			var DoIPushType		= false;
			var DoIPushStatus	= false;

			//For each type, check if the issue il to be add
			DoIPushStatus 		= check(issueDescription.status,StatusFilters);
			DoIPushType			= check(issueDescription.type,TypeFilters);
			DoIPushPrior		= check(issueDescription.priority,PriorityFilters);

			//If the issue correspond, push it to the tab, else push a similar description
			if(!(DoIPushStatus && DoIPushPrior && DoIPushType)){
				issueDescription = {
					'id'		: 'Invalide',
					'type' 		: 'Invalide',
					'status' 	: 'Invalide',
					'priority' 	: 'Invalide',
					'title'		: 'Invalide'
				};
			}
			IssuesList.push(issueDescription);
		}

		//Function to see if a value is in a tab
		function isIn(value,tab){
			var result = false;
			if(tab.length > 0){
				tab.forEach(function(v){
					if(v == value){
						result = true;
					}
				});
			}
			return result;
		}


		//Function to fill the IssuesTab
		function getIssuesId(adress,IssuesTab,version){
			try{
				request.get(adress,option,function(err,response,data){
					try{
						var issues = JSON.parse(data);
					} catch(e){
						var issues = {'issues' : 'none'};
					}
					try{
						issues.issues.forEach(function(issue){
							if(version == 'none'){
								IssuesTab.push(issue.key);
							}else{
								if(isIn(VersionFilter,issue.fields.fixVersions)){
									IssuesTab.push(issue.key);
								}
							}
						});
					} catch (e){
						IssuesTab = ['Authentication error'];
					}
					global(IssuesTab);
				});
			} catch(e){
				//console.log(e);
				IssuesTab.push('Authentication error');
				jobCallback(null,{title : config.widgetTitle,IssuesList : IssuesTab});
			}
		}

		//Function to get the informations of a given issue
		function getIssueInformation(issueId,IssuesList){
			issueAdress = issueAdressBase.replace(/<issueKey>/gi, issueId);
			request.get(issueAdress,option,function(err,response,body){
				
				try{
					var data 		= JSON.parse(body);
					//Get all useful informations in a js object
					var type 		=  data.fields.issuetype.name;
					var status 		=  data.fields.status.name;
					var priority 	= data.fields.priority.name;
					var title 		= data.fields.summary;
					var id 			= issueId;
					if (data.fields.fixVersions.length > 0){
						var versions = [];
						data.fields.fixVersions.forEach(function(v){
							versions.push(v.name);
						});
					}
					var issueDescription = {
						'id' 		: id,
						'type' 		: type,
						'status' 	: status,
						'priority' 	: priority,
						'title' 	: title,
					};
					//Add the isue if it correspond
					pushIfOk(issueDescription,IssuesList);
					//Increment the global variables
					updateStatVariables(priority,status);
				}catch(e){
					console.log('Test00' + e);
					IssuesList.push("");
				}
				if(IssuesList.length == IssuesTab.length){
					jobCallback(null, {title: config.widgetTitle, project : config.project, 
										IssuesList : IssuesList, jiraServer : config.jiraServer,
										nbOpen : nbOpen, nbIssues : nbIssues, nbDone : nbDone,
										nbInProcess : nbInProcess, nbMajeur : nbMajeur,
										nbSecond : nbSecond, nbUndefined : nbUndefined,
										jiraServer : config.jiraServer});
				}
			});
		}

		//Function to update the priorities
		function updateStatVariables(priority,status){
			nbIssues = nbIssues + 1;
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
			return({nbIssues : nbIssues,
					nbUndefined : nbUndefined,
					nbSecond : nbSecond,
					nbMajeur : nbMajeur,
					nbOpen : nbOpen,
					nbDone : nbDone,
					nbInProcess : nbInProcess});//For the tests
		}



		function global(IssuesTab){
			//Get the issues
			//get the information
			//callBack
			if(IssuesTab.length > 0){
				if(IssuesTab[0] === 'no Issues Found'){
					jobCallback(null,{title : config.widgetTitle, IssuesList : IssuesTab});
				}else if(IssuesTab[0] === 'Authentication error'){
					jobCallback(null,{title : config.widgetTitle, IssuesList : IssuesTab});
				} else{
					IssuesTab.forEach(function(issue){
						getIssueInformation(issue,IssuesList);
					});
				}
			} else{
				jobCallback(null,{title : config.widgetTitle, IssuesList : IssuesTab});
			}	
		}

		getIssuesId(listeAdress,IssuesTab,VersionFilter);
	}

};