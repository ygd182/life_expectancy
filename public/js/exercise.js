var waitForFinalEvent = (function () {
  var timers = {};
  return function (callback, ms, uniqueId) {
    if (!uniqueId) {
      uniqueId = "Don't call this twice without a uniqueId";
    }
    if (timers[uniqueId]) {
      clearTimeout (timers[uniqueId]);
    }
    timers[uniqueId] = setTimeout(callback, ms);
  };
})();

(function() {
	var circleDimesion = 30;
	var exercise = null;
	var intervalFunction = null;
	var fullscreenMode = false;
	var cloneExercise = null;
	var defaultExercise = {
	 from: null,
	 to: null,
	 blink: false,
	 blinkSpeed: 0,
	 reps: 0,
	 duration: 0
	};

	function getData() {
		var exercise = defaultExercise;
		exercise.from = $('#from-input').val();
		exercise.to = $('#to-input').val();
		exercise.blink = $('#blink-check').val();
		exercise.blinkSpeed = $('#blink-speed-input').val();
		exercise.duration = $('#duration-input').val();
		exercise.reps = $('#reps-input').val();
		return exercise;
	}

	function showCountdown() {
		$('#clock').removeClass('hidden');
		$('#circle').hide();

    	var totalSeconds = new Date().getTime() + exercise.rest *1000;
    	$('#clock').countdown(totalSeconds, function(event) {
		  var totalHours = event.offset.totalDays * 24 + event.offset.hours;
		  $(this).html(event.strftime(totalHours + '%S sec'));
		});
	}

	function animateCircle(exercise) {
		if(exercise.reps > 0) {
			$('#circle').css(exercise.from);
			$('#circle').show();
			if(exercise.blink) {
				$('#circle').addClass('blink');
				$('#circle').css("animation-duration", 1/8*exercise.blinkSpeed + 's');
			}
			$('#circle').animate({top: exercise.to.top +'px', left: exercise.to.left +'px'}, exercise.duration*1000, function complete(){
		    	$('#circle').removeClass('blink');
		    	cloneExercise = jQuery.extend(true, {}, exercise);
		    	cloneExercise.reps--;

		    	if(cloneExercise.reps > 0) {
		    		showCountdown();
		    	}else {
		    		/*stopAnimation();
		    		$('.action-btn-container').removeClass('hidden'); */
					window.location.href = '/exercise-list.html';
				}
		    	
		    	intervalFunction = setTimeout(function(){ animateCircle(cloneExercise) }, exercise.rest *1000 + 100);
		    });
		} else {
			/*stopAnimation();
			$('.action-btn-container').removeClass('hidden'); */
			window.location.href = '/exercise-list.html';
		}
		
	}

	function stopAnimationByReps() {
	    clearTimeout(intervalFunction);
	}

	function stopAnimation() {
		$('#circle').hide();
		$('#circle').stop();
		$('#circle').removeClass('blink');
		stopAnimationByReps();
	}


	function startanimation() {
		$('.action-btn-container').removeClass('hidden'); 

		$('.navbar').hide();
		$('.exercise-movement_wrapper').removeClass('hidden'); 
		$('#fullscreen-alert').hide();
		exercise.from = $('#span' + exercise.fromId).position();
		exercise.to = $('#span' + exercise.toId).position();
		animateCircle(exercise);
	}


	//------------------------------------------
	function startAnimation() {
		$('.exercise-movement_wrapper').removeClass('hidden'); 
		exercise.from = $('#span' + exercise.fromId).position();
		exercise.to = $('#span' + exercise.toId).position();
		animateCircle(exercise);
	}

	function enterFullScreen() {
		$('.navbar').addClass('hidden');
		$('#fullscreen-alert').addClass('hidden');
		$('.exercise-movement_wrapper').removeClass('hidden'); 
		$('.action-btn-container').removeClass('hidden'); 
	}
	//--------------------------------------------------------
	function isFullscreen() {
		return (screen.width === window.innerWidth && screen.height-10  <= window.innerHeight);
	}

	function onSucess(data) {
		exercise = data;
		$('#start-animation-btn').removeClass('disabled');
	}

	function bindWindowResize() {
		$(window).resize(function () {
			//always sotpAnimation by default
			stopAnimation();
			$('#myModal').modal();

		    waitForFinalEvent(function(){
		    	$('#myModal').modal("hide");
		        if(isFullscreen()){
		       		// this is full screen
		    		enterFullScreen();
	    		}else {
		    		$('.exercise-movement_wrapper').addClass('hidden'); 
					stopAnimation();
					$('.navbar').removeClass('hidden'); 
					$('#fullscreen-alert').removeClass('hidden'); 
		       }
		    }, 500, "some unique string");
		});
	}

	function bindEvents() {
		$('#clock').on('finish.countdown', function() {
    		setTimeout(function(){ $('#clock').addClass('hidden'); },100);
	    });

	    $('#start-animation-btn').on('click', function(e) {
	    	e.preventDefault();
	    	if(!$(e.target).hasClass('disabled')) {
	    		$('.action-btn-container').addClass('hidden');
	    		startAnimation();
	    	}
	    });

	    $('#return-list-btn').on('click', function(e) {
	    	e.preventDefault();
	    	window.location.href = '/exercise-list.html';
	    });
		bindWindowResize();
	}

	$(document).ready(function ready(){
		
		var id = common.getParameterByName('id');
		exerciseService.getExercise(id).then(onSucess,common.onError);
			
	    if(isFullscreen()) {
       		// check if the user never left fullscreen mode
    		enterFullScreen();
		}

		bindEvents();
		
	});

})();
