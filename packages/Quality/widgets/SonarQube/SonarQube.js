widget = {
	//runs when we receive data from the job
	onData: function (el, data) {
	//Widget title
		if (data.title) {
			$('h2', el).text(data.title);
		}


		function valueSort(obj1,obj2){
			if (obj1.metric < obj2.metric) return -1;
			else if (obj1.metric == obj2.metric) return 0;
			else return 1;
		}
//left part : metrics
		var $metric = $('.metric',el);

		$metric.empty();
		if (data.metricValues.length) {
			var tab = data.metricValues.sort(valueSort);

			tab.forEach(function (metrique) {
				$metric.append(
						"<div class='item-container'>" +
							"<a class='issue' href='" + data.begin + metrique.metric + data.end + data.project + "'>" + metrique.metric + "</a>" +
							"<span class='count'>" + metrique.value + "</span>" +
						"</div>"
				);

			})
		}

//Right part : Global avancment

		var $graphA = $('.graphAvancment',el);
		var $titleA = $('.titleAvancment',el);

		$graphA.empty();
		$titleA.empty();
		$('.graphAvancment',el).empty();

		$graphA.html(data.Globalgraphic.join(","));

		$graphA.peity("line", {
			colour : '#a3c6ff',
			width: 325,
			height: 175,
			strokeColour: '#0f5bd8',
			strokeWidth: 3
		});	

		$titleA.empty();
		$titleA.append("Avancement du projet : <a href='http://vs-dev15:9000/component_measures/metric/sqale_index/list?id=com.infotel.seleniumRobot%3Acore'> Dettes techniques </a>");


//Bottom part : Test and coverage

	//Right part : test metrics

		var $testM = $('.testValues',el);
		var err = 0;// is there an error or a failure in any test? 

		$testM.empty();
		$testM.empty();

		if (data.testValues.length) {
			data.testValues.sort(valueSort);
			data.testValues.forEach(function (metrique) {
				$testM.append(
					"<div class='item-container'>" +
						"<a class='issue' href='" + data.begin + metrique.metric + data.end + "'>" + metrique.metric + "</a>" +
						"<div class='count'>" + metrique.value + "</div>" +
					"</div>"
				);
				if(metrique.metric == 'test_success_density'){
					err = metrique.value;
				}
			})
		}


	//Left part : graphic

	var $graphTest = $('.graphTest',el);

	$graphTest.empty();
	$graphTest.html(data.graphicTest.join(","));

	// The graphic color depends of the test_errors_density
	if(err == 100){
		//green graphic if their is no test error or failure
		$graphTest.peity("line", {
				colour : '#a3ffc4',
				width: 250,
				height: 125,
				strokeColour: '#17d15b',
				strokeWidth: 3
				});
	} else {//graph in red
		$graphTest.peity("line", {
				colour : '#ff848a',
				width: 250,
				height: 125,
				strokeColour: '#d11720',
				strokeWidth: 3
				});
	}		


	}
};