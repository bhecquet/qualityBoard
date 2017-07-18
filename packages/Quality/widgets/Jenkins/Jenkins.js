widget = {
  //runs when we receive data from the job
	onData: function (el, data) {

		if (data.title) {
			$('.widget-title', el).text(data.title);
		}

	//Function to sort by name
		function nameSort(job1,job2){
			if (job1.name < job2.name) return -1;
			else if (job1.name == job2.name) return 0;
			else return 1;
		}
	
	//Function to convert milliseconds to minutes
		function millisToMinutesAndSeconds(millis) {
			var minutes = Math.floor(millis / 60000);
			var seconds = ((millis % 60000) / 1000).toFixed(0);
			return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
		}

	//The main container of the widget
		var $content = $('.table', el);
		$content.empty();
		var jobInfo = data.jobList.sort(nameSort);
		var jobLink = data.jenkinsServer + '/job/';

		try{
			//ForEach job, print the different informmations.
			jobInfo.forEach(function(job){
				var jobPersoLink = jobLink + job.name + '/';
				if(job.status == 'none'){
					var jobInfoHTML = 
						`<tr class="job">
							 <th class="name"> <a href = "${jobPersoLink}"> ${job.name} </a></th>
							 <th class="error"> No build found </th>
							 <th class="empty"> </th>
						</tr>`
					;
				}
				else if(job.status == 'authenticationError'){
					var jobInfoHTML = 
						`<div class="authenticationError"> Authentication Error </div>` 
					;
				}
				else{
					var resultImage = '';
					switch(job.result){
						case 'SUCCESS':
							resultImage = '<img src="/widgets/resources?resource=Quality/Jenkins/SuccessIcon.png">';
							break;
						case 'FAILURE':
							resultImage = '<img src="/widgets/resources?resource=Quality/Jenkins/FailureIcon.png">';
							break;
						default:
							resultImage = '<img src="/widgets/resources?resource=Quality/Jenkins/MissingIcon.png">';
					}
					/*var jobInfoHTML = 
						`<div class="job">
							<span class="name"> <a href = "${jobPersoLink}"> ${job.name} </a></span>
							 <span class="description"> 
							 	<span class = "title"> Duration  </span><span class = "figure"> ${millisToMinutesAndSeconds(job.duration)} </span>
							 	<span class = "title">  </span><span class = "${job.result}"> ${resultImage} </span>
							 </span>
						</div>`
					;*/
					var jobInfoHTML =
						`<tr class="job">
							<th class="name"> <a href = "${jobPersoLink}"> ${job.name} </a> </th>
							<th class="duration"><span class = "title"> Duration  </span><span class = "figure"> ${millisToMinutesAndSeconds(job.duration)} </span></th>
							<th class="status">${resultImage} </th>
						</tr>`
					;
				}
				$content.append(jobInfoHTML);
			});
		}catch(e){
			console.error(e);
		}
	}
};