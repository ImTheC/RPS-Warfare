/*jshint esversion: 6 */

(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

let gamelogic = require("./gamelogic.js");

$(function(){
	"use strict";

	$('#play').on("click", function(){
		let p1result = gamelogic.randomRPS();
		let p2result = gamelogic.randomRPS();
		$('#p1result').text( p1result );
		$('#p2result').text( p2result );
		let attacker = ["hex19", {"owner": "player1", "type": p1result, "health": 1}];
		let defender = ["hex26", {"owner": "player2", "type": p2result, "health": 1}];
		let outcome = gamelogic.outcome(attacker, defender);
		let winner = outcome.winner[1].owner;
		$('#winner').text( winner );
	});

}); // End of jQuery

},{"./gamelogic.js":2}],2:[function(require,module,exports){
"use strict";

let playerList = [];


let gamelogic = {

	randomRPS: function() {
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
	},

	checkGameState: function () {
		var mode = gamelogic.gameState.gameStatus.mode;
		var ap = gamelogic.gameState.gameStatus.AP;

		// SETUP mode
		if ( mode === "setup" ) {
			// open reserve menu
			// allow placements
		}

		// SWAP mode
		if ( mode === "swap" ) {
			// open reserve menu
			// allow 1 swap
		}
	},

	loadBoard: function (gameState) {
		// loop through gameState.players, add playerX.name to playersList
		// loop through gameState.grid, display visual representations
		// if gameState.gameStatus.currentPlayer === null,
		//	then gameState.gameStatus.currentPlayer = playersList[0];
	},

	validMove: function ( selectedCor, actionCor ) {
			if ( gamelogic.validMoves[selectedCor][actionCor] ) {
				return true;
			} else {
				return false;
			}
	},

	findNextPlayer: function(){
		var currentPlayerNum = gamelogic.gameState.gameStatus.currentPlayer.split("player")[1];
		var nextPlayer = "player" + (parseInt(currentPlayerNum) + 1);

		if ( gamelogic.gameState.players[nextPlayer] )
			return nextPlayer;
		else {
			return "player1";
		}
	},

	passTurn: function ( passTo ) {
		gamelogic.gameState.gameStatus.currentPlayer = passTo;
	},

	endTurn: function () {
		gamelogic.gameState.gameStatus.AP = 2;
		gamelogic.passTurn( gamelogic.findNextPlayer() );
	},

	useAP: function ( ) {
		if ( gamelogic.gameState.gameStatus.AP > 1 ) {
			gamelogic.gameState.gameStatus.AP -= 1;
		} else {
			gamelogic.gameState.gameStatus.AP -= 1;
			gamelogic.endTurn();
		}
	},

	move: function ( objectFromSelectedCor, moveFrom, moveTo ) {
		gamelogic.gameState.grid[moveTo] = objectFromSelectedCor;
		gamelogic.gameState.grid[moveFrom] = gamelogic.emptyBoardObject;
		gamelogic.useAP();
	},

	outcome: function( attacker, defender ){
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
	},

	loser: function( loserCor, loser ) {
		loser.health -= 1;
		if ( loser.health === 0 ) {
			gamelogic.gameState.grid[loserCor] = gamelogic.emptyBoardObject;
			return true;
		}
		return false;
	},

	initSwapOut: function( currentPlayer, opponent ) {
		gamelogic.gameState.gameStatus.swaps.players.first = currentPlayer;
		gamelogic.gameState.gameStatus.swaps.players.second = opponent;
		gamelogic.gameState.gameStatus.swaps.numberOf = 0;
		gamelogic.checkGameState();
	},

	battle: function( selectedCor, objectFromSelectedCor, actionCor, objectFromActionCor ) {
		var attacker = [selectedCor, objectFromSelectedCor];
		var defender = [actionCor, objectFromActionCor];

		var outcome = gamelogic.outcome( attacker, defender);
		var winner = outcome.winner;
		var loser = outcome.loser;

		if ( winner === loser ) {
			gamelogic.initSwapOut(objectFromSelectedCor.owner, objectFromActionCor.owner);
		} else {
			var died = gamelogic.loser(loser[0], loser[1]); // loser(loserCor, loserObj)
			if ( winner === attacker && died ) {
				gamelogic.move( winner[1], winner[0], loser[0] ); // move (winnerObj, winnerCor, loserCor)
			} else {
				gamelogic.useAP();
			}
		}
		gamelogic.checkGameState();
	},

	resolveMove: function ( selectedCor, objectFromSelectedCor, actionCor, objectFromActionCor ) {
		if ( gamelogic.validMove( selectedCor, actionCor) ) {
			if ( objectFromActionCor.owner === null ) {
				gamelogic.move(objectFromSelectedCor, selectedCor, actionCor);
			} else {
			 gamelogic.battle(selectedCor, objectFromSelectedCor, actionCor, objectFromActionCor);
			}
		}
	},

	placeCharacter: function() {
		// NEED TO DO!!
		return;
	},

	returnTrue: function() {
			return true;
		},

	emptyBoardObject: { "owner": null, "type": null, "health": null },

	validMoves: {
			"hex1": {
							 "blocked": true
							},
			"hex2": {
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
							 "hex9": true,
						 },
			"hex5": {
							 "hex10": true,
							 "hex11": true,
							 "hex6": true,
						 },
			"hex6": {
							 "hex2": true,
							 "hex5": true,
							 "hex7": true,
							 "hex11": true,
							 "hex12": true
						 },
			"hex7": {
							 "hex2": true,
							 "hex3": true,
							 "hex6": true,
							 "hex8": true,
							 "hex12": true,
							 "hex13": true
						 },
			"hex8": {
							 "hex3": true,
							 "hex4": true,
							 "hex7": true,
							 "hex9": true,
							 "hex13": true,
							 "hex14": true
						 },
			"hex9": {
							 "hex4": true,
							 "hex8": true,
							 "hex14": true,
							 "hex15": true
						 },
			"hex10": {
							 "hex5": true,
							 "hex6": true,
							 "hex11": true,
							 "hex16": true,
							 "hex17": true,
						 },
			"hex11": {
							 "hex5": true,
							 "hex6": true,
							 "hex10": true,
							 "hex12": true,
							 "hex17": true,
							 "hex18": true
						 },
			"hex12": {
							 "hex6": true,
							 "hex7": true,
							 "hex11": true,
							 "hex13": true,
							 "hex18": true,
							 "hex19": true
						 },
			"hex13": {
							 "hex7": true,
							 "hex8": true,
							 "hex12": true,
							 "hex14": true,
							 "hex19": true,
							 "hex20": true
						 },
			"hex14": {
							 "hex8": true,
							 "hex9": true,
							 "hex13": true,
							 "hex15": true,
							 "hex20": true,
							 "hex21": true
						 },
			"hex15": {
							 "hex9": true,
							 "hex14": true,
							 "hex21": true,
							 "hex22": true
						 },
			"hex16":{
							 "hex10": true,
							 "hex17": true,
							 "hex23": true
						 },
			"hex17":{
							 "hex10": true,
							 "hex11": true,
							 "hex16": true,
							 "hex18": true,
							 "hex23": true,
							 "hex24": true
						 },
			"hex18":{
							 "hex11": true,
							 "hex12": true,
							 "hex17": true,
							 "hex19": true,
							 "hex24": true,
							 "hex25": true
						 },
			"hex19":{
							 "hex12": true,
							 "hex13": true,
							 "hex18": true,
							 "hex20": true,
							 "hex25": true,
							 "hex26": true
						 },
			"hex20":{
							 "hex13": true,
							 "hex14": true,
							 "hex19": true,
							 "hex21": true,
							 "hex26": true,
							 "hex27": true
						 },
			"hex21":{
							 "hex14": true,
							 "hex15": true,
							 "hex20": true,
							 "hex22": true,
							 "hex27": true,
							 "hex28": true
						 },
			"hex22":{
							 "hex15": true,
							 "hex21": true,
							 "hex28": true
						 },
			"hex23":{
							 "hex16": true,
							 "hex17": true,
							 "hex24": true,
							 "hex29": true
						 },
			"hex24":{
							 "hex17": true,
							 "hex18": true,
							 "hex23": true,
							 "hex25": true,
							 "hex29": true,
							 "hex30": true
						 },
			"hex25":{
							 "hex18": true,
							 "hex19": true,
							 "hex24": true,
							 "hex26": true,
							 "hex30": true,
							 "hex31": true
						 },
			"hex26":{
							 "hex19": true,
							 "hex20": true,
							 "hex25": true,
							 "hex27": true,
							 "hex31": true,
							 "hex32": true
						 },
			"hex27":{
							 "hex20": true,
							 "hex21": true,
							 "hex26": true,
							 "hex28": true,
							 "hex32": true,
							 "hex33": true
						 },
			"hex28":{
							 "hex21": true,
							 "hex22": true,
							 "hex27": true,
							 "hex33": true
						 },
			"hex29":{
							 "hex23": true,
							 "hex24": true,
							 "hex30": true,
							 "hex34": true
						 },
			"hex30":{
							 "hex24": true,
							 "hex25": true,
							 "hex29": true,
							 "hex31": true,
							 "hex34": true,
							 "hex35": true
						 },
			"hex31":{
							 "hex25": true,
							 "hex26": true,
							 "hex30": true,
							 "hex32": true,
							 "hex35": true,
							 "hex36": true
						 },
			"hex32":{
							 "hex26": true,
							 "hex27": true,
							 "hex31": true,
							 "hex33": true,
							 "hex36": true
						 },
			"hex33":{
							 "hex27": true,
							 "hex28": true,
							 "hex32": true
						 },
			"hex34":{
							 "hex29": true,
							 "hex30": true,
							 "hex35": true
						 },
			"hex35":{
							 "hex34": true,
							 "hex30": true,
							 "hex31": true,
							 "hex36": true
						 },
			"hex36":{
							 "hex31": true,
							 "hex32": true,
							 "hex35": true
						 },
			"hex37":{
							 "blocked": true
						 }
			},

			gameState: {
						"players": {
							"player1": {
								"name": "p1",
								"reserve": {
									"unit1": "Rock",
									"unit2": "Rock",
									"unit3": "Paper",
									"unit4": "Paper",
									"unit5": "Scissors",
									"unit6": "Scissors"
								}
							},
							"player2": {
								"name": "p2",
								"reserve": {
									"unit1": "Rock",
									"unit2": "Rock",
									"unit3": "Paper",
									"unit4": "Paper",
									"unit5": "Scissors",
									"unit6": "Scissors"
								}
							}
						},
						"gameStatus": {
							"currentPlayer": "player1",
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
										 "owner": "blocked"
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
										 "owner": "blocked"
									 }
							} // end of grid:
			}
}; // END OF const gamelogic =


module.exports = gamelogic;

},{}]},{},[1]);
