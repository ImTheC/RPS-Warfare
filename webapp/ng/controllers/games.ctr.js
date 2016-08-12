

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('gamesCtr',
            ['$rootScope','$scope','$state','$http','$mdToast','$mdDialog','$firebaseObject','$firebaseArray','authService','addUserService','getUserService',
      function($rootScope, $scope, $state, $http, $mdToast, $mdDialog, $firebaseObject, $firebaseArray, authService, addUserService, getUserService){

      let t = this;
      let s = $scope;
      let rs = $rootScope;
      let st = $state;

      //initialized functions
      t.openSidebar = openSidebar;
      t.openRightSidebar = openRightSidebar;
      t.closeSidebar = closeSidebar;

      //initialized vars




      function openSidebar(){
        st.go('games.new');
      };

      function openRightSidebar(){
        st.go('games.login');
      };

      function closeSidebar(){
        $mdSidenav('left').close();
      };

      function showToast(message){

        $mdToast.show(
          $mdToast.simple()
            .content(message)
            .position('top, right')
            .hideDelay(3000)
        );

      };

      //CHECK AUTH STATUS AND MAKE USER AVAILABLE ON ROOT
      s.auth = authService;
      authService.$onAuthStateChanged(function(firebaseUser){

        let refUsers = firebase.database().ref().child("users");
        s.users = $firebaseArray(refUsers);
        s.users.$loaded()
          .then(function() {
            rs.loggedIn = s.users.$getRecord(firebaseUser.uid);
            Object.keys(rs.loggedIn)
              .forEach(function(key,index) {
                if (key.charAt(0) === '-'){
                  rs.loggedInUsersKey = key;
                  rs.loggedInUser = rs.loggedIn[key];
                  rs.$broadcast('loggedInUserBroadcast',rs.loggedInUser);
                };
            });
          });

      });








    }]);

})();
