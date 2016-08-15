

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
            rs.otherUsers = [];
            rs.allUsers = s.users;
            rs.loggedIn = s.users.$getRecord(firebaseUser.uid);
            console.log(rs.loggedIn);
            Object.keys(rs.loggedIn)
              .forEach(function(key,index) {
                if (key.charAt(0) === '-'){
                  rs.loggedInUsersKey = key;
                  rs.loggedInUser = rs.loggedIn[key];
                  rs.$broadcast('loggedInUserBroadcast',rs.loggedInUser);
                };
            });

            rs.otherUsers = [
    {
      "dateCreated": 1471013338654,
      "displayName": "starwars12",
      "email": "starwars12@gmail.com",
      "photoURL": "https://randomuser.me/api/portraits/women/2.jpg",
      "providerId": "password",
      "score": 0,
      "uid": "starwars12@gmail.com",
      "$id": "HprxNgCtxxfCH2CbauMiFOVwTDG3"
    },
    {
      "dateCreated": 1470979925811,
      "displayName": "starwars11",
      "email": "starwars11@gmail.com",
      "photoURL": "https://randomuser.me/api/portraits/men/2.jpg",
      "providerId": "password",
      "score": 0,
      "uid": "starwars11@gmail.com",
      "$id": "IZx1hqEXPKVmBo5DdnUGD9606AH3"
    },
    {
      "dateCreated": 1471013516621,
      "displayName": "starwars13",
      "email": "starwars13@gmail.com",
      "inGames": [
        ""
      ],
      "photoURL": "https://randomuser.me/api/portraits/women/20.jpg",
      "providerId": "password",
      "score": 0,
      "uid": "starwars13@gmail.com",
      "$id": "M7GahT8K8let4baOfx7ddvW0Iya2"
    }
  ];

            // console.log('rs other users',rs.otherUsers);
          });

      });








    }]);

})();
