/**
 * Test file for Job: Jira
 */

var assert = require ('assert');
var Jira_SUT = require('../Jira');

var mockedConfig, mockedDependencies;

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

});
