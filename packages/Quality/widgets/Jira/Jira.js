widget = {
		
	onData: function (el, data) {
		if (data.title) {
			$('h2', el).text(data.title);
		}

		//Function to sort the issues by id
		function idSort(obj1,obj2){
			if (obj1.title < obj2.title) return -1;
			else if (obj1.title == obj2.title) return 0;
			else return 1;
		}

		//Function to sort the issues by priority

		function priorSort(obj1,obj2){
			var result = 0;
			switch(obj1.priority){
				case 'Undefined':
					if(!(obj2.priority === 'Undefined')){
						result = -1;
					}
					break;
				case 'Majeure':
					if(!(obj2.priority === 'Majeure')){
						result = 1;
					}
					break;
				case 'Secondaire':
					if(obj2.priority === 'Majeure'){
						result = -1;
					} else if(obj2.priority === 'Undefined'){
						result = 1
					}
					break;
			}
			return -result;
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
		$IssuesList = $('.IssuesList',el);
		var issues = data.IssuesList.sort(priorSort);
		var prior = "";
		console.log($IssuesList);
		issues.forEach(function(issue){
			prior = "";
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
					prior = 'error';
					break;
			}
			var id = issue.id;
			var priority = issue.priority;
			var status = issue.status;
			var type = issue.type;
			var title = issue.title;
			var adress = data.jiraServer + '/projects/' + data.project + 
						'/issues/' + id;//Link to the real issue
			//If to be sure there is a title
			if(title){
				$IssuesList.append(
							'<tr class="' + prior +'"> ' + 
								'<th class="priority">   ' + priority + '</th>' +
								'<th class="status">   ' + status + '</th>' + 
								'<th class ="type">   ' + type + '</th>' +
								'<th class="title"> <a href="' + adress +'">' + title + '</a></th>' +
							'</tr>'
						);
			}
			console.log(issue.type);
		});
	}
};