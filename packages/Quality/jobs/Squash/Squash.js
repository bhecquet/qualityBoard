module.exports = {

	onInit: function (config, dependencies) {

	},

	onRun: function (config, dependencies, jobCallback) {

    	//This job will get informations from the Squash server.


    	//To test the display functions : 

      		//Mocked iterations : 
				var it1 = {
					nom         : "Un nom très très long pour voir ce que ça donne ",
					Aexecuter   : 1,
					EnCours     : 5,
					Succes      : 4,
					Echec       : 1,
					Bloque      : 1,
					NonTestable : 6,
					Planifies	:2,
					Avancement  : '66%'
				};

				var it2 = {
					nom         : "IT_2",
					Aexecuter   : 1,
					EnCours     : 5,
					Succes      : 2,
					Echec       : 1,
					Bloque      : 1,
					NonTestable : 2,
					Planifies 	: 2,
					Avancement  : '24%'
				};

				var it3 = {
					nom         : "IT_3",
					Aexecuter   : 1,
					EnCours     : 2,
					Succes      : 3,
					Echec       : 4,
					Bloque      : 5,
					NonTestable : 6,
					Planifies	: 1,
					Avancement  : '87%'
				};

			//Mocked Campaigns

			var Camp1 = {
				name 		: 'Camp1',
				iterations	: [it1,it2,it3]
			};

			var Camp2 = {
				name 		: 'Camp2',
				iterations 	: [it1,it3]
			};

			//Mocked CallBack
			var Campaigns = [Camp1,Camp2];

			//Real code

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

		//	

    	jobCallback(null, {title: config.widgetTitle, Campaigns : Campaigns});

  }
};