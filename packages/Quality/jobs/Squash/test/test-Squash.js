/**
 * Test file for Job: Squash
 */

var assert = require ('assert');
var Squash_SUT = require('../Squash');

var mockedConfig, mockedDependencies;

describe ('Squash test', function(){

	beforeEach(function (done) {

		mockedConfig = {
			globalAuth: {
				myconfigKey: {
					username: "myusername",
					password: "secretpassword"
				}
			},
			interval: 20000
		};

		mockedDependencies = {
			logger: console,
			easyRequest : {
				JSON : function (options, cb) {
					cb(null, {});
				}
			}
		};

		done();
	});


	describe ('config checks', function(){
		it('should check for valid credentials', function (done){
			done();
		});
	});

});
