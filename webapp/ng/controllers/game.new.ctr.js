

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('newGameCtr',
            ['$rootScope','$scope','$state','$http','$mdSidenav','$timeout','$mdToast','$mdDialog','$firebaseObject','$firebaseArray','getGameService',
      function($rootScope, $scope, $state, $http, $mdSidenav, $timeout, $mdToast, $mdDialog, $firebaseObject, $firebaseArray, getGameService){

      let t = this;
      let rs = $rootScope;
      let s = $scope;
      let st = $state;

      //initialize functions
      t.closeSidebar = closeSidebar;
      t.createNewGame = createNewGame;
      t.initGame = initGame;
      t.addFriend = addFriend;
      t.getFriendsData = getFriendsData;

      //initialize vars
      t.sidenavOpen = true;
      rs.games;

      //START NAV CONTROLS
      $timeout(function(){
        $mdSidenav('left').open();
        t.sidenavOpen = true;
      });

      function closeSidebar(){
        t.sidenavOpen = false;
        $timeout(function(){
          st.go('games');
        },250);
      };//END NAV CONTROLS

      function createNewGame(games){
        closeSidebar();
      }

      //initialized displays
      (function(){
        let invitor = rs.userKey;
        s.friendsRef = firebase.database().ref('users/'+invitor+'/friends/');
        s.friendKeys = [];
        s.friendsRef.on('value', function(snap) { s.friendKeys = snap.val(); });
        s.friendList = getFriendsData(s.friendKeys);

        s.users = [];
        let ref = firebase.database().ref('users');
        s.users = $firebaseArray(ref);
        console.log(s.users);

        // ref.once('value',function(snap){
        //   s.users = snap.val();
        // });

      })();

      function getFriendsData(arr){
        let friendList = [];
          angular.forEach(arr,function(friendId){

            let ref = firebase.database().ref('users/'+friendId);
            ref.on('value', function(snap) {
              let snapObj = snap.val();
              snapObj.key = snap.key;
              friendList.push(snapObj);
              console.log(snapObj);
            });
          });
        return friendList;
      }

      function addFriend(invitee){
        s.friendKeys = $firebaseArray(s.friendsRef);
        let friends = s.friendKeys;
        friends.$add(invitee)
          .then(function(){
            s.friendsRef.on('value', function(snap) { s.friendKeys = snap.val(); });
            s.friendList = getFriendsData(s.friendKeys);
            console.log('friendList after friend added: ',s.friendList);
            s.match = '';
          },function(error){});
        console.log('invitee: ',invitee);
      }

      function initGame(friendKey){
        console.log('click got me to initGame function');
        console.log('invitee',friendKey);
        console.log('invitor',rs.userKey);
        let pid1 = rs.userKey;
        let pname1 = rs.firebaseUser.displayName;
        let pid2 = friendKey;
        let friendRef = firebase.database().ref().child('users/'+friendKey);
        friendRef.once('value')
        .then((snap) => {
        rs.p2 = snap.val();
        let pname2 = rs.p2.displayName;
        getGameService.newGame(pid1,pname1,pid2,pname2)
          .then(function(){
            console.log('game new ctr rs currentGameId: ',$rootScope.currentGameId);
            let ref = firebase.database().ref('games/'+$rootScope.currentGameId);
            console.log('game new ctr fb ref: ',ref);
            let gameState = $firebaseObject(ref);
            console.log('game new ctr gameState: ',gameState);
            gameState.$bindTo($rootScope,'gameState')
              .then(function(){
                console.log('do we have a 3-way data binded gameState??? ', $rootScope.gameState);
                st.go('games.id',{
                  id: $rootScope.currentGameId,
                  game: $rootScope.gameState
                });
              });
          });
        }, (e) => {console.log(e);});
        // closeSidebar();
      };

      function showToast(message){
        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top, right')
            .hideDelay(3000)
        );
      };

    }]);

})();
