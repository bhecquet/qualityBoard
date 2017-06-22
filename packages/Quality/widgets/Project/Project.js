widget = {

	onInit: function(el){
		 $(".gridster ul").gridster().data('gridster').disable();
	},//Disable drag&drop
	//runs when we receive data from the job
	onData: function (el, data) {
		$('.titreBoard', el).empty();
		$('.titreBoard', el).append(data.project);
	}
};