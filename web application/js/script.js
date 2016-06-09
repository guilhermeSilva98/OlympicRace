$(document).ready(function(){

	var Game = {
		on : false,

		init : function(){
			$('#end').hide();
			Game.on = false;
			Screen.reset();
			Player.reset();
			Obstacle.destroy();
			Screen.hidePoints();
		},

		start : function(){
			clearInterval(Screen.int);
			Game.on = true;
			Obstacle.generate();
			Player.start();
			Screen.start();
			Screen.showPoints();
		},

		over : function(type){
			Game.on = false;
			if(type == 'fail'){
				$('body').stop();
				Player.runner.stop();
				Player.runner.css('background', "Url('imgs/runner-fail.svg')");
				$('#end').fadeIn('slow');
				$('#end .success').hide();
			}else{
				$('#end').fadeIn('fast');
				$('#end .error').hide();
			}
		}
	}

	var Player = {
		animacao : '',
		runner : $('#runner'),
		bgOffset : 0,
		lane : 1,
		isJumping : false,
		start : function() {
			Player.reset();
			Player.animate();
			Player.run();
			Player.checkCollision();
		},

		reset : function() {
			Player.runner.css({
				position: 'absolute',
				bottom: '100px',
				left: '0px',
				zIndex: '80',
				transform: 'scale(1)',
				background: "url('imgs/runner-tileset.png')"
			});
			Player.bgOffset = 0;
			Player.lane = 1;
			Player.isJumping = false;
		},

		animate : function() {
			if(!Player.isJumping && Game.on){
				Player.runner.css('background-position', Player.bgOffset+'px');
				Player.bgOffset += 125;
				Player.animacao = setTimeout(Player.animate, 120);
			}else{
				console.log('asd');
				clearTimeout(Player.animacao);
			}
		},

		run : function() {
			Player.runner.animate({
				left : '83%'
			}, {
				duration : 12000, 
				queue:false, 
				easing : "linear",
				complete : function(){
					Player.animateToPyre();
				}
			});
		},

		moveUp : function() {

			if(Player.lane == 1){

				Player.runner.animate({
					bottom : '+=20',
				}, {duration : 10, queue:false});


				Player.runner.css({
					'transform': 'scale(0.9)',
					'z-index': '60'
				});


				Player.lane--;
			}else if(Player.lane == 2) {
				Player.runner.animate({
					bottom : '+=30'
				}, {duration : 10, queue:false});

				Player.runner.css('transform', 'scale(1)');
				Player.lane--;
			}
			
		},

		moveDown : function() {
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

		jump : function() {
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

		checkCollision : function() {
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
		},

		lightPyre : function() {
			Player.runner.css({
				background : "Url('imgs/runner-success.svg')"
			});
		},

		animateToPyre : function() {
			Player.runner.animate({
				left: '87%'
			},{
				duration: 1200,
				easing: 'linear'
			}).animate({
				left: '91%'
			},{
				duration: 600,
				easing: 'linear',
				complete : function(){
					Player.runner.stop();
					Player.lightPyre();
					Screen.lightPyre();
					Game.over('success');
				}
			}).animate({
				bottom: '+=140',
			},{
				duration: 1500,
				easing: 'swing',
				queue: false
			});
	}

	}

	var Obstacle = {
		lanes : 3,
		count : 10,
		minPos : 500,
		maxPos: 4000,
		obstacleArr : [],
		reset : function(){
			Obstacle.minPos = 500;
			Obstacle.obstacleArr = [];
		},

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
			console.log('objects done');
			
		},

		destroy : function(){
			$('.obstacle').remove();
			Obstacle.reset();
		}
	}

	var Screen = {
		int : '',
		start : function(){
			$('body').stop().animate({
				scrollLeft : '0'
			}, {duration : 1, queue:false, complete : function(){
				Screen.scroll();
			}});
		},

		reset : function(){
			$('body').stop().animate({
				scrollLeft : '0'
			}, {duration : 1, queue:false});
		},

		scroll : function(){
			$('body').animate({
				scrollLeft : '4000'
			}, {duration : 11000, queue:true, easing : "linear"});
		},

		lightPyre : function(){
			$('#pyreFire').animate({
				opacity: '1'
			}, {
				duration : 200,
				complete : function(){
					return true;
				}
			});
		},

		showPoints : function(){
			if(Game.on){
				$('#points section').each(function(i, current){
					Screen.int = setInterval(function(){
						$(current).stop().animate({
							opacity: '1'
						},500);
						$('#'+$(current).attr('id')+'Panel').stop().animate({
							opacity: '1'
						},500);
					}, ($(current).data('step') * 1800));
				});
			}else{
				clearInterval(Screen.int);
			}
			
		},

		hidePoints : function(){
			$('#points section').each(function(i, current){
				clearInterval(Screen.int);
				$(current).css('opacity', '0');
				$('#'+$(current).attr('id')+'Panel').css('opacity', '0');
			});
		}


	}

	Game.init();

	$('#startButton').on('click', Game.start);

	$(window).on('keydown', function(e){
		if(Game.on){
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
		}
	});

	

	$('#restartButton').on('click', function(e){
		Game.init();
		Game.start();
		e.preventDefault();
	});



	



});