$(document).ready(function(){

	var Game = {
		on : false,

		init : function(){
			Screen.reset();
		},

		start : function(){
			Game.on = true;
			Player.animate();
			Player.run();
			Player.checkCollision();
			Screen.reset();
			Screen.scroll();
			Obstacle.generate();
		},

		over : function(type){
			$('body').stop();

			if(type == 'fail'){
				Game.on = false;
				Player.runner.stop();
				Player.runner.css('background', "Url('imgs/runner-fail.svg')");
				setTimeout(function(){
					$('#end').removeClass('hide');
					$('#end .success').hide();
				}, 1000);
			}else{
				Player.runner.animate({
					left: '89%',
					bottom: '+=130px'
				}, {
					duration: 2000,
					specialEasing: {
						left : 'linear',
						bottom : 'swing'
					}
				});
			}
		}


	}

	var Player = {
		runner : $('#runner'),
		bgOffset : 0,
		lane : 1,
		isJumping : false,
		animate : function(){
			if(!Player.isJumping && Game.on){
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
			}, {
				duration : 12000, 
				queue:false, 
				easing : "linear",
				complete : function(){
					Game.over('success');
				}
			});
		},

		moveUp : function(){
			if(Player.lane == 1){

				Player.runner.animate({
					bottom : '+=20',
				}, {duration : 10, queue:false});


				Player.runner.css({
					'transform': 'scale(0.9)',
					'z-index': '60'
				});


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
				Player.runner.css({
					'transform': 'scale(1)',
					'z-index': '80'
				});
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
			
		},

		checkCollision : function(){
			$.each(Obstacle.obstacleArr, function(index, value){
				var plLeft = parseFloat(Player.runner.css('left'));
				if(Player.lane == value.runway){
					if(plLeft > (value.position - 105) && plLeft < (value.position + 5)){
						if(!Player.isJumping){
							clearTimeout(check);
							Game.over('fail');
						}
					}
				}
			});
			check = setTimeout(Player.checkCollision, 10);
		}

	}

	var Obstacle = {
		lanes : 3,
		count : 10,
		minPos : 500,
		maxPos: 4000,
		obstacleArr : [],
		generate : function(){
			for(var i = 0 ; i < Obstacle.count ; i++){
				var runway = (Math.floor(Math.random() * Obstacle.lanes));
				if(Obstacle.minPos <= 3500){
					var left = (Math.random() * ((Obstacle.minPos + 500) - Obstacle.minPos) + Obstacle.minPos);
					$('#runway'+runway).append('<span data-lane="'+runway+'" class="obstacle" style="left:'+left+'px"></span>');
					Obstacle.obstacleArr.push({
						'runway': runway,
						'position': left
					});
					Obstacle.minPos += 500;
				}
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
				if(!Player.isJumping)
					Player.moveUp();
				break;
			case 40:
				if(!Player.isJumping)
					Player.moveDown();
				break;
			case 32:
				Player.jump();
				break;
		}
	});



	



});