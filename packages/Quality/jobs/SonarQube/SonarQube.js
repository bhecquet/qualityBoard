module.exports = {


	onRun: function (config, dependencies, jobCallback) {
		//Authetication informations:
		var user = config.username;
		var password = config.password;
//Three part in the widget :
	//Left 		: Metric list and values
	//Right 	: Global progression of the project 
	//Bottom 	: Unit tests and project coverage


	//Metric values part 

		var tab = new Array();
		tab = [];
		var list = config.metricList;
		var adress = config.metricAdress + config.project + "&metricKeys=";

		/*use request to support the authetication*/


		try{
			list.forEach(function(metrique){
				adress = config.metricAdress + config.project + "&metricKeys=" + metrique;
				dependencies.request.get(adress,{
						'auth' : {
							'user' : user,
							'pass' : password
						}
					},
					function(err,response,body){
					if(body){
						//request return a string, not a JSON object
						var jSonFile = JSON.parse(body);
						if(jSonFile.component){
							if(jSonFile.component.measures){
					 			tab.push(jSonFile.component.measures[0]); 
							}
						}else if(jSonFile.err_code){
							tab.push(jSonFile.err_msg);
						} else if(jSonFile.errors){
								tab.push(jSonFile.errors[0]);
							}
						} 
					}
				);

			});
			} catch(e){
				tabTest = []
				console.log(e);
		} 
		
		


	//Test Part
		//This part is composed of two parts : a graphic on the left and a list on the right

		//Test metrics values
		var tabTest = new Array();
		tabTest = [];
		var adress = "";
		var list = config.testList;


		try{
			list.forEach(function(metrique){
				adress = config.metricAdress + config.project + "&metricKeys=" + metrique;
				dependencies.request.get(adress,{
						'auth' : {
							'user' : user,
							'pass' : password
						}
					},
					function(err,response,body){
					if(body){
						//request return a string, not a JSON object
						var jSonFile = JSON.parse(body);

						if(jSonFile.component){
							if(jSonFile.component.measures){
					 			tabTest.push(jSonFile.component.measures[0]); 
							}
						} else{
							if(jSonFile.errors){
								tabTest.push(jSonFile.errors[0]);
							}
						} 
					}
				});

			});
			} catch(e){
				tabTest = []
				console.log(e);
		}


		// Coverage graphic

		var graphicTest = new Array();
		graphicTest = [];
		var graphicAdress = config.graphicAdress + config.project +  "&metrics=coverage" ;
		dependencies.request.get(graphicAdress,{
				'auth' : {
					'user' : user,
					'pass' : password
				}
			},
			function(err,response,body){
			if(body){
				var jSonFile = JSON.parse(body);
				if(jSonFile[0]){
					if(jSonFile[0].cells){	
						jSonFile[0].cells.forEach(function(test){
										graphicTest.push(test.v[0]);
									});
					} 
				}
			}

	//Avancment Part
			var adress = config.graphicAdress + config.project + "&metrics=" +  config.Avancement;
			var Globalgraphic = new Array();
			Globalgraphic = [];
			dependencies.request.get(adress,{
				'auth' : {
					'user' : user,
					'pass' : password
				}
			},
			function(err,response,body){
				if(body){
					jSonFile = JSON.parse(body);
					if(jSonFile[0]){
						if(jSonFile[0].cells){
							jSonFile[0].cells.forEach(function(test){
								Globalgraphic.push(test.v[0]);
							});
						}
					}
				}

				jobCallback(null,{title : config.title, project : config.project,
					metricValues : tab, begin : config.metricLinkB, end : config.metricLinkE,
					Globalgraphic : Globalgraphic, testValues : tabTest, graphicTest : graphicTest });				
			})
		})
	}
};