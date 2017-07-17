widget = {
  //runs when we receive data from the job
	onData: function (el, data) {

		if (data.title) {
			$('.widget-title', el).text(data.title);
		}

	//The main container of the widget
		var $content = $('.content', el);

		var jobInfo = data.jobList;

		try{
			//ForEach job, print the different informmations.
			jobInfo.forEach(function(job){
				var jobInfoHTML = 
					`<div class="job">
						<div class="name"> ${job.name} </div>
						 <div class="description"> 
						 	<span class = "title"> Duration  </span><span class = figure> ${job.duration} </span>
						 	<span class = "title"> Success  </span><span class = figure> ${job.result} </span>
						 </div>
						 <div class="status"> ${job.status} </div>
					</div>`
				;
				$content.empty();
				$content.append(jobInfoHTML);
			});
		}catch(e){
			console.error(e);
		}
	}
};