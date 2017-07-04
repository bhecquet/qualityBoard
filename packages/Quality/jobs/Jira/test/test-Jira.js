/**
 * Test file for Job: Jira
 */

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



	describe('Request return',function(err,data){
		it('Should return ["No information recieved"] if data in wrong shape',function(){

			mockedConfig = {"widgetTitle" : " Jira ",
					"authName" : "Jira",
					"project" : "ENVMONITOR",
					"jiraServer" : "https://jira.infotel.com",
					"jiraRequest" : "/rest/api/2/search?",
					"jiraXML" : "/si/jira.issueviews:issue-xml/"}

			Jira_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
				assert.deepEqual(data.IssuesList,['No informations recieved']);
			});
		});

	});
});