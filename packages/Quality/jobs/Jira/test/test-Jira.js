/**
 * Test file for Job: Jira
 **/

var assert = require ('assert');
var Jira_SUT = require('../Jira');

var mockedConfig, mockedDependencies;

mockedDependencies = {
	logger: console,
	request : {
		get :  function (options,response, cb) {
			return(null, "<HTML>");
		}
	}
};




describe ('Jira test', function(){
	
	it('Should return the title',function(){
		mockedConfig = {
			'widgetTitle' : 'title'
		};
		Jira_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
			assert.equal(data.title,'title');
		});
	});


	it('Should return Undefined if no data recieved',function(){
		mockedConfig = {'title' : 'title'};

		Jira_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
			assert.equal(data.title,undefined);
		});
	});

	describe('Auxilaries functions',function(err,data){
		describe('getIssuesId',function(err,data){
			it('should fill IssuesTab with the issue\'s key list',function(){
				mockedDependencies = {
					logger: console,
					request : {
						get :  function (adress,option, cb) {
							return(null,'test','{issues : [{key : 12},{key : 13}]}');
						}
					}
				};
				Jira_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
					assert.deepEqual(data.IssuesTab,[12,13]);
				});

				
			});
	
			it('should should push \'no Issues Found\' if the data are wrong (get IssuesId) ',function(){
				Jira_SUT.onRun(mockedConfig,mockedDependencies,function(){
					assert.deepEqual(IssuesTab,['no Issues Found']);
				});
			});
		});

		describe('updateStatVariables',function(err,data){
			it('should increment the right variables',function(){
				Jira_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
					var statVar = onRun.updateStatVariables('Majeure','Fini');
					assert.equal(statVar.nbOpen,1);
					assert.equal(statVar.nbMajor,10);
				});
			});
		});


		describe('getIssueInformation',function(err,data){
			// Sunny Day
			it('should push the right informations',function(){
				mockedDependencies = {
					request : {
						get :function(adress,options,cb){
							cb(null,
								200,
								`{
									"fields" : {
										"issuetype" : {
											"name" : "type"
										},
										"status" : {
											"name" : "status"
										},
										"priority" : {
											"name" : "prior"
										},
										"summary" : "summary"
									}
								}`
							);
						}	
					}
				}

				mockedConfig = {
					"interval" : 10000,
					"widgetTitle" : " Jira ",
					"authName" : "Jira",
					"project" : "ENVMONITOR",
					"jiraServer" : "https://jira.infotel.com",
					"jiraRequest" : "/rest/api/2/search?",
					"jiraIssueRequest" : "/rest/api/2/issue/<issueKey>",
					"jiraVersionRequest" : "/rest/api/2/project/<project>/versions",
					"VersionFilter" : "none",
					"PriorityFilters" : [],
					"StatusFilters" : [],
					"TypeFilters": []
				} ;

				Jira_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
					// assert.deepEqual(data.IssuesList,[{id : 0, type : 'type', status : 'status', priority : 'prior',title : 'summary'}])
				});
			});
		});
	});
});