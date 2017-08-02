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
				var campaingInfo = "";
				campaingInfo+=`
					<table class="CampaignTable">
						<tr class="header">
							<th class="it"> Iteration</th>
							<th class="todo"> To Do </th>
							<th class="IP"> In Progress </th>
							<th class="S"> Success </th>
							<th class="F"> Failure </th>
							<th class="B"> Blocked </th>
							<th class="nt"> Non Testable </th>
							<th class="pt"> Planified Tests </th>
							<th class="a"> Avancment </th>
						</tr>`
				;
				//Then create a tab to add all of the itérations
				campaign.iterations.forEach(function(iteration){
					campaingInfo+=
						`<tr>
							<th class="longTitle"> ${iteration.nom}</th>
							<th class="todo"> ${iteration.Aexecuter} </th>
							<th class="IP"> ${iteration.EnCours} </th>
							<th class="S"> ${iteration.Succes} </th>
							<th class="F"> ${iteration.Echec} </th>
							<th class="B"> ${iteration.Bloque} </th>
							<th class="nt"> ${iteration.NonTestable} </th>
							<th class="pt"> ${iteration.Planifies} </th>
							<th class="a"> ${iteration.Avancement} </th>
						</tr>`
					;
				});
				//! Remember to close the table balise
				campaingInfo+=`</table>`;
				$content.append(campaingInfo);
			});
		}catch(e){
			console.log(e);
			$content.append(`
				<div class="error"> No data found </div>
			`);
		}

	}
};