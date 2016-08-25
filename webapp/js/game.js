/*jshint esversion: 6 */

$(function(){
	"use strict";
//
// 	// #### $scope.view.gamelogic ####
//
// 	let $scope.view.gamelogic = {
//
// 		randomRPS: function() {
// 			let choice = Math.floor(Math.random() * (3)) + 1;
// 			switch (choice) {
// 				case 1:
// 					return "rock";
// 				case 2:
// 					return "paper";
// 				case 3:
// 					return "scissors";
// 				default:
// 					return "Error";
// 			}
// 		},
//
// 		validMove: function ( $scope.view.selectedCor, $scope.view.actionCor ) {
// 				if ( gamelogic.validMoves[$scope.view.selectedCor][$scope.view.actionCor] ) {
// 					return true;
// 				} else {
// 					return false;
// 				}
// 		},
//
// 		findNextPlayer: function(){
// 			var currentPlayerNum = gamelogic.gameState.gameStatus.currentPlayer.split("player")[1];
// 			var nextPlayer = "player" + (parseInt(currentPlayerNum) + 1);
//
// 			if ( gamelogic.gameState.players[nextPlayer] )
// 				return nextPlayer;
// 			else {
// 				return "player1";
// 			}
// 		},
//
// 		passTurn: function ( passTo ) {
// 			gamelogic.gameState.gameStatus.currentPlayer = passTo;
// 			renderGameState();
// 		},
//
// 		endTurn: function () {
// 			if ( gamelogic.gameState.gameStatus.mode === "setup" ) {
// 				gamelogic.gameState.gameStatus.AP = 4;
// 				gamelogic.passTurn( gamelogic.findNextPlayer() );
// 				elem.text("");
// 				clearTimeout(messageTimer);
// 				$("#message").fadeIn( "slow", displayMessage( gamelogic.gameState.gameStatus.currentPlayer + ", click anywhere on the home row to place your units. Try to remember them. You won't be able to peek until a battle.", elem));
// 			} else {
// 				gamelogic.gameState.gameStatus.AP = 2;
// 				gamelogic.passTurn( gamelogic.findNextPlayer() );
// 			}
// 		},
//
// 		useAP: function ( ) {
// 			if ( gamelogic.gameState.gameStatus.AP > 1 ) {
// 				gamelogic.gameState.gameStatus.AP -= 1;
// 			} else {
// 				gamelogic.gameState.gameStatus.AP -= 1;
// 				gamelogic.endTurn();
// 			}
// 		},
//
// 		move: function ( objectFromSelectedCor, moveFrom, moveTo ) {
// 			gamelogic.gameState.grid[moveTo] = objectFromSelectedCor;
// 			gamelogic.gameState.grid[moveFrom] = gamelogic.emptyBoardObject;
// 			gamelogic.useAP();
// 		},
//
// 		outcome: function( attacker, defender ){
// 			var outcome = {};
//
// 			switch (attacker[1].type + defender[1].type) {
//
// 				// rock
// 				case "rockrock":
// 					outcome = {"winner": "tie", "loser": "tie"};
// 					break;
// 				case "rockpaper":
// 					outcome = {"winner": defender, "loser": attacker};
// 					break;
// 				case "rockscissors":
// 					outcome = {"winner": attacker, "loser": defender};
// 					break;
//
// 				// paper
// 				case "paperpaper":
// 					outcome = {"winner": "tie", "loser": "tie"};
// 					break;
// 				case "paperrock":
// 					outcome = {"winner": attacker, "loser": defender};
// 					break;
// 				case "paperscissors":
// 					outcome = {"winner": defender, "loser": attacker};
// 					break;
//
// 				// scissors
// 				case "scissorsscissors":
// 					outcome = {"winner": "tie", "loser": "tie"};
// 					break;
// 				case "scissorspaper":
// 					outcome = {"winner": attacker, "loser": defender};
// 					break;
// 				case "scissorsrock":
// 					outcome = {"winner": defender, "loser": attacker};
// 					break;
//
// 				default:
// 					outcome = "ERROR";
// 					break;
// 			}
//
// 			elem.text("");
// 			clearTimeout(messageTimer);
// 			$("#message").fadeIn( "slow", displayMessage( outcome.winner[1].type + " blows up " + outcome.loser[1].type + "!", elem));
//
// 			return outcome;
// 		},
//
// 		loser: function( loserCor, loser ) {
// 			loser.health -= 1;
//
// 			if ( loser.health === 0 ) {
// 					gamelogic.gameState.grid[loserCor] = gamelogic.emptyBoardObject;
// 					return true;
// 			}
// 			return false;
//
// 		},
//
// 		endSwap: function () {
// 			elem.text("");
// 			clearTimeout(messageTimer);
// 			displayMessage( gamelogic.gameState.gameStatus.currentPlayer + "\'s turn! You have " + gamelogic.gameState.gameStatus.AP + " action points.", elem);
// 			gamelogic.passTurn( gamelogic.gameState.gameStatus.swaps.players.first.player );
// 			gamelogic.gameState.gameStatus.swaps.players.first.player = null;
// 			gamelogic.gameState.gameStatus.swaps.players.first.cor = null;
// 			gamelogic.gameState.gameStatus.swaps.players.second.player = null;
// 			gamelogic.gameState.gameStatus.swaps.players.second.cor = null;
// 			gamelogic.gameState.gameStatus.swaps.numberOf = null;
// 		},
//
// 		initSwapOut: function( currentPlayer, opponent ) {
// 			gamelogic.gameState.gameStatus.mode = "swap";
// 			gamelogic.gameState.gameStatus.swaps.players.first.player = currentPlayer;
// 			gamelogic.gameState.gameStatus.swaps.players.first.cor = $scope.view.selectedCor;
// 			gamelogic.gameState.gameStatus.swaps.players.second.player = opponent;
// 			gamelogic.gameState.gameStatus.swaps.players.second.cor = $scope.view.actionCor;
// 			gamelogic.gameState.gameStatus.swaps.holdAP = gamelogic.gameState.gameStatus.AP;
// 			gamelogic.gameState.gameStatus.swaps.numberOf = 2;
// 			renderGameState();
// 		},
//
// 		battle: function( $scope.view.selectedCor, objectFromSelectedCor, $scope.view.actionCor, objectFromActionCor ) {
// 			let players = gamelogic.gameState.players;
// 			let attacker = [$scope.view.selectedCor, objectFromSelectedCor];
// 			let defender = [$scope.view.actionCor, objectFromActionCor];
//
// 			let outcome = gamelogic.outcome( attacker, defender);
// 			let winner = outcome.winner;
// 			let loser = outcome.loser;
//
// 			if ( winner === loser ) {
// 				elem.text("");
// 				clearTimeout(messageTimer);
// 				displayMessage("You two are evenly matched with your " + attacker[1].type + ". ", elem);
// 				//+ attacker[1].owner + ", swap from your reserve!"  // <-- Put back in for swap
// 				gamelogic.useAP();
// 				// gamelogic.initSwapOut(objectFromSelectedCor.owner, objectFromActionCor.owner);
// 			} else {
// 				let died = gamelogic.loser(loser[0], loser[1]); // loser(loserCor, loserObj)
//
// 				elem.text("");
// 				clearTimeout(messageTimer);
// 				displayMessage( players[loser[1].owner].name + "\'s " + loser[1].type + " was decimated!! " + players[winner[1].owner].name + "\'s " + winner[1].type + " reign victorious!!", elem);
// 				if ( winner === attacker && died ) {
// 					gamelogic.move( winner[1], winner[0], loser[0] ); // move (winnerObj, winnerCor, loserCor)
// 				} else {
// 					gamelogic.useAP();
// 				}
// 				checkGameState();
// 			} // ### END OF ELSE
//
// 		},
//
// 		resolveMove: function ( $scope.view.selectedCor, objectFromSelectedCor, $scope.view.actionCor, objectFromActionCor ) {
// 			if ( gamelogic.validMove( $scope.view.selectedCor, $scope.view.actionCor) ) {
// 				if ( objectFromActionCor.owner === null ) {
// 					gamelogic.move(objectFromSelectedCor, $scope.view.selectedCor, $scope.view.actionCor);
// 				} else {
// 				 gamelogic.battle($scope.view.selectedCor, objectFromSelectedCor, $scope.view.actionCor, objectFromActionCor);
// 				}
// 			}
// 		},
//
// 		placeCharacter: function() {
// 			// NEED TO DO!!
// 			return;
// 		},
//
// 		returnTrue: function() {
// 				return true;
// 			},
//
// 		emptyBoardObject: { "owner": null, "type": null, "health": null },
//
// 		validMoves: {
// 				"hex1": {
// 								 "hex2": true,
// 								 "hex5": true,
// 								 "hex6": true
// 								},
// 				"hex2": {
// 								 "hex1": true,
// 								 "hex6": true,
// 								 "hex7": true,
// 								 "hex3": true
// 								},
// 				"hex3": {
// 								 "hex2": true,
// 								 "hex7": true,
// 								 "hex8": true,
// 								 "hex4": true
// 								},
// 				"hex4": {
// 								 "hex3": true,
// 								 "hex8": true,
// 								 "hex9": true
// 							 },
// 				"hex5": {
// 								 "hex10": true,
// 								 "hex1": true,
// 								 "hex6": true
// 							 },
// 				"hex6": {
// 								 "hex1": true,
// 								 "hex2": true,
// 								 "hex5": true,
// 								 "hex7": true,
// 								 "hex10": true,
// 								 "hex11": true
// 							 },
// 				"hex7": {
// 								 "hex2": true,
// 								 "hex3": true,
// 								 "hex6": true,
// 								 "hex8": true,
// 								 "hex12": true,
// 								 "hex11": true
// 							 },
// 				"hex8": {
// 								 "hex3": true,
// 								 "hex4": true,
// 								 "hex7": true,
// 								 "hex9": true,
// 								 "hex13": true,
// 								 "hex12": true
// 							 },
// 				"hex9": {
// 								 "hex4": true,
// 								 "hex8": true,
// 								 "hex14": true,
// 								 "hex13": true
// 							 },
// 				"hex10": {
// 								 "hex5": true,
// 								 "hex6": true,
// 								 "hex11": true,
// 								 "hex16": true,
// 								 "hex15": true
// 							 },
// 				"hex11": {
// 								 "hex7": true,
// 								 "hex6": true,
// 								 "hex10": true,
// 								 "hex12": true,
// 								 "hex17": true,
// 								 "hex16": true
// 							 },
// 				"hex12": {
// 								 "hex8": true,
// 								 "hex7": true,
// 								 "hex11": true,
// 								 "hex13": true,
// 								 "hex18": true,
// 								 "hex17": true
// 							 },
// 				"hex13": {
// 								 "hex8": true,
// 								 "hex9": true,
// 								 "hex12": true,
// 								 "hex14": true,
// 								 "hex19": true,
// 								 "hex18": true
// 							 },
// 				"hex14": {
// 								 "hex9": true,
// 								 "hex13": true,
// 								 "hex19": true
// 							 },
// 				"hex15": {
// 								 "hex10": true,
// 								 "hex16": true,
// 								 "hex20": true
// 							 },
// 				"hex16":{
// 								 "hex10": true,
// 								 "hex11": true,
// 								 "hex15": true,
// 								 "hex17": true,
// 								 "hex20": true,
// 								 "hex21": true
// 							 },
// 				"hex17":{
// 								 "hex12": true,
// 								 "hex11": true,
// 								 "hex16": true,
// 								 "hex18": true,
// 								 "hex22": true,
// 								 "hex21": true
// 							 },
// 				"hex18":{
// 								 "hex13": true,
// 								 "hex12": true,
// 								 "hex17": true,
// 								 "hex19": true,
// 								 "hex22": true,
// 								 "hex23": true
// 							 },
// 				"hex19":{
// 								 "hex14": true,
// 								 "hex13": true,
// 								 "hex18": true,
// 								 "hex23": true,
// 								 "hex24": true,
// 							 },
// 				"hex20":{
// 								 "hex15": true,
// 								 "hex16": true,
// 								 "hex21": true,
// 								 "hex26": true,
// 								 "hex25": true
// 							 },
// 				"hex21":{
// 								 "hex16": true,
// 								 "hex17": true,
// 								 "hex20": true,
// 								 "hex22": true,
// 								 "hex27": true,
// 								 "hex26": true
// 							 },
// 				"hex22":{
// 								 "hex17": true,
// 								 "hex18": true,
// 								 "hex21": true,
// 								 "hex23": true,
// 								 "hex27": true,
// 								 "hex28": true
// 							 },
// 				"hex23":{
// 								 "hex18": true,
// 								 "hex19": true,
// 								 "hex22": true,
// 								 "hex24": true,
// 								 "hex28": true,
// 								 "hex29": true
// 							 },
// 				"hex24":{
// 								 "hex19": true,
// 								 "hex23": true,
// 								 "hex29": true
// 							 },
// 				"hex25":{
// 								 "hex20": true,
// 								 "hex26": true,
// 								 "hex30": true
// 							 },
// 				"hex26":{
// 								 "hex21": true,
// 								 "hex20": true,
// 								 "hex25": true,
// 								 "hex27": true,
// 								 "hex31": true,
// 								 "hex30": true
// 							 },
// 				"hex27":{
// 								 "hex22": true,
// 								 "hex21": true,
// 								 "hex26": true,
// 								 "hex28": true,
// 								 "hex32": true,
// 								 "hex31": true
// 							 },
// 				"hex28":{
// 								 "hex23": true,
// 								 "hex22": true,
// 								 "hex27": true,
// 								 "hex29": true,
// 								 "hex32": true,
// 								 "hex33": true
// 							 },
// 				"hex29":{
// 								 "hex23": true,
// 								 "hex24": true,
// 								 "hex28": true,
// 								 "hex33": true,
// 								 "hex34": true
// 							 },
// 				"hex30":{
// 								 "hex26": true,
// 								 "hex25": true,
// 								 "hex31": true,
// 								 "hex35": true
// 							 },
// 				"hex31":{
// 								 "hex27": true,
// 								 "hex26": true,
// 								 "hex30": true,
// 								 "hex32": true,
// 								 "hex35": true,
// 								 "hex36": true
// 							 },
// 				"hex32":{
// 								 "hex28": true,
// 								 "hex27": true,
// 								 "hex31": true,
// 								 "hex33": true,
// 								 "hex36": true,
// 								 "hex37": true
// 							 },
// 				"hex33":{
// 								 "hex29": true,
// 								 "hex28": true,
// 								 "hex32": true,
// 								 "hex34": true,
// 								 "hex37": true,
// 								 "hex38": true
// 							 },
// 				"hex34":{
// 								 "hex29": true,
// 								 "hex33": true,
// 								 "hex38": true
// 							 },
// 				"hex35":{
// 								 "hex30": true,
// 								 "hex31": true,
// 								 "hex36": true
// 							 },
// 				"hex36":{
// 								 "hex31": true,
// 								 "hex32": true,
// 								 "hex35": true,
// 								 "hex37": true
// 							 },
// 				"hex37":{
// 								 "hex32": true,
// 								 "hex33": true,
// 								 "hex36": true,
// 								 "hex38": true
// 							 },
// 				"hex38":{
// 								 "hex33": true,
// 								 "hex34": true,
// 								 "hex37": true
// 							 },
// 				},
//
// 				gameState: {
// 							"players": {
// 								"player1": {
// 									"name": "Player1",
// 									"avatarLink": "webapp/images/agents/panda.gif",
// 									"reserve": {
// 										"unit1": "scissors",
// 										"unit2": "rock",
// 										"unit3": "paper",
// 										"unit4": "scissors",
// 										"unit5": "rock",
// 										"unit6": "paper"
// 									}
// 								},
// 								"player2": {
// 									"name": "Player2",
// 									"avatarLink": "webapp/images/agents/rainbowsheep.gif",
// 									"reserve": {
// 										"unit1": "scissors",
// 										"unit2": "rock",
// 										"unit3": "paper",
// 										"unit4": "scissors",
// 										"unit5": "rock",
// 										"unit6": "paper"
// 									}
// 								}
// 							},
// 							"gameStatus": {
// 								"currentPlayer": "player1",
// 								"mode": "setup",
// 								"swaps": {
// 									"numberOf": null,
// 									"players": {
// 										"first": {"player": null, "cor": null},
// 										"second": {"player": null, "cor": null}
// 									}
// 								},
// 								"AP": 4,
// 							},
// 							"grid": {
// 								"hex1": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex2": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex3": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex4": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex5": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex6": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex7": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex8": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex9": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex10": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex11": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex12": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex13": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex14": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex15": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex16": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex17": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex18": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex19": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex20": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex21": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex22": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex23": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex24": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex25": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex26": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex27": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex28": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex29": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex30": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex31": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex32": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex33": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex34": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex35": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex36": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex37": {
// 											 "owner": null, "type": null, "health": null
// 										 },
// 								"hex38": {
// 											 "owner": null, "type": null, "health": null
// 										 }
// 								} // end of grid:
// 				}
// 	}; // END OF const $scope.view.gamelogic =
//
// // ^^^^^ END OF $scope.view.gamelogic ^^^^^


// const elem = $("#message").find('p');
// let messageTimer;

// ***** MOVED TO SERVICE *****
	// let selectedCor = "";
	// let actionCor = "";
	//
	// const unitList = {
	// 	unit1: "scissors",
	// 	unit2: "rock",
	// 	unit3: "paper",
	// 	unit4: "scissors",
	// 	unit5: "rock",
	// 	unit6: "paper"
	// };
	//
	// const imageList = {
	// 	rock: "webapp/images/rock.png",
	// 	paper: "webapp/images/paper.png",
	// 	scissors: "webapp/images/scissors.png"
	// };


	function showExplosion( loserCor ) {
		// $('#'+loserCor).remove($('#'+loserCor));
		// $parent.append("<div class='notAllowed' id='hex18'>18<img src='" + "webapp/images/explosion.gif" + "' alt='Big Explosion'></div>");
		// $hex.hide().show(0);
	}


	// $('*').on("click", function(){   // turn on to see what you're clicking
	// 	console.log($(this));
	// });











	function gamewinChecker() {
		let found1 = false;
		let found2 = false;
		let winner;
		let loser;

		for ( let grid in gamelogic.gameState.grid ) {
			if ( grid.owner && !found1) {
				found1 = true;
				winner = grid.owner;
			} else if ( grid.owner && !found2 ) {
				found2 = true;
				winner = null;
			}
		}
		if ( found1 === found2 ) {
			return false;
		} else {
			for ( let player in gamelogic.gameState.players ) {
				if ( player != winner ) {
					loser = player;
				}
			}
		}

		return {winner: winner, loser: loser};
	}



	




}); // End of jQuery
