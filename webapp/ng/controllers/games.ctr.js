/*jshint esversion: 6 */

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('gamesCtr',
            ['$scope','$state','$mdToast','gamelogic', '$timeout',
      function($scope, $state, $mdToast, gamelogic, $timeout){

      let t = this;
      let s = $scope;

      //initialize functions


      //vars

			$scope.view = {};

			$scope.view.selectedCor = "";
			$scope.view.actionCor = "";

			$scope.view.unitList = {
				unit1: "scissors",
				unit2: "rock",
				unit3: "paper",
				unit4: "scissors",
				unit5: "rock",
				unit6: "paper"
			};

			$scope.view.imageList = {
				rock: "webapp/images/rock.png",
				paper: "webapp/images/paper.png",
				scissors: "webapp/images/scissors.png"
			};

      function showToast(message){

        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top, right')
            .hideDelay(3000)
        );

      }

			// $scope.clearHighlighted = function() {
			// 	$('.canMove').removeClass("canMove").addClass("notAllowed");
			// };

			// $scope.validMoveClickEventOn = function() {
				$('#grid').on('click', 'div', function() {  // highlight valid moves when player's character is clicked
					let mode = gamelogic.gameState.gameStatus.mode;
					let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;

					// clearHighlighted();

					if ( mode === "turn") {

						if ( $(this).hasClass("canMove") ) {
							$scope.view.actionCor = $(this).attr('id');
						} else {
							$scope.view.selectedCor = $(this).attr('id');
						}

						if ( gamelogic.gameState.grid[$scope.view.selectedCor] ) {
							if ( currentPlayer === gamelogic.gameState.grid[$scope.view.selectedCor].owner ) {
								for ( let move in gamelogic.validMoves[$scope.view.selectedCor] ) {
									if ( !gamelogic.gameState.grid[move].owner || gamelogic.gameState.grid[move].owner === gamelogic.findNextPlayer(currentPlayer)) {
										$('#' + move).parent().addClass("canMove");   // highlight valid moves
										$('#' + move).addClass("canMove");   // highlight valid moves
										$('#' + move).removeClass("notAllowed");   // remove no allow clicking cursor
									}
								}
							}
						}

					} else {
						$scope.view.selectedCor = $(this).attr('id');
					}

				});
			// };


			$scope.checkGameState = function() {
				var currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
				var mode = gamelogic.gameState.gameStatus.mode;
				var ap = gamelogic.gameState.gameStatus.AP;
				let msg = gamelogic.getMessage();

				if ( msg ) {
					$scope.view.message = "";
					$timeout.cancel(messageTimer);
					$("#message").fadeIn( "slow", $scope.displayMessage( msg ));
				}

		// SETUP MODE
				if ( mode === "setup" ) {
					$scope.reserveMenuClickEventOn();
					if ( ap > 0 ) { // if still has action points left
						if ( currentPlayer === "player1" ) {  // see who's placing characters
							for ( let i = 1; i <=4; i++ ) {
								if ( !gamelogic.gameState.grid["hex" + i].owner ) { // if hex empty
									$("#hex" + i).addClass("canMove");
									$("#hex" + i).parent().removeClass("notAllowed");
									$("#hex" + i).removeClass("notAllowed");
								}
							}
						} else if ( currentPlayer === "player2" ) {  // see who's placing characters
							for ( let i = 35; i <=38; i++ ) {
								if ( !gamelogic.gameState.grid["hex" + i].owner ) { // if hex empty
									$("#hex" + i).addClass("canMove");
									$("#hex" + i).parent().removeClass("notAllowed");
									$("#hex" + i).removeClass("notAllowed");
								}
							}
						}

					} else {
						if ( gamelogic.findNextPlayer(currentPlayer) === "player1" ) {
							gamelogic.gameState.gameStatus.mode = "turn";

							$scope.view.message = "";
							$timeout.cancel(messageTimer);
							$("#message").fadeIn( "slow", $scope.displayMessage( gamelogic.findNextPlayer(currentPlayer) + ", click one of your units and choose where to move or attack. You have " + 2 + " action points to use."));

							$scope.moveClickEventOn();
							$("#grid").off("click", "[has-ripple='true']"); // TURN OFF reserveClickEvent
						}

						gamelogic.endTurn();
						$scope.renderGameState();
						$scope.view.message = "";
						$timeout.cancel(messageTimer);
						$scope.displayMessage(gamelogic.gameState.gameStatus.currentPlayer + ", it's your turn. Moves left: " + gamelogic.gameState.gameStatus.AP + ".");
					}

		// TURN MODE
				} else if ( mode === "turn" ) {
					// $scope.validMoveClickEventOn();
					$scope.moveClickEventOn();

					if ( ap === 0 ) {
						gamelogic.endTurn();
						$scope.renderGameState();
						$scope.view.message = "";
						$timeout.cancel(messageTimer);
						$scope.displayMessage(gamelogic.gameState.gameStatus.currentPlayer + ", it's your turn. Moves left: " + gamelogic.gameState.gameStatus.AP + ".");
					}

		// SWAP mode
				} else if ( mode === "swap" && gamelogic.gameState.gameStatus.swaps.numberOf > 0 ) {
					// $('#grid').off('click', 'div'); // TURNS OFF valid move highlighter
					this.reserveMenuClickEventOn();

					if ( gamelogic.gameState.gameStatus.swaps.numberOf === 2 ) {
						$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.first.cor).addClass("canMove");
						$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.first.cor).removeClass("notAllowed");
					}

					if ( gamelogic.gameState.gameStatus.swaps.numberOf === 1 ) {
						$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.second.cor).addClass("canMove");
						$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.second.cor).removeClass("notAllowed");
					}

				} else {
					gamelogic.gameState.gameStatus.mode = "turn";
					$scope.renderGameState();
				}

	};

		$scope.renderGameState = function() {
			$scope.view.currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
			$scope.view.mode = gamelogic.gameState.gameStatus.mode;
			$scope.view.ap = gamelogic.gameState.gameStatus.AP;

			let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
			let mode = gamelogic.gameState.gameStatus.mode;
			let ap = gamelogic.gameState.gameStatus.AP;
			let $li;

			$("#grid").off("click", "[has-ripple='true']"); // TURN OFF reserveClickEvent
			// $('#grid').off('click', 'div'); // TURNS OFF validMoveClickEvent
			$('#grid').off('click', '.canMove'); // TURNS OFF attemptToMoveClickEvent

			$('#grid').empty(); // clear the grid before render
			$('#grid').append("<li class='pusher'></li><li has-ripple='true'><div class='notAllowed' id='hex35'>35</div></li><li has-ripple='true'><div class='notAllowed' id='hex36'>36</div></li><li has-ripple='true'><div class='notAllowed' id='hex37'>37</div></li><li has-ripple='true'><div class='notAllowed' id='hex38'>38</div></li><li has-ripple='true'><div class='notAllowed' id='hex30'>30</div></li><li has-ripple='true'><div class='notAllowed' id='hex31'>31</div></li><li has-ripple='true'><div class='notAllowed' id='hex32'>32</div></li><li has-ripple='true'><div class='notAllowed' id='hex33'>33</div></li><li has-ripple='true'><div class='notAllowed' id='hex34'>34</div></li><li has-ripple='true'><div class='notAllowed' id='hex25'>25</div></li><li has-ripple='true'><div class='notAllowed' id='hex26'>26</div></li><li has-ripple='true'><div class='notAllowed' id='hex27'>27</div></li><li has-ripple='true'><div class='notAllowed' id='hex28'>28</div></li><li has-ripple='true'><div class='notAllowed' id='hex29'>29</div></li><li has-ripple='true'><div class='notAllowed' id='hex20'>20</div></li><li has-ripple='true'><div class='notAllowed' id='hex21'>21</div></li><li has-ripple='true'><div class='notAllowed' id='hex22'>22</div></li><li has-ripple='true'><div class='notAllowed' id='hex23'>23</div></li><li has-ripple='true'><div class='notAllowed' id='hex24'>24</div></li><li has-ripple='true'><div class='notAllowed' id='hex15'>15</div></li><li has-ripple='true'><div class='notAllowed' id='hex16'>16</div></li><li has-ripple='true'><div class='notAllowed' id='hex17'>17</div></li><li has-ripple='true'><div class='notAllowed' id='hex18'>18</div></li><li has-ripple='true'><div class='notAllowed' id='hex19'>19</div></li><li has-ripple='true'><div class='notAllowed' id='hex10'>10</div></li><li has-ripple='true'><div class='notAllowed' id='hex11'>11</div></li><li has-ripple='true'><div class='notAllowed' id='hex12'>12</div></li><li has-ripple='true'><div class='notAllowed' id='hex13'>13</div></li><li has-ripple='true'><div class='notAllowed' id='hex14'>14</div></li><li has-ripple='true'><div class='notAllowed' id='hex5'>5</div></li><li has-ripple='true'><div class='notAllowed' id='hex6'>6</div></li><li has-ripple='true'><div class='notAllowed' id='hex7'>7</div></li><li has-ripple='true'><div class='notAllowed' id='hex8'>8</div></li><li has-ripple='true'><div class='notAllowed' id='hex9'>9</div></li><li has-ripple='true'><div class='notAllowed' id='hex1'>1</div></li><li has-ripple='true'><div class='notAllowed' id='hex2'>2</div></li><li has-ripple='true'><div class='notAllowed' id='hex3'>3</div></li><li has-ripple='true'><div class='notAllowed' id='hex4'>4</div></li><li class='pusher'></li>");

			for ( let hex in gamelogic.gameState.grid ) {
					let gridHex = gamelogic.gameState.grid[hex];
					if ( gridHex.owner ) {
						$li = $("#"+hex).parent();
						$li.addClass("up");
						$li.append("<span class='notAllowed'></span>");

						if (mode === "turn" && gridHex.owner === currentPlayer ) {
							$("#"+hex).removeClass("notAllowed");
							$li.removeClass("notAllowed");
						} else {
							$("#"+hex).addClass("notAllowed");
						}
		//$scope.view.imageList[gridHex.type]
						if ( mode === "setup" ) {
							$("#"+hex).append("<img class='notAllowed' src='" + gamelogic.gameState.players[gridHex.owner].avatarLink + "' alt='Unit is Here'/>");
						} else {
							$("#"+hex).append("<img src='" + gamelogic.gameState.players[gridHex.owner].avatarLink + "' alt='Unit is Here'/>");
						}

						if ( mode === "swap" ) {
							let corToSwap;

							if ( gamelogic.gameState.gameStatus.swaps.players.first.cor ) {
								corToSwap = "#"+gamelogic.gameState.gameStatus.swaps.players.first.cor;
								$li = $(corToSwap).parent();

								$(corToSwap).removeClass("notAllowed");
								$(corToSwap).parent().removeClass("notAllowed"); // add to parent li

							} else {
								corToSwap = "#"+gamelogic.gameState.gameStatus.swaps.players.second.cor;
								$li = $(corToSwap).parent();

								$(corToSwap).removeClass("notAllowed");
								$(corToSwap).parent().removeClass("notAllowed"); // add to parent li
							}
						}
					}
			}


			let reserve = gamelogic.gameState.players[currentPlayer].reserve;

			for ( let unit in reserve ) {  // hide\show reserve menu items depending on reserve object
				if ( unit ) {
					$('#' + unit).removeClass("hide");
				} else {
					$('#' + unit).addClass("hide");
				}
			}

			$scope.checkGameState();
		};

		$scope.moveClickEventOn = function(){  // Attempts to Moves
			 $('#grid').on('click', '.canMove', function(){  // attempt to move character
				 let grid = gamelogic.gameState.grid;
				 $scope.view.actionCor = $(this).attr('id');

				 let moveThenRender = new Promise(function(resolve, reject){
					 gamelogic.resolveMove($scope.view.selectedCor, grid[$scope.view.selectedCor], $scope.view.actionCor, grid[$scope.view.actionCor]);
				 });

				 moveThenRender.then($scope.renderGameState());

			 });
		 };

		// #### CIRCLE RESERVE MENU ####
		$scope.compileReserveMenu = function() {
			let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
			let reserve = gamelogic.gameState.players[currentPlayer].reserve;

			for ( var unit in reserve ) {
				if ( reserve[unit] ) {
					$('#'+unit).removeClass("hide");
				} else {
					$('#'+unit).addClass("hide");
				}
			}
		};

		$('#close').click(function () {
			$(this).toggleClass('clicked');
		  $('.menu').toggleClass('open').delay(100).queue(function(next){
				$('#reserve').toggleClass('hide');
				$('.modalbackground').toggleClass('hide');
				next();
			});
		});

	// #### WHEN ITEM IN RESERVE MENU IS CLICKED ####
			$('.menu a').each(function (index) {
			  var thismenuItem        = $(this);

			  thismenuItem.click(function (event) {
			    event.preventDefault();
					let mode = gamelogic.gameState.gameStatus.mode;
					let owner = gamelogic.gameState.gameStatus.currentPlayer;
					let unit = thismenuItem.parent().attr('id');
					let type = $scope.view.unitList[unit];

					if ( mode === "swap" ) {
						let firstMatch = true;
						let characterToPutAway;
						// do swappy stuff

						// attacker swap first
						if ( gamelogic.gameState.gameStatus.swaps.numberOf === 2 ) {
							characterToPutAway = gamelogic.gameState.grid[gamelogic.gameState.gameStatus.swaps.players.first.cor].type;
								for ( let unitNum in $scope.view.unitList ) {
									if ( $scope.view.unitList[unitNum] === characterToPutAway && firstMatch) {
										gamelogic.gameState.players[gamelogic.gameState.gameStatus.swaps.players.first.player].reserve[unitNum] = $scope.view.unitList[unitNum];
										firstMatch = false;
									}
								}
								thismenuItem.parent().addClass("hide");

								gamelogic.gameState.grid[gamelogic.gameState.gameStatus.swaps.players.first.cor] = {owner: owner, type: type, health: 1};
								gamelogic.gameState.players[owner].reserve[unit] = null;

								$('.menuitem-wrapper').eq(index).addClass('spin');

						    var timer = $timeout(function () {
						      $('.menuitem-wrapper').eq(index).removeClass('spin')
										.queue(function(next){
												$scope.renderGameState();
												next();
										});
						      $('.menu').removeClass('open');
						      $('.menu-btn').removeClass('clicked');
									$('#reserve').toggleClass('hide');
									$('.modalbackground').toggleClass('hide');
						    }, 100);

								gamelogic.gameState.gameStatus.swaps.numberOf -= 1;
								if ( gamelogic.gameState.gameStatus.swaps.numberOf === 0 ) {

									gamelogic.endSwap();

								} else {
									$scope.view.message = "";
									$timeout.cancel(messageTimer);
									$scope.displayMessage(gamelogic.gameState.gameStatus.swaps.players.second.player + ", now you swap from your reserve!");
									gamelogic.passTurn(gamelogic.gameState.gameStatus.swaps.players.second.player );
								}

						} else {  // defender swap second
							characterToPutAway = gamelogic.gameState.grid[gamelogic.gameState.gameStatus.swaps.players.second.cor].type;
								for ( let unitNum in $scope.view.unitList ) {
									if ( $scope.view.unitList[unitNum] === characterToPutAway && firstMatch) {
										gamelogic.gameState.players[gamelogic.gameState.gameStatus.swaps.players.second.player].reserve[unitNum] = $scope.view.unitList[unitNum];
										firstMatch = false;
									}
								}
								thismenuItem.parent().addClass("hide");

								gamelogic.gameState.grid[gamelogic.gameState.gameStatus.swaps.players.second.cor] = {owner: owner, type: type, health: 1};
								gamelogic.gameState.players[owner].reserve[unit] = null;
								$('.menuitem-wrapper').eq(index).addClass('spin');

								var timer2 = $timeout(function () {
									$('.menuitem-wrapper').eq(index).removeClass('spin')
										.queue(function(next){
												$scope.renderGameState();
												next();
										});
									$('.menu').removeClass('open');
									$('.menu-btn').removeClass('clicked');
									$('#reserve').toggleClass('hide');
									$('.modalbackground').toggleClass('hide');
								}, 100);

								gamelogic.gameState.gameStatus.swaps.numberOf -= 1;
								// if ( gamelogic.gameState.gameStatus.swaps.numberOf === 0 ) {
								gamelogic.passTurn( gamelogic.gameState.gameStatus.swaps.players.first.player );
								gamelogic.endSwap();
								// } else {
								// 	gamelogic.passTurn(gamelogic.gameState.gameStatus.swaps.players.second.player );
								// }

						}

	// IF SETUP MODE
					} else if ( mode === "setup" ) {

						thismenuItem.parent().addClass("hide");

						gamelogic.gameState.grid[$scope.view.selectedCor] = {owner: owner, type: type, health: 1};
						gamelogic.gameState.players[owner].reserve[unit] = null;


				    $('.menuitem-wrapper').eq(index).addClass('spin');

				    var timer1 = $timeout(function () {
				      $('.menuitem-wrapper').eq(index).removeClass('spin');
				      $('.menu').removeClass('open');
				      $('.menu-btn').removeClass('clicked');
							$('#reserve').toggleClass('hide');
							$('.modalbackground').toggleClass('hide');
							gamelogic.useAP();
							$scope.renderGameState();
				    }, 100);
					}
			  });
			}); // END OF RESERVE MENU CLICK HANDLER

	// ^^^^ END OF CIRCLE MENU ^^^^


		$scope.openReserveMenu = function( hexClicked, ev ) {
			$scope.compileReserveMenu();
			var reserveMenuWrapperHeight = $('#reserve').css("height");
			var reserveMenuWrapperWidth = $('#reserve').css("width");
			var top = ( parseInt(ev.pageY) - (parseInt(reserveMenuWrapperHeight) /2) -9 ); // -15 is to fix offset center
			var left = ( parseInt(ev.pageX) - (parseInt(reserveMenuWrapperWidth) /2) +20);

			$('#reserve').css({"top": top, "left": left});

			$('.menu-btn').toggleClass('clicked');
			$('#reserve').toggleClass('hide');
			$('.modalbackground').toggleClass('hide');
			$('.menu').toggleClass('open');
		};


		$scope.reserveMenuClickEventOn = function(){
			$("#grid").on("click", "[has-ripple='true']", function (ev) {
				if ( !$(this).find("#"+$scope.view.selectedCor).hasClass("notAllowed") ) {
					if ( $('.menu').hasClass('open') ) {
						$('#close').toggleClass('clicked');
						$('#reserve').toggleClass('hide');
						$('.modalbackground').toggleClass('hide');
						$('.menu').toggleClass('open').delay(100).queue(function(next) {
							$scope.openReserveMenu(this, ev);
							next();
						});
					} else {
						$scope.openReserveMenu(this, ev);
					}
				}
			});
		};


			// #### MESSAGE WINDOW ####

			let messageTimer;

			$scope.view.message = "";


			$scope.displayMessage = function(msg){
			  if(msg.length > 0){
			      //append first character
			      $scope.view.message = $scope.view.message + msg[0];
			      messageTimer = $timeout(function(){
			              //Slice text by 1 character and call function again
			              $scope.displayMessage(msg.slice(1));
			           }, 25 );
				  }
				};

			$scope.checkForMsgs = function() {
				var currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
				var players = gamelogic.gameState.players;
				var mode = gamelogic.gameState.gameStatus.mode;
				var ap = gamelogic.gameState.gameStatus.AP;

				// SETUP mode
				if ( mode === "setup" ) {
					$scope.view.message = "";
					$timeout.cancel(messageTimer);
					$("#message").fadeIn( "slow", $scope.displayMessage( players[currentPlayer].name + ", click anywhere on the home row to place your units. Try to remember them. You won't be able to peek until a battle."));
				} else if ( mode === "turn" ) {
					$scope.view.message = "";
					$timeout.cancel(messageTimer);
					$("#message").fadeIn( "slow", $scope.displayMessage( players[currentPlayer].name + ", click one of your units and choose where to move or attack. You have " + ap + " action points to use."));
				}
			}; // ^^^^^^ END OF CHECK MESSAGES ^^^^^^



			// (function(){   // setup and put the game into turn mode
			// 	let game = gamelogic.gameState;
			//
			// 	game.players.player1.reserve.unit1 = null;
			// 	game.players.player1.reserve.unit2 = null;
			// 	game.players.player1.reserve.unit3 = null;
			// 	game.players.player1.reserve.unit4 = null;
			//
			// 	game.grid.hex16 = {"owner": "player1", "type": "scissors", "health": 1};
			// 	game.grid.hex17 = {"owner": "player1", "type": "rock", "health": 1};
			// 	game.grid.hex18 = {"owner": "player1", "type": "paper", "health": 1};
			// 	game.grid.hex19 = {"owner": "player1", "type": "scissors", "health": 1};
			//
			//
			// 	game.players.player2.reserve.unit1 = null;
			// 	game.players.player2.reserve.unit2 = null;
			// 	game.players.player2.reserve.unit3 = null;
			// 	game.players.player2.reserve.unit4 = null;
			//
			// 	game.grid.hex20 = {"owner": "player2", "type": "scissors", "health": 1};
			// 	game.grid.hex21 = {"owner": "player2", "type": "rock", "health": 1};
			// 	game.grid.hex22 = {"owner": "player2", "type": "paper", "health": 1};
			// 	game.grid.hex23 = {"owner": "player2", "type": "scissors", "health": 1};
			//
			// 	game.gameStatus.mode = "turn";
			// 	game.gameStatus.AP = 2;
			//
			// 	$("#grid").off("click", "[has-ripple='true']"); // TURN OFF reserveClickEvent
			//
			// })();



			// $scope.validMoveClickEventOn();
			$scope.checkForMsgs();
			$scope.renderGameState();



    }]);
})();
