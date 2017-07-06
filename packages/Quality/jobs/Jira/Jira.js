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
//Just so that it works...
// var version = 0.12;



/*
* Export module, to send info to the widget
*/
module.exports = {

	onInit: function (config, dependencies) {
		/*
		* The onInit part is called once at the 
		* beginning. It is use to configur path for
		* example.
		*/
	
	},

	onRun: function (config, dependencies, jobCallback) {
		/*
		* The onRun part is called every intervall. It sends
		* data to the widget.
		*/

		//Define the request method

		var request = dependencies.request;
		var IssuesTab = [];
		var IssuesList = [];

		//To count the number of issues by categories
		var nbIssues = nbUndefined = nbSecond = nbMajeur = 0;
		var nbOpen = nbDone = nbInProcess = 0;
		//get the authentication informations
		try {
			var user = config.globalAuth[config.authName].username;
			var password = config.globalAuth[config.authName].password;
		} catch(e){
			var user = "error";
			var password = "error";
		}
		//This object will allow the authentication
		var option = {
			'auth' : {
				'user' : user,
				'pass' : password
			}
		};
		//Those adress will be use to get information on the Jira server
		listeAdress = config.jiraServer + config.jiraRequest + "key=" + config.project + "&maxResults=500";
				//MaxResult to get the 500 first issue(default = 50)
		issueAdressBase = config.jiraServer + config.jiraXML + '<issue>' + "/" + '<issue>' + ".xml";
				//the <issue> part wil be change into the real issue key

		//Function to fill the IssuesTab
		function getIssuesId(adress,IssuesTab){
			try{
				request.get(adress,option,function(err,response,data){
					var issues = JSON.parse(data);
					issues.issues.forEach(function(issue){
						IssuesTab.push(issue.key);
					});
					global();
				});
			} catch(e){
				IssuesTab.push('no Issues Found');
			}
		}

		//Function to get the informations of a given issue
		function getIssueInformation(issueId,IssuesList){
			issueAdress = issueAdressBase.replace(/<issue>/gi, issueId);
			request.get(issueAdress,option,function(err,response,body){
				try{
					parseString(body,function(err,data){
						//Get all useful informations in a js object
						var type =  data.rss.channel[0].item[0].type[0]._;
						var status =  data.rss.channel[0].item[0].status[0]._;
						var priority = data.rss.channel[0].item[0].priority[0]._;
						var title = data.rss.channel[0].item[0].title[0];
						var id = data.rss.channel[0].item[0].key[0]._;
						var version = data.rss.$.version;
						var issueDescription = {
							'id' : id,
							'type' : type,
							'status' : status,
							'priority' : priority,
							'title' : title
						};	
						IssuesList.push(issueDescription);
						Version.push(version);

						//Increment the global variables
						updateStatVariables(priority,status);
					});
				}catch(e){
					IssuesList.push("");
				}
				if(IssuesList.length == IssuesTab.length){
					jobCallback(null, {title: config.widgetTitle, project : config.project, 
										IssuesList : IssuesList, jiraServer : config.jiraServer,
										nbOpen : nbOpen, nbIssues : nbIssues, nbDone : nbDone,
										nbInProcess : nbInProcess, nbMajeur : nbMajeur,
										nbSecond : nbSecond, nbUndefined : nbUndefined,
										version : Version[0]});
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
					nbInProcess : nbInProcess});//For the test
		}



		function global(){
			//Get the issues
			//get the information
			//callBack
			if(IssuesTab.length > 0){
				if(IssuesTab[0] == 'no Issues Found'){
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

		getIssuesId(listeAdress,IssuesTab);
	}
};