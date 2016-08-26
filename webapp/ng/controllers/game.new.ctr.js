

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
      };

      (function(){

        s.users = [];
        let ref = firebase.database().ref('users');

        s.users = $firebaseArray(ref);
        console.log(s.users);

        // ref.once('value',function(snap){
        //   s.users = snap.val();
        // });

      })();

      function addFriend(friendId){
        console.log(friendId);
      }

      function initGame(){
        console.log('click got me to initGame function');
        let pid1 = 'playa23';
        let pname1 = 'Chris Anderson';
        let pid2 = 'playa24';
        let pname2 = 'Chris Castro';
        getGameService.newGame(pid1,pname1,pid2,pname2);
        closeSidebar();
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
