widget = {
		
	onInit: function(el){
		var $content = ('.content',el);
		$content.appand('Hello world !! ');
		console.log('§§§§§§§§§§§§§§§§§§Nya§§§§§§§§§§§§§§§§§');
	},


	onData: function (el, data) {

		console.log('§§§§§§§§§§§§§§§§§§Nya§§§§§§§§§§§§§§§§§');

		//Title of the widget : the server name
		if (data.title) {
			$('h2', el).text(data.title);
		}

		//Adress to the issues by stats

		var majorURL = data.jiraServer + "/browse/ENVMONITOR-38?jql=project%20%3D%20ENVMONITOR%20and%20priority%20%3D%20Major";
		var undefinedURL = data.jiraServer + "/browse/ENVMONITOR-37?jql=project%20%3D%20ENVMONITOR%20and%20priority%20%3D%20Undefined";
		var secondURL = data.jiraServer + "/browse/ENVMONITOR-47?jql=project%20%3D%20ENVMONITOR%20and%20priority%20%3D%20Secondaire";

		var toDoURL = data.jiraServer + "/browse/ENVMONITOR-61?jql=project%20%3D%20%22Outil%20de%20supervision%20des%20environnements%20de%20validation%22%20%20and%20statusCategory%20%3D%20%22To%20Do%22%20%20";
		var inProgressURL = data.jiraServer + "/browse/ENVMONITOR-57?jql=project%20%3D%20%22Outil%20de%20supervision%20des%20environnements%20de%20validation%22%20%20and%20statusCategory%20%3D%20%22In%20Progress%22%20%20%20";
		var doneURL = data.jiraServer + "/browse/ENVMONITOR-55?jql=project%20%3D%20%22Outil%20de%20supervision%20des%20environnements%20de%20validation%22%20%20and%20statusCategory%20%3D%20Done%20%20%20%20";

		// Functions to sort the different issues
			//Function to sort the issues by id
				function idSort(issue1,issue2){
					if (issue1.id < issue2.id) return -1;
					else if (issue1.id == issue2.id) return 0;
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
		if (data.project){
			$name.append(
				'<span class="libele"> project : </span> <span class="figure"> ' + data.project
			);
		}
			

		//The number of issues : 

		$iNb= $('.IssueNumber',el);
		$iNb.empty();

		if(data.nbIssues){
			$iNb.append(
					'<span class="libele"> Number of issues : </span> ' + 
					'<span class="figure">' + data.nbIssues + '</span>'
				);
		}

		//Stat on the issues
			//Priorities
		$Pri=$('.Priorities',el);
		$Pri.empty();

		if(data.nbMajeur){
			$Pri.append(
					'<a href="' + majorURL +'"><div class="libele"> Major : <span class=figure>' + data.nbMajeur + '</span></div></a>'+
					'<a href="' + secondURL +'"><div class="libele"> Second : <span class=figure>' + data.nbSecond + '</span></div>'+
					'<a href="' + undefinedURL +'"><div class="libele"> Undefined : <span class=figure>' + data.nbUndefined + '</span></div>'
				);
		}
			//Status
		$Sta = $('.Status',el);
		$Sta.empty();

		if(data.nbOpen){
			$Sta.append(
					'<a href="' + toDoURL +'"><div class="libele"> Open : <span class=figure>' + data.nbOpen + '</span></div>'+
					'<a href="' + inProgressURL +'"><div class="libele"> In Progress : <span class=figure>' + data.nbInProcess + '</span></div>'+
					'<a href="' + doneURL +'"><div class="libele"> Done : <span class=figure>' + data.nbDone + '</span></div>'
				);
		}

		//IssuesList
		$IssuesList = $('.IssuesList',el);
		$IssuesList.empty();

		//Global content
		$content = $('.content',el);

		//Title of the table
		$IssuesList.append('<tr class="titre"> ' + 
			'<th class="id"> id </th> ' +
			'<th class="version">Versions</th>' +
			'<th class="priority"> priority </th> ' +
			'<th class="status"> status </th>' + 
			'<th class ="type">  type  </th>' +
			'<th class="title"> title </th> ' +
		'</tr>');

		console.log(data.IssuesList);

		if(data.IssuesList.length>0){
				//If there is an authentication problem
			if(data.IssuesList[0] === 'Authentication error'){
				$content.empty();
				$content.append('<span class="error"> Authentication Error </span>');
			}else{
				//If no informations in recieved
				if(data.IssuesList[0]==='No informations recieved'){
					$content.empty();
					$content.append('<span class="error">' +'No informations recieved'+ '</span>');	
				}//On a sunny day case
				else{
					var issues = data.IssuesList.sort(idSort).sort(priorSort);
					var prior = "";
					issues.forEach(function(issue){
						if(issue.id != 'Invalide'){
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
							var version = issue.versions;
							var priority = issue.priority;
							var status = issue.status;
							var type = issue.type;
							var title = issue.title;
							var adress = data.jiraServer + '/projects/' + data.project + 
										'/issues/' + id;//url of the real issue on Jira
							
										//IssuesTab is the tab of the issues, it will be show on the widget
							$IssuesList.append(
										'<tr class="' + prior +'"> ' + 
											'<th class="id">   ' + id + '</th>' +
											'<th class="version">   ' + version + '</th>' +
											'<th class="priority">   ' + priority + '</th>' +
											'<th class="status">   ' + status + '</th>' + 
											'<th class ="type">   ' + type + '</th>' +
											'<th class="title"> <a href="' + adress +'">' + title + '</a></th>' +//Link to the issue on Jira
										'</tr>'
									);
						}			
					});
				}
			}
			//If an empty tab is recieved
		}else{
			$content.empty();
			$content.append('<span class="error">' +'No informations recieved'+ '</span>');
		}
	}
};