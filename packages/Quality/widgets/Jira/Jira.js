widget = {
		
	onData: function (el, data) {
		if (data.title) {
			$('h2', el).text(data.title);
		}

		//In the project part, name and version of the project
		$name = $('.name',el);
		$name.empty();
		$name.append(
			'<span class="libele"> project : </span> <span class="figure"> ' + data.project
		);


		$version = $('.version',el);
		$version.empty();
		$version.append(
			'<span class="libele"> version : </span> <span class="figure"> ' + data.version
		);

		//The issues numbers : 

		$iNb= $('.IssueNumber',el);
		$iNb.empty();
		$iNb.append(
			'<span class="libele"> Number of issues : </span> ' + 
			'<span class="figure">' + data.nbIssues + '</span>'
		);

		//Stat on the issues
			//Priorities
		$Pri=$('.Priorities',el);
		$Pri.empty();
		$Pri.append(
			'<div class="libele"> Major : <span class=figure>' + data.nbMajeur + '</span></div>'+
			'<div class="libele"> Second : <span class=figure>' + data.nbSecond + '</span></div>'+
			'<div class="libele"> Undefined : <span class=figure>' + data.nbUndefined + '</span></div>'
		);
			//Status
		$Sta = $('.Status',el);
		$Sta.empty();
		$Sta.append(
			'<div class="libele"> Open : <span class=figure>' + data.nbOpen + '</span></div>'+
			'<div class="libele"> In Progress : <span class=figure>' + data.nbInProcess + '</span></div>'+
			'<div class="libele"> Done : <span class=figure>' + data.nbDone + '</span></div>'
		);

		//IssuesList
		$IssuesList = ('.IssuesList',el);
		

		var issues = data.IssuesList;

		issues.forEach(function(issue){
			var prior = "";
			//The background of the issu will depands of its priority
			switch(issue.priority){
				case 'Undefined':
					prior = "undefined";
					break;
				case 'Majeure':
					prior = 'major';
					break;
				case 'Secondaire':
					prior = 'second';
					break;
				default:
					break;
			}
			$IssuesList.append(
				'<div class="' + prior +'">' + 
					'<span class="priority>' + issue.priority + '</span>' +
					'<span class="status">' + issue.status + '</span>' + 
					'<span class ="type">' + issues.type + '</span>' +
					'<div class="name">' + issue.title + '</span>' +
				'</div>'
			);
		});
	}
};