/*jshint esversion: 6 */

(function(){
'use strict';

  angular
    .module('rpsApp')

    .controller('gamesCtr',
            ['$rootScope','$scope','$state','$http','$timeout','$mdToast','$mdDialog','$mdSidenav','$firebaseObject','$firebaseArray','authService','addUserService','getUserService','gamelogic',
      function($rootScope, $scope, $state, $http, $timeout, $mdToast, $mdDialog, $mdSidenav, $firebaseObject, $firebaseArray, authService, addUserService, getUserService, gamelogic){

      let t = this;
      let s = $scope;
      let rs = $rootScope;
      let st = $state;

      //initialized functions
      t.openSidebar = openSidebar;
      t.closeSidebar = closeSidebar;
      t.openRightSidebar = openRightSidebar;
      t.closeRightSidebar = closeRightSidebar;
      t.closeRightSidebarAndOpenLeft = closeRightSidebarAndOpenLeft;

      //initialized vars
      s.auth = authService;



      function openSidebar(){
        st.go('games.new');
      }

      function openRightSidebar(){
        st.go('games.login');
      }

      function closeRightSidebar(){
        $mdSidenav('right').close();
        $timeout(function(){
          st.go('games');
        },250);
      }

      function closeRightSidebarAndOpenLeft(){
        t.rightSidenavOpen = false;
        $timeout(function(){
          st.go('games/new');
        },250);
      }

      function closeSidebar(){
        $mdSidenav('left').close();
        $timeout(function(){
          st.go('games');
        },250);
      }

      function showToast(message){

        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top, right')
            .hideDelay(3000)
        );

      }

      //CHECK AUTH STATUS AND MAKE USER AVAILABLE ON ROOT
      s.auth.$onAuthStateChanged(function(firebaseUser){

        if (firebaseUser){

          let ref = firebase.database();
          let usersRef = ref.ref('users');
          usersRef.orderByChild('aid').equalTo(firebaseUser.uid).on('child_added', function(snap){
            $timeout(function(){
              rs.firebaseUser = snap.val();
              console.log(rs.firebaseUser);
              closeRightSidebar();
            });
          });

        } else {
          rs.firebaseUser = null;
        }

      });

      //initialized lets
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
				rock: "images/rock.png",
				paper: "images/paper.png",
				scissors: "images/scissors.png"
			};

			// $('*').on("click", function(ev){
			// 	console.log(ev.currentTarget);
			// });

			// $scope.validMoveClickEventOn = function() {
				$('#grid').on('click', 'div', function() {  // highlight valid moves when player's character is clicked
					$scope.renderGameState();
					let mode = gamelogic.gameState.gameStatus.mode;
					let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;

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
				let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;

				let mode = gamelogic.gameState.gameStatus.mode;
				let ap = gamelogic.gameState.gameStatus.AP;
				let msg = gamelogic.getMessage();
				let checkForGameEnd = gamelogic.checkForGameEnd();

				if ( mode === "turn" && checkForGameEnd ) {  // if a winner then do this

					// if a winner then do this
					$scope.view.message = "";
					$timeout.cancel(messageTimer);
					$("#message").fadeIn( "slow", $scope.displayMessage( "GAME OVER!! " + gamelogic.turnPlayerNumberIntoName(checkForGameEnd) + " is the winner!!!" ));

				} else { 	// if no winner yet

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
							} else {
								console.log("NOT SUPPOSED TO SEE ME");
							}

						} else {
							if ( gamelogic.findNextPlayer(currentPlayer) === "player1" ) {
								gamelogic.gameState.gameStatus.mode = "turn";

								$scope.view.message = "";
								$timeout.cancel(messageTimer);
								$("#message").fadeIn( "slow", $scope.displayMessage( gamelogic.turnPlayerNumberIntoName(gamelogic.findNextPlayer(currentPlayer)) + ", click one of your units and choose where to move or attack. You have " + 2 + " action points to use."));

								$scope.moveClickEventOn();
								$('#grid').off('click', '[has-ripple="true"]'); // TURN OFF reserveClickEvent
							}

							gamelogic.endTurn();
							$scope.renderGameState();
							$scope.checkForMsgs();
						}

					// TURN MODE
					} else if ( mode === "turn" ) {
						// $scope.validMoveClickEventOn();
						$scope.moveClickEventOn();

						if ( ap === 0 ) {
							gamelogic.endTurn();
							$scope.renderGameState();
						}

					// SWAP mode
					} else if ( mode === "swap" && gamelogic.gameState.gameStatus.swaps.numberOf > 0 ) {
						// $('#grid').off('click', 'div'); // TURNS OFF valid move highlighter
						this.reserveMenuClickEventOn();

						if ( gamelogic.gameState.gameStatus.swaps.numberOf === 2 ) {
							$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.first.cor).addClass("canMove");
							$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.first.cor).removeClass("notAllowed");

							if ( gamelogic.checkIfNoReserveLeft( "player1" ) ) {
								gamelogic.gameState.gameStatus.swaps.numberOf -= 1;
								$scope.renderGameState();
							}

						}

						if ( gamelogic.gameState.gameStatus.swaps.numberOf === 1 ) {
							$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.second.cor).addClass("canMove");
							$('#grid').find('#'+gamelogic.gameState.gameStatus.swaps.players.second.cor).removeClass("notAllowed");

							if ( gamelogic.checkIfNoReserveLeft( "player2" ) ) {
								gamelogic.gameState.gameStatus.swaps.numberOf -= 1;
								gamelogic.passTurn( gamelogic.gameState.gameStatus.swaps.players.first.player );
								gamelogic.endSwap();
							}

						}

					} else {
						gamelogic.gameState.gameStatus.mode = "turn";
						$scope.renderGameState();
					}

				}  // END OF if no winner yet
	};

		$scope.renderGameState = function() {
			$scope.view.currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
			$scope.view.mode = gamelogic.gameState.gameStatus.mode;
			$scope.view.ap = gamelogic.gameState.gameStatus.AP;

			let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
			let mode = gamelogic.gameState.gameStatus.mode;
			let ap = gamelogic.gameState.gameStatus.AP;
			let $li;

			$('#grid').off('click', '[has-ripple="true"]'); // TURN OFF reserveClickEvent
			// $('#grid').off('click', 'div'); // TURNS OFF validMoveClickEvent
			$('#grid').off('click', '.canMove'); // TURNS OFF attemptToMoveClickEvent

			$('#grid').empty(); // clear the grid before render
			$('#grid').append("<li class='pusher'></li><li has-ripple='true'><div class='notAllowed' id='hex35'>35</div></li><li has-ripple='true'><div class='notAllowed' id='hex36'>36</div></li><li has-ripple='true'><div class='notAllowed' id='hex37'>37</div></li><li has-ripple='true'><div class='notAllowed' id='hex38'>38</div></li><li has-ripple='true'><div class='notAllowed' id='hex30'>30</div></li><li has-ripple='true'><div class='notAllowed' id='hex31'>31</div></li><li has-ripple='true'><div class='notAllowed' id='hex32'>32</div></li><li has-ripple='true'><div class='notAllowed' id='hex33'>33</div></li><li has-ripple='true'><div class='notAllowed' id='hex34'>34</div></li><li has-ripple='true'><div class='notAllowed' id='hex25'>25</div></li><li has-ripple='true'><div class='notAllowed' id='hex26'>26</div></li><li has-ripple='true'><div class='notAllowed' id='hex27'>27</div></li><li has-ripple='true'><div class='notAllowed' id='hex28'>28</div></li><li has-ripple='true'><div class='notAllowed' id='hex29'>29</div></li><li has-ripple='true'><div class='notAllowed' id='hex20'>20</div></li><li has-ripple='true'><div class='notAllowed' id='hex21'>21</div></li><li has-ripple='true'><div class='notAllowed' id='hex22'>22</div></li><li has-ripple='true'><div class='notAllowed' id='hex23'>23</div></li><li has-ripple='true'><div class='notAllowed' id='hex24'>24</div></li><li has-ripple='true'><div class='notAllowed' id='hex15'>15</div></li><li has-ripple='true'><div class='notAllowed' id='hex16'>16</div></li><li has-ripple='true'><div class='notAllowed' id='hex17'>17</div></li><li has-ripple='true'><div class='notAllowed' id='hex18'>18</div></li><li has-ripple='true'><div class='notAllowed' id='hex19'>19</div></li><li has-ripple='true'><div class='notAllowed' id='hex10'>10</div></li><li has-ripple='true'><div class='notAllowed' id='hex11'>11</div></li><li has-ripple='true'><div class='notAllowed' id='hex12'>12</div></li><li has-ripple='true'><div class='notAllowed' id='hex13'>13</div></li><li has-ripple='true'><div class='notAllowed' id='hex14'>14</div></li><li has-ripple='true'><div class='notAllowed' id='hex5'>5</div></li><li has-ripple='true'><div class='notAllowed' id='hex6'>6</div></li><li has-ripple='true'><div class='notAllowed' id='hex7'>7</div></li><li has-ripple='true'><div class='notAllowed' id='hex8'>8</div></li><li has-ripple='true'><div class='notAllowed' id='hex9'>9</div></li><li has-ripple='true'><div class='notAllowed' id='hex1'>1</div></li><li has-ripple='true'><div class='notAllowed' id='hex2'>2</div></li><li has-ripple='true'><div class='notAllowed' id='hex3'>3</div></li><li has-ripple='true'><div class='notAllowed' id='hex4'>4</div></li><li class='pusher'></li>");

			for ( let hex in gamelogic.gameState.grid ) {
					let gridHex = gamelogic.gameState.grid[hex];
					if ( gridHex.owner !== "" ) {
						$li = $("#"+hex).parent();
						$li.addClass("up");
						$li.append("<span class='notAllowed'></span>");

						if ( mode === "turn" && gridHex.owner === currentPlayer ) {
							$("#"+hex).removeClass("notAllowed");
							$li.removeClass("notAllowed");
						} else {
							$("#"+hex).addClass("notAllowed");
						}
		//$scope.view.imageList[gridHex.type]
		// gamelogic.gameState.players[gridHex.owner].avatarLink
						if ( mode === "setup" ) {
							$("#"+hex).append("<img class='notAllowed' src='" + gamelogic.gameState.players[gridHex.owner].avatarLink + "' alt='Unit is Here'/>");
						} else {
							$("#"+hex).append("<img src='" + gamelogic.gameState.players[gridHex.owner].avatarLink + "' alt='Unit is Here'/>");
						}

						if ( mode === "swap" ) {
							let corToSwap;

							if ( currentPlayer === gamelogic.gameState.gameStatus.swaps.players.first.player ) {
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
			console.log("compile");
			let currentPlayer = gamelogic.gameState.gameStatus.currentPlayer;
			let reserve = gamelogic.gameState.players[currentPlayer].reserve;
			let currentUnit = gamelogic.gameState.grid[$scope.view.selectedCor].type;

			for ( let unit in reserve ) {
				if ( reserve[unit] ) {
					$('#'+unit).removeClass("hide");
				} else {
					$('#'+unit).addClass("hide");
				}
			}

			for ( let unit in $scope.view.unitList ) { // find current unit in play and add to reserve menu
				if ( $scope.view.unitList[unit] === currentUnit && !gamelogic.gameState.players[currentPlayer].reserve[unit] ) {
					$('#'+unit).removeClass("hide");
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
			  let thismenuItem        = $(this);

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

						    let timer = $timeout(function () {
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
								//
								// 	gamelogic.endSwap();
								//
								// } else {
									$scope.view.message = "";
									$timeout.cancel(messageTimer);
									$scope.displayMessage( gamelogic.turnPlayerNumberIntoName(gamelogic.gameState.gameStatus.swaps.players.second.player) + ", now you swap from your reserve!");
									gamelogic.passTurn(gamelogic.gameState.gameStatus.swaps.players.second.player );
								// }

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

								let timer2 = $timeout(function () {
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
								$scope.renderGameState();
								$scope.view.message = "";
								$timeout.cancel(messageTimer);
								$("#message").fadeIn( "slow", $scope.displayMessage( gamelogic.turnPlayerNumberIntoName(gamelogic.gameState.gameStatus.currentPlayer) + ", make your next move."));
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

				    let timer1 = $timeout(function () {
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
				let reserveMenuWrapperHeight = $('#reserve').css("height");
				let reserveMenuWrapperWidth = $('#reserve').css("width");
				let top = ( parseInt(ev.pageY) - (parseInt(reserveMenuWrapperHeight) /2) -9 ); // -9 is to fix offset center
				let left = ( parseInt(ev.pageX) - (parseInt(reserveMenuWrapperWidth) /2) +20); // +20 is to fix offset center

				$('#reserve').css({"top": top, "left": left});

				$('.menu-btn').toggleClass('clicked');
				$('#reserve').toggleClass('hide');
				$('.modalbackground').toggleClass('hide');
				$('.menu').toggleClass('open');
		};


		$scope.reserveMenuClickEventOn = function(){
			$('#grid').on('click', '[has-ripple="true"]', function (ev) {
				if ( !$(this).find("#"+$scope.view.selectedCor).hasClass("notAllowed") && !$('.menu').hasClass('open') ) {
					$scope.openReserveMenu(this, ev);
				}
			});
		};


			// #### MESSAGE WINDOW ####

			let messageTimer;

			$scope.view.message = "";

			$scope.view.printingMessage = false;

			$scope.displayMessage = function(msg){

			  if(msg.length > 0){

			      //append first character
			      $scope.view.message = $scope.view.message + msg[0];
			      messageTimer = $timeout(function(){
										$scope.view.printingMessage = true;
			              //Slice text by 1 character and call function again
			              $scope.displayMessage(msg.slice(1));
			           }, 25 );
				} else {
					$scope.view.printingMessage = false;
				}
			};

			$scope.checkForMsgs = function() {
				let currentPlayerName = gamelogic.turnPlayerNumberIntoName(gamelogic.gameState.gameStatus.currentPlayer);
				let players = gamelogic.gameState.players;
				let mode = gamelogic.gameState.gameStatus.mode;
				let ap = gamelogic.gameState.gameStatus.AP;

				// SETUP mode
				if ( mode === "setup" ) {
					$scope.view.message = "";
					$timeout.cancel(messageTimer);
					$("#message").fadeIn( "slow", $scope.displayMessage( currentPlayerName + ", click anywhere on the home row to place your units. Try to remember them. You won't be able to peek until a battle."));
				} else if ( mode === "turn" ) {
					$scope.view.message = "";
					$timeout.cancel(messageTimer);
					$("#message").fadeIn( "slow", $scope.displayMessage( currentPlayerName + ", click one of your units and choose where to move or attack. You have " + ap + " action points to use."));
				}
			}; // ^^^^^^ END OF CHECK MESSAGES ^^^^^^



			// (function(){   // setup into ready for battle and put the game into turn mode
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
			// 	$('#grid').off('click', '[has-ripple="true"]'); // TURN OFF reserveClickEvent
			//
			// })();



			// $scope.validMoveClickEventOn();
			$scope.checkForMsgs();
			$scope.renderGameState();

}]);

})();
