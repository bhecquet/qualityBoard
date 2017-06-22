var assert = require ('assert');
var Project_SUT = require('../Project');

var mockedConfig, mockedDependencies;



		mockedDependencies = {
			logger: console,
			easyRequest : {
				JSON : function (options, cb) {
					cb(null, {});
				}
			}
		};//So that you don't have to use the real ones

describe('Project Job', function(){


	it('Should return the project name',function(){
		var Project = {"project" : "name"};
		Project_SUT.onRun(Project ,mockedDependencies, function(err,data){
			assert.equal(data.project,Project.project)
		});
	});

	it('should return `undefined` if no data is recived',function(){
		var config = {};
		Project_SUT.onRun(config,mockedDependencies,function(err,data){
			assert.equal(data.project,undefined);
		});
	});
});