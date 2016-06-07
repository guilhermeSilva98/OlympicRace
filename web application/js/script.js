$(document).ready(function(){

	var Game = {
		init : function(){
			Screen.reset();
		},

		start : function(){
			Player.animate();
			Player.run();
			Screen.reset();
			Screen.scroll();
		}
	}

	var Player = {
		runner : $('#runner'),
		bgOffset : 0,
		lane : 1,
		isJumping : false,
		animate : function(){
			if(!Player.isJumping){
				Player.runner.css('background-position', Player.bgOffset+'px');
				Player.bgOffset += 125;
				var animacao = setTimeout(Player.animate, 120);
			}else{
				clearTimeout(animacao);
			}
		},

		run : function(){
			Player.runner.animate({
				left : '85%'
			}, {duration : 12000, queue:false, easing : "linear"});
		},

		moveUp : function(){
			if(Player.lane == 1){

				Player.runner.animate({
					bottom : '+=20',
				}, {duration : 10, queue:false});


				Player.runner.css('transform', 'scale(0.9)');


				Player.lane--;
			}else if(Player.lane == 2){
				Player.runner.animate({
					bottom : '+=30'
				}, {duration : 10, queue:false});

				Player.runner.css('transform', 'scale(1)');
				Player.lane--;
			}
			
		},

		moveDown : function(){
			if(Player.lane == 1){
				Player.runner.animate({
					bottom : '-=30'
				}, {duration : 10, queue:false});
				Player.runner.css('transform', 'scale(1.1)');
				Player.lane++;
			}else if(Player.lane == 0){
				Player.runner.animate({
					bottom : '-=20'
				}, {duration : 10, queue:false});
				Player.runner.css('transform', 'scale(1)');
				Player.lane++;
			}
			
		},

		jump : function(){
			if(!Player.isJumping){
				Player.isJumping = true;
				Player.runner.css('background-position', '0px');
				Player.runner.animate({
					bottom : '+=200'
				}, {
					duration : 200, 
					queue: true,
					complete : function(){
						Player.runner.animate({
							bottom : '-=200'
						}, {
							duration : 500, 
							queue: true,
							complete : function(){
								Player.isJumping = false;
								Player.animate();
							}
						});
					}
				});
			}else{
				return;
			}
			
		}

	}

	var Screen = {
		reset : function(){
			$('body').animate({
				scrollLeft : '0'
			}, {duration : 1, queue:false});
		},

		scroll : function(){
			$('body').animate({
				scrollLeft : '4000'
			}, {duration : 11000, queue:false, easing : "linear"});
		}
	}

	Screen.reset();

	$('#startButton').on('click', Game.start);

	$(window).on('keydown', function(e){
		switch(e.keyCode){
			case 38:
				Player.moveUp();
				break;
			case 40:
				Player.moveDown();
				break;
			case 32:
				Player.jump();
				break;
		}
	});



	



});