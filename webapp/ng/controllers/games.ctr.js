/*jshint esversion: 6 */

(function(){
'use strict';

  angular
    .module('rpsApp')

    .controller('gamesCtr',
            ['$rootScope','$scope','$state','$http','$timeout','$mdToast','$mdDialog','$mdSidenav','$firebaseObject','$firebaseArray','authService','addUserService','getUserService',
      function($rootScope, $scope, $state, $http, $timeout, $mdToast, $mdDialog, $mdSidenav, $firebaseObject, $firebaseArray, authService, addUserService, getUserService){

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
              closeRightSidebar();
              rs.userKey = snap.key;
              console.log(rs.userKey);
              console.log(rs.firebaseUser);
            });
          });

        } else {
          rs.firebaseUser = null;
          rs.userKey = null;
        }

      });

      //initialized lets

}]);

})();
