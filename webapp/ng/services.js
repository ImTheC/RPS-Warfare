/*jshint esversion: 6 */

(function(){

  'use strict';

  angular

    .module('rpsApp')

    .service('authService',['$firebaseAuth',function($firebaseAuth){

      return $firebaseAuth();

    }])

    .service("addUserService", ["$firebaseArray",
      function($firebaseArray) {

        this.addToDb = function(node){
          let ref = firebase.database().ref().child(node);
          return $firebaseArray(ref);
				};


      }
    ])

    .service('getUserService',['$firebaseArray',function($firebaseArray){

      this.fromUserObj = function(recordId){

        let ref = firebase.database().ref().child("users");
        return $firebaseArray(ref).$getRecord(recordId);

      };

    }])

    .service("getGameService", ["$rootScope",'$firebaseArray',
      function($rootScope,$firebaseArray) {

        this.newGame = function(pid1,pname1,pid2,pname2){


                let game = {

                  "players": {
                    "player1": {
                      "id": pid1,
                      "displayName": pname1,
                      "reserve": {
                        "unit1": "Rock",
                        "unit2": "Rock",
                        "unit3": "Paper",
                        "unit4": "Paper",
                        "unit5": "Scissors",
                        "unit6": "Scissors"
                      },
                    },
                    "player2": {
                      "id": pid2,
                      "displayName": pname2,
                      "reserve": {
                        "unit1": "Rock",
                        "unit2": "Rock",
                        "unit3": "Paper",
                        "unit4": "Paper",
                        "unit5": "Scissors",
                        "unit6": "Scissors"
                      }
                    },
                  },
                  "gameStatus": {
                    "currentPlayer": "player1",
                    "mode": "setup",
                    "swaps": {
                      "numberOf": '',
                      "players": {
                        "first": '',
                        "second": ''
                      }
                    },
                    "AP": 4,
                  },
                  "grid": {
                    "hex1": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex2": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex3": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex4": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex5": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex6": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex7": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex8": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex9": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex10": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex11": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex12": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex13": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex14": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex15": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex16": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex17": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex18": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex19": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex20": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex21": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex22": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex23": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex24": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex25": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex26": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex27": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex28": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex29": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex30": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex31": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex32": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex33": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex34": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex35": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex36": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex37": {
                           "owner": '', "type": '', "health": 1
                         },
                    "hex38": {
                           "owner": '', "type": '', "health": 1
                         }
                    }

                };

                // GET KEY FOR NEW GAME INSTANCE
                let gameKey = firebase.database().ref().child('games').push().key;
                console.log('set game key: ',gameKey);
                $rootScope.currentGameId = gameKey;
                console.log('current game id on rootScope: ',$rootScope.currentGameId);

                // SAVE GAME AT ENDPOINT
                let updates = {};
                updates['/games/' + gameKey] = game;

                return firebase.database().ref().update(updates);


        };

        this.currentGame = function(){

        };

        this.gameDefaults = {
        "players": {
        	"player1": {
        		"id": null,
        		"displayName": null,
        		"reserve": {
        			"unit1": "Rock",
        			"unit2": "Rock",
        			"unit3": "Paper",
        			"unit4": "Paper",
        			"unit5": "Scissors",
        			"unit6": "Scissors"
        		},
        	},
        	"player2": {
        		"id": null,
        		"displayName": null,
        		"reserve": {
        			"unit1": "Rock",
        			"unit2": "Rock",
        			"unit3": "Paper",
        			"unit4": "Paper",
        			"unit5": "Scissors",
        			"unit6": "Scissors"
        		}
        	},
        },
        "gameStatus": {
        	"currentPlayer": "player1",
        	"mode": "setup",
        	"swaps": {
        		"numberOf": null,
        		"players": {
        			"first": null,
        			"second": null
        		}
        	},
        	"AP": null,
        },
        "grid": {
        	"hex1": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex2": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex3": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex4": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex5": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex6": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex7": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex8": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex9": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex10": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex11": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex12": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex13": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex14": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex15": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex16": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex17": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex18": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex19": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex20": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex21": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex22": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex23": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex24": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex25": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex26": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex27": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex28": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex29": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex30": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex31": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex32": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex33": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex34": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex35": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex36": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex37": {
        				 "owner": null, "type": null, "health": 1
        			 },
        	"hex38": {
        				 "owner": null, "type": null, "health": 1
        			 }
        	}
        };

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
						let currentPlayerNum = this.gameState.gameStatus.currentPlayer;
						let number = currentPlayerNum.split("player")[1];
						let nextPlayer = "player" + (parseInt(number) + 1);

						if ( this.gameState.players[nextPlayer] )
							return nextPlayer;
						else {
							return "player1";
						}
					};

					this.passTurn = function ( passTo ) {
						this.gameState.gameStatus.currentPlayer = passTo;
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

						// console.log(this.gameState.players[opponent].username);

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
							message = "Double " + objectFromSelectedCor.type + "! You two are evenly matched. " + this.gameState.players[objectFromSelectedCor.owner].username + ", swap from your reserve!";
							this.useAP();
							this.initSwapOut(objectFromSelectedCor.owner, objectFromActionCor.owner, selectedCor, actionCor);
						} else {
							let died = this.loser(loser[0], loser[1]); // loser(loserCor, loserObj)

							if ( self.gameState.gameStatus.AP === 1 ) {
								message = players[winner[1].owner].username + "'s " + winner[1].type + " decimated " + players[loser[1].owner].username + "'s " + loser[1].type + "!! " + self.turnPlayerNumberIntoName(self.findNextPlayer(self.gameState.gameStatus.currentPlayer)) + " make your next move.";
							} else {
								message = players[winner[1].owner].username + "'s " + winner[1].type + " decimated " + players[loser[1].owner].username + "'s " + loser[1].type + "!! " + self.turnPlayerNumberIntoName(self.gameState.gameStatus.currentPlayer) + " make your next move.";
							}

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
							if ( objectFromActionCor.owner === "" ) {
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

					this.checkForGameEnd = function() {
						let self = this;
						let firstFound = "";

						for ( let hex in self.gameState.grid ) {
							if ( self.gameState.grid[hex].owner !== "" && self.gameState.grid[hex].owner !== null ) {

								if ( firstFound === "" ) {
									firstFound = self.gameState.grid[hex].owner;

								} else if ( firstFound != self.gameState.grid[hex].owner ) {
									return false; // the game is not over

								}
							}

						}

						self.gameState.mode = "end";
						return firstFound; // the game is over

					};

					this.checkIfNoReserveLeft = function(player) {
						let self = this;

						for ( let unit in this.gameState.players[player].reserve ) {
							if ( this.gameState.players[player].reserve[unit] ) {
								return false; // if has units in reserve
							}
						}

						return true; // if has no reserve left
					};

					this.turnPlayerNumberIntoName = function(player){

						return this.gameState.players[player].username;

					};

					// this.turnPlayerNameIntoNumber = function(name){
					//
					// 	for ( let playerNumber in this.gameState.players ) {
					// 		// console.log(name, " = ", this.gameState.players[playerNumber].username);
					// 		// console.log(playerNumber);
					// 		if ( this.gameState.players[playerNumber].username === name ) {
					//
					// 			return playerNumber;
					// 		}
					// 	}
					// };


					this.emptyBoardObject = { "owner": "", "type": "", "health": "" };

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
												"username": "Christopher",
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
												"username": "Castro",
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
														 "owner": "", "type": "", "health": ""
													 },
											"hex2": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex3": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex4": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex5": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex6": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex7": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex8": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex9": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex10": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex11": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex12": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex13": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex14": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex15": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex16": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex17": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex18": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex19": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex20": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex21": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex22": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex23": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex24": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex25": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex26": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex27": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex28": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex29": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex30": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex31": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex32": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex33": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex34": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex35": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex36": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex37": {
														 "owner": "", "type": "", "health": ""
													 },
											"hex38": {
														 "owner": "", "type": "", "health": ""
													 }
											}
									};
				});

})();
