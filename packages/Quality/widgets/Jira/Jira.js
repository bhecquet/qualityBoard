widget = {
		
	onData: function (el, data) {

		//Title of the widget : the server name
		if (data.title) {
			$('h2', el).text(data.title);
		}


		// Functions to sort the different issues
			//Function to sort the issues by id
				function idSort(issue1,issue2){
					if (issue1.title < issue2.title) return -1;
					else if (issue1.title == issue2.title) return 0;
					else return 1;
				}

			//Function to sort the issues by priority

				function priorSort(issue1,issue2){
					var result = 0;
					switch(issue1.priority){
						case 'Undefined':
							if(!(issue2.priority === 'Undefined')){
								result = -1;
							}
							break;
						case 'Majeure':
							if(!(issue2.priority === 'Majeure')){
								result = 1;
							}
							break;
						case 'Secondaire':
							if(issue2.priority === 'Majeure'){
								result = -1;
							} else if(issue2.priority === 'Undefined'){
								result = 1
							}
							break;
					}
					return -result;
				}

		//The widget is made of 3 distinct parts :
			//Up : Project name and version
			//Middle : statistique on the issues
			//Down : Issues table

		//In the project part, name and version of the project

		//Name
		$name = $('.name',el);
		$name.empty();
		$name.append(
			'<span class="libele"> project : </span> <span class="figure"> ' + data.project
		);

		//Version
		$version = $('.version',el);
		$version.empty();
		$version.append(
			'<span class="libele"> version : </span> <span class="figure"> ' + data.version
		);

		

		//The number of issues : 

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
		$IssuesList.empty();

		//Title of the table
		$IssuesList.append('<tr class="titre"> ' + 
			'<th class="priority"> priority </th> ' +
			'<th class="status"> status </th>' + 
			'<th class ="type">  type  </th>' +
			'<th class="title"> title </th> ' +
		'</tr>');

		var issues = data.IssuesList.sort(idSort).sort(priorSort);
		var prior = "";
		console.log($IssuesList);
		issues.forEach(function(issue){
			prior = "";
			//The background of the issue will depands of its priority
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
			//Get all the informations
			var id = issue.id;
			var priority = issue.priority;
			var status = issue.status;
			var type = issue.type;
			var title = issue.title;
			var adress = data.jiraServer + '/projects/' + data.project + 
						'/issues/' + id;//url of the real issue on Jira
			
						//IssuesTab is the tab of the issues, it will be show on the widget
			$IssuesList.append(
						'<tr class="' + prior +'"> ' + 
							'<th class="priority">   ' + priority + '</th>' +
							'<th class="status">   ' + status + '</th>' + 
							'<th class ="type">   ' + type + '</th>' +
							'<th class="title"> <a href="' + adress +'">' + title + '</a></th>' +//Link to the issue on Jira
						'</tr>'
					);			
		});
	}
};