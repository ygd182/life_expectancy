(function() {
	

	var template = {};
	

	function bindEvents() {


		$(document).on('click', '#submit-btn', function(e) {
			e.preventDefault();
			getExerciseData();
			
		});

	}

	$(document).ready(function ready(){
		bindEvents();
		loadTemplates();

		
	});


	function render(data) {
		/*var navbarModel = {adminActive: true, listActive: false};
		$('#navbar-container').html(Mustache.render(template.navbar, navbarModel));*/

		
		var viewModel = { result: 96};
 		$('#result-wrapper').html(Mustache.render(template.result, viewModel));
 		/*
 		
 		modalView.init('#js-modal-container', template.modal);
 		modalView.options({has_cancel: false, body: 'Exercise saved.', title: 'Notification', confirm_color: 'primary', confirm_text: 'Dismiss'});
		modalView.bindConfirmAction(restorePage);
		modalView.render();*/
	}

	function getExerciseData() {

		//exerciseService.getExercise(exerciseId).then(render, onError);
	
		render({});
	}

	function loadTemplates() {
		common.loadTemplates(['results'/*, 'navbar', 'modal'*/]).done(function(temp1/*, temp2, temp3*/) {
			template.result = temp1;
			/*template.navbar = temp2[0];
			template.modal = temp3[0];*/
			//getExerciseData();
		});
	}

})();

