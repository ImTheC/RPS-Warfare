(function(){

  'use strict';

  angular

    .module('rpsApp')

    .service('authService',['$firebaseAuth',function($firebaseAuth){

      return $firebaseAuth();

    }])

    .service("addUserService", ["$firebaseArray",
      function($firebaseArray) {

        this.toUserObj = function(uid){
          let ref = firebase.database().ref().child("users").child(uid);
          return $firebaseArray(ref);
        }

      }
    ])

    .service('getUserService',['$firebaseArray',function($firebaseArray){

      this.fromUserObj = function(recordId){

        let ref = firebase.database().ref().child("users");
        return $firebaseArray(ref).$getRecord(recordId);

      }

    }])

    .service("getGameService", ["$rootScope",'$firebaseArray',
      function($rootScope,$firebaseArray) {

        this.newGame = function(pid1,pname1,pid2,pname2){

            

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
        }












      }
    ]);

})();
