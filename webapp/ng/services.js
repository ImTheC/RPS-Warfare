/*jshint esversion: 6 */

(function(){

  'use strict';

  angular

    .module('rpsApp')

    .service('getUsersService',['$scope','$http','$firebaseObject',
                        function($scope, $http, $firebaseObject){



    }])

    .service('authService',['$firebaseAuth',function($firebaseAuth){

      return $firebaseAuth();

    }])


// ### GAMELOGIC ###

		.service('gamelogic', function(){

			let message = "";

			this.getMessage = function() {
				let msg = message;
				message = "";
				return msg;
			};

			this.randomRPS = function() {
				let choice = Math.floor(Math.random() * (3)) + 1;
				switch (choice) {
					case 1:
						return "rock";
					case 2:
						return "paper";
					case 3:
						return "scissors";
					default:
						return "Error";
				}
			};

			this.validMove = function ( selectedCor, actionCor ) {
					if ( this.validMoves[selectedCor][actionCor] ) {
						return true;
					} else {
						return false;
					}
			};

			this.findNextPlayer = function(){
				var currentPlayerNum = this.gameState.gameStatus.currentPlayer.split("player")[1];
				var nextPlayer = "player" + (parseInt(currentPlayerNum) + 1);

				if ( this.gameState.players[nextPlayer] )
					return nextPlayer;
				else {
					return "player1";
				}
			};

			this.passTurn = function ( passTo ) {
				this.gameState.gameStatus.currentPlayer = passTo;
				// checkForMsgs();
				// renderGameState();
			};

			this.endTurn = function () {
				let self = this;
				if ( this.gameState.gameStatus.mode === "setup" ) {
					self.gameState.gameStatus.AP = 4;
					self.passTurn( self.findNextPlayer() );
				} else {
					self.gameState.gameStatus.AP = 2;
					self.passTurn( self.findNextPlayer() );
				}
			};

			this.useAP = function ( ) {
				let self = this;
				this.gameState.gameStatus.AP -= 1;
			};

			this.move = function ( objectFromSelectedCor, moveFrom, moveTo ) {
				this.gameState.grid[moveTo] = objectFromSelectedCor;
				this.gameState.grid[moveFrom] = this.emptyBoardObject;
				this.useAP();
			};

			this.outcome = function( attacker, defender ){
				var outcome = {};

				switch (attacker[1].type + defender[1].type) {

					// rock
					case "rockrock":
						outcome = {"winner": "tie", "loser": "tie"};
						break;
					case "rockpaper":
						outcome = {"winner": defender, "loser": attacker};
						break;
					case "rockscissors":
						outcome = {"winner": attacker, "loser": defender};
						break;

					// paper
					case "paperpaper":
						outcome = {"winner": "tie", "loser": "tie"};
						break;
					case "paperrock":
						outcome = {"winner": attacker, "loser": defender};
						break;
					case "paperscissors":
						outcome = {"winner": defender, "loser": attacker};
						break;

					// scissors
					case "scissorsscissors":
						outcome = {"winner": "tie", "loser": "tie"};
						break;
					case "scissorspaper":
						outcome = {"winner": attacker, "loser": defender};
						break;
					case "scissorsrock":
						outcome = {"winner": defender, "loser": attacker};
						break;

					default:
						outcome = "ERROR";
						break;
				}

				return outcome;
			};

			this.loser = function( loserCor, loser ) {
				loser.health -= 1;

				if ( loser.health === 0 ) {
						this.gameState.grid[loserCor] = this.emptyBoardObject;
						return true;
				}
				return false;

			};

			this.endSwap = function () {
				this.gameState.gameStatus.swaps.players.first.player = null;
				this.gameState.gameStatus.swaps.players.first.cor = null;
				this.gameState.gameStatus.swaps.players.second.player = null;
				this.gameState.gameStatus.swaps.players.second.cor = null;
				this.gameState.gameStatus.swaps.numberOf = null;
			};

			this.initSwapOut = function( currentPlayer, opponent, selectedCor, actionCor ) {
				this.gameState.gameStatus.mode = "swap";
				this.gameState.gameStatus.swaps.players.first.player = currentPlayer;
				this.gameState.gameStatus.swaps.players.first.cor = selectedCor;
				this.gameState.gameStatus.swaps.players.second.player = opponent;
				this.gameState.gameStatus.swaps.players.second.cor = actionCor;
				this.gameState.gameStatus.swaps.numberOf = 2;
			};

			this.battle = function( selectedCor, objectFromSelectedCor, actionCor, objectFromActionCor ) {
				let self = this;
				let players = this.gameState.players;
				let attacker = [selectedCor, objectFromSelectedCor];
				let defender = [actionCor, objectFromActionCor];

				let outcome = this.outcome( attacker, defender);
				let winner = outcome.winner;
				let loser = outcome.loser;

				if ( winner === loser ) {
					message = "You two are evenly matched. " + objectFromSelectedCor.owner + ", swap from your reserve!";
					this.useAP();
					this.initSwapOut(objectFromSelectedCor.owner, objectFromActionCor.owner, selectedCor, actionCor);
				} else {
					let died = this.loser(loser[0], loser[1]); // loser(loserCor, loserObj)
					message = players[loser[1].owner].name + " was decimated by " + players[winner[1].owner].name + "!! " + self.gameState.gameStatus.currentPlayer + " make your next move.";
					if ( winner === attacker && died ) {
						this.move( winner[1], winner[0], loser[0] ); // move (winnerObj, winnerCor, loserCor)
					} else {
						this.useAP();
					}
				} // ### END OF ELSE

			};

			this.resolveMove = function ( selectedCor, objectFromSelectedCor, actionCor, objectFromActionCor ) {
				let self = this;
				if ( this.validMove( selectedCor, actionCor) ) {
					if ( objectFromActionCor.owner === null ) {
						self.move(objectFromSelectedCor, selectedCor, actionCor);
					} else {
					 self.battle(selectedCor, objectFromSelectedCor, actionCor, objectFromActionCor);
					}
				}
			};

			this.placeCharacter = function() {
				// NEED TO DO!!
				return;
			};

			this.returnTrue = function() {
					return true;
				};


			this.emptyBoardObject = { "owner": null, "type": null, "health": null };

			this.validMoves = {
					"hex1": {
									 "hex2": true,
									 "hex5": true,
									 "hex6": true
									},
					"hex2": {
									 "hex1": true,
									 "hex6": true,
									 "hex7": true,
									 "hex3": true
									},
					"hex3": {
									 "hex2": true,
									 "hex7": true,
									 "hex8": true,
									 "hex4": true
									},
					"hex4": {
									 "hex3": true,
									 "hex8": true,
									 "hex9": true
								 },
					"hex5": {
									 "hex10": true,
									 "hex1": true,
									 "hex6": true
								 },
					"hex6": {
									 "hex1": true,
									 "hex2": true,
									 "hex5": true,
									 "hex7": true,
									 "hex10": true,
									 "hex11": true
								 },
					"hex7": {
									 "hex2": true,
									 "hex3": true,
									 "hex6": true,
									 "hex8": true,
									 "hex12": true,
									 "hex11": true
								 },
					"hex8": {
									 "hex3": true,
									 "hex4": true,
									 "hex7": true,
									 "hex9": true,
									 "hex13": true,
									 "hex12": true
								 },
					"hex9": {
									 "hex4": true,
									 "hex8": true,
									 "hex14": true,
									 "hex13": true
								 },
					"hex10": {
									 "hex5": true,
									 "hex6": true,
									 "hex11": true,
									 "hex16": true,
									 "hex15": true
								 },
					"hex11": {
									 "hex7": true,
									 "hex6": true,
									 "hex10": true,
									 "hex12": true,
									 "hex17": true,
									 "hex16": true
								 },
					"hex12": {
									 "hex8": true,
									 "hex7": true,
									 "hex11": true,
									 "hex13": true,
									 "hex18": true,
									 "hex17": true
								 },
					"hex13": {
									 "hex8": true,
									 "hex9": true,
									 "hex12": true,
									 "hex14": true,
									 "hex19": true,
									 "hex18": true
								 },
					"hex14": {
									 "hex9": true,
									 "hex13": true,
									 "hex19": true
								 },
					"hex15": {
									 "hex10": true,
									 "hex16": true,
									 "hex20": true
								 },
					"hex16":{
									 "hex10": true,
									 "hex11": true,
									 "hex15": true,
									 "hex17": true,
									 "hex20": true,
									 "hex21": true
								 },
					"hex17":{
									 "hex12": true,
									 "hex11": true,
									 "hex16": true,
									 "hex18": true,
									 "hex22": true,
									 "hex21": true
								 },
					"hex18":{
									 "hex13": true,
									 "hex12": true,
									 "hex17": true,
									 "hex19": true,
									 "hex22": true,
									 "hex23": true
								 },
					"hex19":{
									 "hex14": true,
									 "hex13": true,
									 "hex18": true,
									 "hex23": true,
									 "hex24": true,
								 },
					"hex20":{
									 "hex15": true,
									 "hex16": true,
									 "hex21": true,
									 "hex26": true,
									 "hex25": true
								 },
					"hex21":{
									 "hex16": true,
									 "hex17": true,
									 "hex20": true,
									 "hex22": true,
									 "hex27": true,
									 "hex26": true
								 },
					"hex22":{
									 "hex17": true,
									 "hex18": true,
									 "hex21": true,
									 "hex23": true,
									 "hex27": true,
									 "hex28": true
								 },
					"hex23":{
									 "hex18": true,
									 "hex19": true,
									 "hex22": true,
									 "hex24": true,
									 "hex28": true,
									 "hex29": true
								 },
					"hex24":{
									 "hex19": true,
									 "hex23": true,
									 "hex29": true
								 },
					"hex25":{
									 "hex20": true,
									 "hex26": true,
									 "hex30": true
								 },
					"hex26":{
									 "hex21": true,
									 "hex20": true,
									 "hex25": true,
									 "hex27": true,
									 "hex31": true,
									 "hex30": true
								 },
					"hex27":{
									 "hex22": true,
									 "hex21": true,
									 "hex26": true,
									 "hex28": true,
									 "hex32": true,
									 "hex31": true
								 },
					"hex28":{
									 "hex23": true,
									 "hex22": true,
									 "hex27": true,
									 "hex29": true,
									 "hex32": true,
									 "hex33": true
								 },
					"hex29":{
									 "hex23": true,
									 "hex24": true,
									 "hex28": true,
									 "hex33": true,
									 "hex34": true
								 },
					"hex30":{
									 "hex26": true,
									 "hex25": true,
									 "hex31": true,
									 "hex35": true
								 },
					"hex31":{
									 "hex27": true,
									 "hex26": true,
									 "hex30": true,
									 "hex32": true,
									 "hex35": true,
									 "hex36": true
								 },
					"hex32":{
									 "hex28": true,
									 "hex27": true,
									 "hex31": true,
									 "hex33": true,
									 "hex36": true,
									 "hex37": true
								 },
					"hex33":{
									 "hex29": true,
									 "hex28": true,
									 "hex32": true,
									 "hex34": true,
									 "hex37": true,
									 "hex38": true
								 },
					"hex34":{
									 "hex29": true,
									 "hex33": true,
									 "hex38": true
								 },
					"hex35":{
									 "hex30": true,
									 "hex31": true,
									 "hex36": true
								 },
					"hex36":{
									 "hex31": true,
									 "hex32": true,
									 "hex35": true,
									 "hex37": true
								 },
					"hex37":{
									 "hex32": true,
									 "hex33": true,
									 "hex36": true,
									 "hex38": true
								 },
					"hex38":{
									 "hex33": true,
									 "hex34": true,
									 "hex37": true
								 }
					};

					this.gameState = {
								"players": {
									"player1": {
										"name": "Player1",
										"avatarLink": "images/agents/panda.gif",
										"reserve": {
											"unit1": "scissors",
											"unit2": "rock",
											"unit3": "paper",
											"unit4": "scissors",
											"unit5": "rock",
											"unit6": "paper"
										}
									},
									"player2": {
										"name": "Player2",
										"avatarLink": "images/agents/rainbowsheep.gif",
										"reserve": {
											"unit1": "scissors",
											"unit2": "rock",
											"unit3": "paper",
											"unit4": "scissors",
											"unit5": "rock",
											"unit6": "paper"
										}
									}
								},
								"gameStatus": {
									"currentPlayer": "player1",
									"mode": "setup",
									"swaps": {
										"numberOf": null,
										"players": {
											"first": {"player": null, "cor": null},
											"second": {"player": null, "cor": null}
										}
									},
									"AP": 4,
								},
								"grid": {
									"hex1": {
												 "owner": null, "type": null, "health": null
											 },
									"hex2": {
												 "owner": null, "type": null, "health": null
											 },
									"hex3": {
												 "owner": null, "type": null, "health": null
											 },
									"hex4": {
												 "owner": null, "type": null, "health": null
											 },
									"hex5": {
												 "owner": null, "type": null, "health": null
											 },
									"hex6": {
												 "owner": null, "type": null, "health": null
											 },
									"hex7": {
												 "owner": null, "type": null, "health": null
											 },
									"hex8": {
												 "owner": null, "type": null, "health": null
											 },
									"hex9": {
												 "owner": null, "type": null, "health": null
											 },
									"hex10": {
												 "owner": null, "type": null, "health": null
											 },
									"hex11": {
												 "owner": null, "type": null, "health": null
											 },
									"hex12": {
												 "owner": null, "type": null, "health": null
											 },
									"hex13": {
												 "owner": null, "type": null, "health": null
											 },
									"hex14": {
												 "owner": null, "type": null, "health": null
											 },
									"hex15": {
												 "owner": null, "type": null, "health": null
											 },
									"hex16": {
												 "owner": null, "type": null, "health": null
											 },
									"hex17": {
												 "owner": null, "type": null, "health": null
											 },
									"hex18": {
												 "owner": null, "type": null, "health": null
											 },
									"hex19": {
												 "owner": null, "type": null, "health": null
											 },
									"hex20": {
												 "owner": null, "type": null, "health": null
											 },
									"hex21": {
												 "owner": null, "type": null, "health": null
											 },
									"hex22": {
												 "owner": null, "type": null, "health": null
											 },
									"hex23": {
												 "owner": null, "type": null, "health": null
											 },
									"hex24": {
												 "owner": null, "type": null, "health": null
											 },
									"hex25": {
												 "owner": null, "type": null, "health": null
											 },
									"hex26": {
												 "owner": null, "type": null, "health": null
											 },
									"hex27": {
												 "owner": null, "type": null, "health": null
											 },
									"hex28": {
												 "owner": null, "type": null, "health": null
											 },
									"hex29": {
												 "owner": null, "type": null, "health": null
											 },
									"hex30": {
												 "owner": null, "type": null, "health": null
											 },
									"hex31": {
												 "owner": null, "type": null, "health": null
											 },
									"hex32": {
												 "owner": null, "type": null, "health": null
											 },
									"hex33": {
												 "owner": null, "type": null, "health": null
											 },
									"hex34": {
												 "owner": null, "type": null, "health": null
											 },
									"hex35": {
												 "owner": null, "type": null, "health": null
											 },
									"hex36": {
												 "owner": null, "type": null, "health": null
											 },
									"hex37": {
												 "owner": null, "type": null, "health": null
											 },
									"hex38": {
												 "owner": null, "type": null, "health": null
											 }
									}
							};
		})



    .service("addUserService", ["$firebaseObject",
      function($firebaseObject) {
        return function(uid) {
          // create a reference to the database node where we will store our data
          var ref = firebase.database().ref("users").push();
          var uidRef = ref.child(uid);

          // return it as a synchronized object
          return $firebaseObject(uidRef);
        };
      }
    ])

    .service('newGameService',['$http','$firebaseObject',function($http,$firebaseObject){



    }])

    .service('setupGameService',['$http','$firebaseObject',function($http,$firebaseObject){



    }])

    .service('getGameService',['$http','$firebaseObject',function($http,$firebaseObject){



    }]);

})();
