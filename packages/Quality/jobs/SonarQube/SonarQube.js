module.exports = {


	onRun: function (config, dependencies, jobCallback) {

//Three part in the widget :
	//Left 		: Metric list and values
	//Right 	: Global progression of the project 
	//Bottom 	: Unit tests and project coverage

	//Metric values part 

		var tab = new Array();
		tab = [];
		var list = config.metricList;
		var adress = config.metricAdress + config.project + "&metricKeys=";


		if(list){
			list.forEach(function(metric){
						adress = adress + metric + ",";
					});
					adress = adress.substring(0,adress.length - 1);
		}

		dependencies.easyRequest.JSON(adress, function(err, body){
			if(body.component){
		 		body.component.measures.forEach(function(metric){
		 			tab.push(metric);
		 		});
			}
		});
		


	//Test Part
		//This part is composed of two parts : a graphic on the left and a list on the right

		//Test metrics values
		var tabTest = new Array();
		tabTest = [];
		var adress = "";
		var list = config.testList;


		/*if(list){
			list.forEach(function(metrique){
				adress = config.metricAdress + config.project + "&metricKeys=" + metrique;
				dependencies.easyRequest.JSON(adress, function(err, body){
				 	tabTest.push(body.component.measures[0]); 
				});
			});
		}
*/
		try{
			list.forEach(function(metrique){
				adress = config.metricAdress + config.project + "&metricKeys=" + metrique;
				dependencies.easyRequest.JSON(adress, function(err, body){
					if(body){
						if(body.component.measures){
				 			tabTest.push(body.component.measures[0]); 
						} 
					}
				});
			});
			} catch(e){
				tabTest = []
		}
		// Coverage graphic

		var graphicTest = new Array();
		graphicTest = [];
		var graphicAdress = config.graphicAdress + config.project +  "&metrics=coverage" ;
		dependencies.easyRequest.JSON(graphicAdress, function(err,body){

			if(body[0]){
				if(body[0].cells){	
					body[0].cells.forEach(function(test){
									graphicTest.push(test.v[0]);
								});
				} 
			}




	//Avancment Part
			var adress = config.graphicAdress + config.project + "&metrics=" +  config.Avancement;
			var Globalgraphic = new Array();
			Globalgraphic = [];
			dependencies.easyRequest.JSON(adress, function(err,body){
				if(body[0]){
					if(body[0].cells){
						body[0].cells.forEach(function(test){
							Globalgraphic.push(test.v[0]);
						});
					}else {
					graphicTest = [];
					}
				}else {
					graphicTest = [];
				}

				jobCallback(null,{title : config.title, project : config.project,
					metricValues : tab, begin : config.metricLinkB, end : config.metricLinkE,
					Globalgraphic : Globalgraphic, testValues : tabTest, graphicTest : graphicTest });				
			})
		})
	}
};