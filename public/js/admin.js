(function() {
	

	var template = {};
	
	var defaultUserInfo = {
		age: 0,
		zipCode:0,
		gender:'male',
		height:0,
		weight:0
	};

	var zipCodes = [];

	function getZipCodes(gender) {
		return $.ajax({
		  type: "GET",
		  url: "/zipcode?gender="+ gender,
		});
	}


	function getGender() {
		return $('input[type="radio"]:checked').val();
	}

	function getData() {
		var userInfo = defaultUserInfo;
		userInfo.age = $('#inputAge').val();
		userInfo.zipCode = $('#inputZip').val();
		userInfo.gender = getGender();
		userInfo.height = $('#inputHeight').val();
		userInfo.weight = $('#inputWeight').val();	
		console.log(userInfo);
		return userInfo;
	}

	function isValidZipcode(zip) {
		return zipCodes.some(function(id) {
			return id == zip;
		})
	}

	function bindEvents() {

		$(document).on('click', '#submit-btn', function(e) {
			e.preventDefault();
			var userInfo = getData();
			if(!$(e.target).hasClass('disabled')) {

				getZipCodes(userInfo.gender).then(function(data){
					zipCodes = data;

					if(isValidZipcode(userInfo.zipCode)){
					localStorage.setItem('userinfo', JSON.stringify(userInfo));
					window.location.href = 'result.html';
					}else {
						alert('The zip code is invalid');
					}

				}, common.onError);
					
			
			}
			
		});


		$('#inputHeight').slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});

		$('#inputWeight').slider({
			formatter: function(value) {
				return 'Current value: ' + value;
			}
		});

	}

	$(document).ready(function ready(){
		bindEvents();

	});


})();

