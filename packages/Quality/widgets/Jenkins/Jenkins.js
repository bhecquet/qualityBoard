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

	//The main container of the widget
		var $content = $('.content', el);
		$content.empty();
		var jobInfo = data.jobList.sort(nameSort);
		var jobLink = data.jenkinsServer + '/job/';

		try{
			//ForEach job, print the different informmations.
			jobInfo.forEach(function(job){
				var jobPersoLink = jobLink + job.name + '/';
				if(job.status == 'none'){
					var jobInfoHTML = 
						`<div class="job">
							 <div class="name"> <a href = "${jobPersoLink}"> ${job.name} </a></div>
							 <div class="error"> No build found </div>
						</div>`
					;
				}
				else{
					var jobInfoHTML = 
						`<div class="job">
							<div class="name"> <a href = "${jobPersoLink}"> ${job.name} </a></div>
							 <div class="description"> 
							 	<span class = "title"> Duration  </span><span class = "figure"> ${job.duration} </span>
							 	<span class = "title"> Success  </span><span class = "${job.result}"> ${job.result} </span>
							 </div>
							 <div class="status"> <span class = "title">Status</span> <span class="${job.status}">${job.status} </span> </div>
						</div>`
					;
				}
				$content.append(jobInfoHTML);
			});
		}catch(e){
			console.error(e);
		}
	}
};