/**
 * Test file for Job: Jenkins
 **/
var assert = require ('assert');
var Jenkins_SUT = require('../Jenkins');

var mockedConfig, mockedDependencies;

describe ('Jenkins test', function(){

	beforeEach(function (done) {

		mockedConfig = {
			widgetTitle	:'title',
			globalAuth	: {
				myconfigKey	: {
					username	: "myusername",
					password	: "secretpassword"
				}
			},
			"interval" : 10000,
			"widgetTitle" : "Jenkins",
			"authName" : "Jenkins",
			"jenkinsServer" : "http://vs-dev15:8082/jenkins",
			"jenkinsRequest" : "/api/json",
			"jobRequest" : "/job/<jobName>/lastBuild/api/json",
			"jobList" : ["job"]
		};

		mockedDependencies = {
			logger: console,
			request : {
				get : function (adress,options, cb) {
				cb(null,200 ,`{}`);
				}
			}
		};

		done();
	});

	describe ('config checks', function(){
		it('should check for valid credentials', function (done){
			Jenkins_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
				assert.equal(data.title,'Jenkins');
				done();
			});
		});
	});

	//Test the auxilaries functions
	describe('Auxilaries function',function(){
		describe('isIn',function(){
			//If ok
			it('should return true if value is in tab',function(done){
				var test = Jenkins_SUT.isIn(3,[1,2,3]);
				assert.equal(test,true);
				done();
			});
			//If not
			it('should return false if the value is not in the tab',function(done){
				var test = Jenkins_SUT.isIn(4,[1,2,3]);
				assert.equal(test,false);
				done()				
			});
		});
	});

	//Test the request.get
	describe('Data recuperation',function(){		
		//Sunny Day
		it('should retrun the tab filled with the right data',function(done){
			mockedDependencies = {
				logger: console,
				request	:{
					get		: function(adress,options,cb){
						// To be sure the authentication works
						switch(adress){
							case 'http://vs-dev15:8082/jenkins':
								cb(
									null,
									200,
									`
										<html> test </html>
									`
								);
								break;
							case 'http://vs-dev15:8082/jenkins/api/json' :
								cb(
									null,
									200,
									`{"jobs" : [{
										"name" 	: "job",
										"color"	: "red"
									},{
										"name" 	: "test",
										"color" : "blue"
									}]}`
								);
								break;
							default:
								cb(
									null,
									200,
									`{"duration"	: 200,
									"result" 		: "SUCCCESS"}`
								);
						}
					}	
				}
			};

			Jenkins_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
				assert.deepEqual(data.jobList,[{name 		: 'job',
												status 		: 'red',
												duration 	: 200,
												result 		: 'SUCCESS'}]);			
			});
			done();
		});


		it('should return an Authentication Error',function(done){
			mockedDependencies = {
				logger: console,
				request	:{
					get		: function(adress,options,cb){
						cb(
							null,
							200,
							`
								<html test </html>
							`
						);
					}	
				}
			};

			Jenkins_SUT.onRun(mockedConfig,mockedDependencies,function(err,data){
				assert.deepEqual(data.jobList[0].status,'authenticationError');
			});
			done();
		});
	});
});