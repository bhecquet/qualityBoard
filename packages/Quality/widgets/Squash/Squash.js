widget = {
	//runs when we receive data from the job
	onData: function (el, data) {

		//The parameters our job passed through are in the data object
		//el is our widget element, so our actions should all be relative to that
		if (data.title) {
			$('h2', el).text(data.title);
		}

		//For each campaign, show the full tab

		var $content = $('.content',el);
		$content.empty();
		var campaign = data.Campaigns;
		console.log(campaign);

		try{
			campaign.forEach(function(campaign){
				var name = campaign.name;
				//First add the name of the campaign
				$content.append(`<div class="name"> ${name} </div> `);
				//Add the header of the tab
				$content.append(`
					<table class="CampaignTable">
						<tr class="header">
							<th> Iteration</th>
							<th> To Do </th>
							<th> In Progress </th>
							<th> Success </th>
							<th> Failure </th>
							<th> Blocked </th>
							<th> Non Testable </th>
							<th> Planified Tests </th>
							<th> Avancment </th>
						</tr>`
				);
				//Then create a tab to add all of the itérations
				campaign.iterations.forEach(function(iteration){
					$content.append(
						`<tr>
							<th> ${iteration.nom}</th>
							<th> ${iteration.Aexecuter} </th>
							<th> ${iteration.EnCours} </th>
							<th> ${iteration.Succes} </th>
							<th> ${iteration.Echec} </th>
							<th> ${iteration.Bloque} </th>
							<th> ${iteration.NonTestable} </th>
							<th> ${iteration.Planifies} </th>
							<th> ${iteration.Avancement} </th>
						</tr>`
					);
				});
				//! Remember to close the table balise
				$content.append(`</table>`);
			});
		}catch(e){
			console.log(e);
			$content.append(`
				<div class="error"> No data found </div>
			`);
		}

	}
};