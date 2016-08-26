

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('newGameCtr',
            ['$rootScope','$scope','$state','$mdSidenav','$timeout','$mdDialog','$mdToast','getGameService',
      function($rootScope, $scope, $state, $mdSidenav, $timeout, $mdDialog, $mdToast, getGameService){

      let t = this;
      let s = $scope;
      let rs = $rootScope;
      let st = $state;

      //initialize functions
      t.closeSidebar = closeSidebar;
      t.createNewGame = createNewGame;
      t.initGame = initGame;

      //initialize vars
      t.sidenavOpen;
      rs.games;


      $timeout(function(){
        $mdSidenav('left').open();
        t.sidenavOpen = true;
      });

      s.$watch('t.sidenavOpen',function(sidenav){
        if(sidenav === false){
          $mdSidenav('left')
            .close()
            .then(function(){
              st.go('games');
            });
        }
      });

      function closeSidebar(){
        $mdSidenav('left').close();
        st.go('games');
        t.sidenavOpen = false;
      };

      function createNewGame(games){
        closeSidebar();
      };

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
