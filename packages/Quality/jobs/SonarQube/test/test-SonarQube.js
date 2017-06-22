/**
 * Test file for Job: SonarQube
 */

var assert = require ('assert');
var SonarQube_SUT = require('../SonarQube');
var config,mockedDependencies;

describe('SonarQube Job', function(){
	//Unit test of the SonarQube job

		mockedDependencies = {
			logger: console,
			request :  function (options,response, cb) {
					return(null, {});
				
			}
		};


	describe('config Return', function(){

		var config = {	"title" : 'title',
						'project' : null,
						'metricLinkB' : 'link'};
		

		it('should return the config title', function(){
			
			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.equal(config.title, data.title);

			});
		})


		it('should return `undefined` if there is no information defined',function(){
			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.equal(undefined, data.end);
			});	
		});
	});

	describe('data recuperation', function(){
		beforeEach(function(){
			mockedDependencies = {
				request :function(options,response, cb){
						return(null,
							{"component":
								{"id":"AVUqWL3s63m25aHrZhrY","key":"com.infotel.seleniumRobot:core","name":"core",
								"description":"Something usefull here",
								"measures":[{"metric":"coverage","value":"46.7",
									"periods":[{"index":1,"value":"1.4000000000000057"},
										{"index":2,"value":"0.0"},
										{"index":3,"value":"0.0"}]
									}]
								}});
					
				}		
			} 

			config = {	"title" : 'title',
								'project' : null,
								'metricLinkB' : 'link',
								'metricList' : ['coverage'],
								'testList' : ['coverage']
								};
			return(mockedDependencies,config);
		});


		it('should return an empty tab if there is no data recieved', function(){
			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.deepEqual([],data.Globalgraphic);
				assert.deepEqual([], data.graphicTest);
			});

		});

		it('Should return the metric name and value in a tab',function(){
			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.deepEqual(data.metricValues,[{"metric":"coverage","value":"46.7",
									"periods":[{"index":1,"value":"1.4000000000000057"},
										{"index":2,"value":"0.0"},
										{"index":3,"value":"0.0"}]
									}])
			});

		});

		it('Should return an empty tab if it recieved data in the wrong shape',function(){
			mockedDependencies = {
				request :function(options,cb){
						return(null,
							[{"cels": [{"v" : [10]},{"v" : [2]}]
								}]);
					
				}
			}
			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.deepEqual(data.graphicTest,[]);
			});
		});

		it('Should return tabs filled with right data',function(){
			mockedDependencies = {
				request :function(options,response,cb){
						return(null,
							[{"cells": [{"v" : [10]},{"v" : [2]}]
								}]);
					
				}
			}

			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.deepEqual(data.graphicTest,[10,2]);
				assert.deepEqual(data.Globalgraphic,[10,2]);
			});

			
		});

		it('Should return empty tabs if one of the metric is written wrong',function(){

			mockedDependencies = {
				request :function(options,response,cb){
						return(null,
							{"errors":[{"msg":"The following metric keys are not found: metrics written wrong"}]});
				}
			}

			SonarQube_SUT.onRun(config,mockedDependencies,function(err,data){
				assert.deepEqual(data.graphicTest,[]);
				assert.deepEqual(data.Globalgraphic,[]);
				assert.deepEqual(data.graphicTest,[]);
			});

		});


	});

});