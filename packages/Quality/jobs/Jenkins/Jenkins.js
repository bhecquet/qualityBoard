var parseString = require('xml2js').parseString;





module.exports = {

//Auxilaries function

	//Return true if a value is in a tab
	isIn : function(value,tab){
		var res 	= false;
		if(tab.length > 0){
			tab.forEach(function(v){
				if(v == value){
					res = true;
				}
			});
		}
		return res;
	},

	onRun: function (config, dependencies, jobCallback) {
	   /**
		*Jenkins Job : jobs status
		**/

		//get the authentication informations
		try {
			var user 		= config.globalAuth[config.authName].username;
			var password 	= config.globalAuth[config.authName].password;
		} catch(e){
			var user 		= "error";
			var password 	= "error";
		}
		//This object will allow the authentication
		var option 	= {
			'auth' 	: {
				'user' 		: user,
				'pass' 		: password
			}
		};

		//Check if there is no authentication error
		function authenticationVerification(option){
			return new Promise(function(resolve,reject){
				//This adress send to the jenkins Home Page
				var testAdress = config.jenkinsServer;
				dependencies.request.get(
					testAdress,
					option,
					function(err,response,data){
						try{
							parseString(data,function(err,body){
								//If body.html.body[0]._ exist and equals '\n\n\nAuthentication required\n\n\n', there is an authentication Error
								try{
									if( body.html.body[0]._ == '\n\n\nAuthentication required\n\n\n'){
										reject(false);
									} else{
										resolve(true);
									}
								}catch(e){
									resolve(true);
								}				
							});
						}catch(e){
							reject(false);
						}
					}
				);
			});
		}

		//Adresses
		var jobsAdress		= config.jenkinsServer + config.jenkinsRequest;	//Adress to the Jenkins job list.
		var jobAdressBase 	= config.jenkinsServer + config.jobRequest;		//Adress of the job informations

		//Job list
		var jobList 		= config.jobList;

		//Job informations tab
		var jobsInformation	= [];//Tab send to the widget, and containning the job informations

		//Informations variables
		var name 		= "";
		var status 		= 'none';
		var duration 	= 'none';
		var result 		= 'none';
			//Those variables will be stocked in a JSON object for each job


		//For a given job, return the right informations

		/********************************************************
		*   But du jeu : Avec les Promesse faire en 			*
		*   sorte d'attendre le retours des différentes			* 
		*   fonctions asychrones avant de continuer: 			*
		*														*
		*	function test(){									*
		*		return new Promise(function(resolve, reject){	*
		*			setTimeout(function(){resolve(4)}, 2000);	*
		*		});												*
		*	}													*
		*														*
		* 	test().then(										*
		*			function(data){console.log(data)},			*
		*			function(err){console.error(err)});			*
		*														*
		*********************************************************/


		function getJobInformation(jobName){
			return new Promise(function(resolve, reject){
				//First get the status in the jobsAdress part
				try{
					dependencies.request.get(
						jobsAdress,
						option,
						function(err,response,data){
							//If error, reject it
							if(err){
								reject(err);
							}
							//The job list is in data.jobs
							//!! data is a string, not a JSON object !!
							var jobsListGlobal = JSON.parse(data).jobs;
							jobsListGlobal.forEach(function(job){
								if(job.name == jobName){
									status = job.color;
								}
							});
							resolve(status);
						}
					);
				}catch(e){
					reject('none');
				}
			});
		}

		//Function use if getJobInformation resolves :
			//Get job information on the personnal file
		function getJobPersoInfo(job,status){
			var adressJob = jobAdressBase.replace(/<jobName>/gi,job);
			try{
				dependencies.request.get(
					adressJob,
					option,
					function(err,response,data){
						if(err){
							jobsInformation.push({name : job,status : 'none'});
						}
						else{
							try{
								var jobInfo 	= JSON.parse(data);
								//Get the informations
								duration		= jobInfo.duration;
								result 			= jobInfo.result;
		
								//create the job object
								var jobDescription = {
									'name'		: job,
									'status' 	: status,
									'duration' 	: duration,
									'result'	: result
								}
		
								//Push it to the jobsInformation
								jobsInformation.push(jobDescription);
							}catch(e){
								jobsInformation.push({'name' : job,'status' : 'none'});
							}
						}
						if(jobsInformation.length == jobList.length){
							jobCallback(null, {title : config.widgetTitle, jobList : jobsInformation,jenkinsServer : config.jenkinsServer});
						}
					}
				);
			}catch(e){
				jobsInformation.push({'name' : name,'status' : 'none'});
				jobCallback(null,{title : config.widgetTitle, jobList : jobsInformation,jenkinsServer : config.jenkinsServer});
			}

		}

		function main(){
			try{
				jobList.forEach(function(job){
					getJobInformation(job).then(
						function(data){
							getJobPersoInfo(job,data);
						},
						function(err){
							jobsInformation.push({'name' : name,'status' : 'none'});
							jobCallback(null,{title : config.widgetTitle, jobList : jobsInformation,jenkinsServer : config.jenkinsServer});
						}
					);
				});
			} catch(e){
				jobCallback(null, {title: config.widgetTitle,jobList : jobsInformation,jenkinsServer : config.jenkinsServer});
			}
		}

		//Beginnning of the application
		authenticationVerification(option).then(
			//If the authentication works
			function(data){
				main();
			},
			//else
			function(err){
				jobsInformation.push({'status': 'authenticationError'});
				jobCallback(null, {title: config.widgetTitle,jobList : jobsInformation,jenkinsServer : config.jenkinsServer});
			}
		);
	}
};