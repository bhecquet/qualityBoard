module.exports = {
	onInit: function (config, dependencies) {

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
		var option = {
			'auth' : {
				'user' : user,
				'pass' : password
			}
		};

		//Adresses
		var jobsAdress		= config.jenkinsServer + config.jenkinsRequest;//Adress to the Jenkins job list.
		var jobAdressBase 	= config.jenkinsServer + config.jobRequest;//Adress of the job informations

		//Job list
		var jobList 		= config.jobList;

		//Job informations tab
		var jobsInformation	= [];//Tab send to the widget, and containning the job informations

		//Informations variables
		var name 		= "";
		var status 		= 'none';
		var duration 	= 'none';
		var result 		= 'none';
			//Those variables will be stocked in

		//Auxilaries function

			//Return true if a valu is in a tab
		function isIn(value,tab){
			var res 	= false;
			if(tab.length > 0){
				tab.forEach(function(v){
					if(v == value){
						res = true;
					}
				});
			}
		} 

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


		function getJobInformation(job){
			return new Promise(function(resolve, reject){
				//First get the status in the jobsAdress part
				try{
					dependencies.request.get(
						jobsAdress,
						option,
						function(err,response,data){
							if(err){
								reject(err);
							}
							//The job list is in data.jobs
							//!! data is a string, not a JSON object !!
							var jobsListGlobal = JSON.parse(data).jobs;
							jobsListGlobal.forEach(function(job){
								if(job.name == job){
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
		function getJobPersoInfo(job,data){
			var adressJob = jobAdressBase.replace(/<jobName>/gi,job);
			try{
				dependencies.request.get(
					adressJob,
					option,
					function(err,response,data){
						var jobInfo 	= JSON.parse(data);
						//Get the informations
						duration		= jobInfo.duration;
						result 			= jobInfo.result;

						//create the job object
						var jobDescription = {
							'name'		: job,
							'status' 	: data,
							'duration' 	: duration,
							'result'	: result
						}

						//Push it to the jobsInformation
						jobsInformation.push(jobDescription);
						if(jobsInformation.length == jobList.length){
							jobCallback(null, {title : config.widgetTitle, jobList : jobsInformation});
						}
					}
				);
			}catch(e){
				jobsInformation.push({'name' : name,'status' : 'none'});
			}

		}

		function main(){
			try{
				jobList.forEach(function(job){
					var job = job;
					getJobInformation(job).then(
						function(data){
							getJobPersoInfo(job,data);
						},
						function(err){
							jobsInformation.push({'name' : name,'status' : 'none'});
						}
					);
				});

			} catch(e){
				jobCallback(null, {title: config.widgetTitle,jobList : jobsInformation});
			}
		}

		main();
	}
};