

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('loginCtr',
            ['$rootScope','$scope','$state','$http','$mdSidenav','$timeout','$mdToast','$mdDialog','$firebaseObject','$firebaseArray','authService','addUserService',
      function($rootScope, $scope, $state, $http, $mdSidenav, $timeout, $mdToast, $mdDialog, $firebaseObject, $firebaseArray, authService, addUserService){

      let t = this;
      let rs = $rootScope;
      let s = $scope;
      let st = $state;

      //initialize functions
      t.closeRightSidebar = closeRightSidebar;
      s.resetLoginInputs = resetLoginInputs;
      s.signInWithEmail = signInWithEmail;
      s.facebookSignin = facebookSignin;

      //initialize vars
      // s.users = {};
      s.email;
      s.password;
      t.rightSidenavOpen;

      //START NAV CONTROLS
      $timeout(function(){
        $mdSidenav('right').open();
        t.rightSidenavOpen = true;
      });

      function closeRightSidebar(){
        t.rightSidenavOpen = false;
        $timeout(function(){
          st.go('games');
        },250);
      };//END NAV CONTROLS

      function resetLoginInputs(){
        s.email = '';
        s.password = '';
      }

      //EMAIL SIGNUPS
      s.createUser = function() {
        s.message = null;
        s.error = null;
        authService.$createUserWithEmailAndPassword(s.email,s.password)

        .then(function(firebaseUser) {
          let userURL = `https://rps-warfare.firebaseio.com/usermap/${firebaseUser.uid}.json`;
          $http({
            method: 'GET',
            url: userURL
          })
          .then(function(data){
            if (data.data === null){
                  console.log('Safe to add new user.');
                  let newUserObj = firebaseUser.providerData[0];

                  Object.defineProperties(newUserObj,{
                    displayName: { writable:true },
                    email: { writable:true },
                    photoURL: { writable:true }
                  });
                  newUserObj.displayName = newUserObj.email.replace(/@.*/, '');
                  newUserObj.photoURL = 'assets/images/no-photo.gif';

                  newUserObj.dateCreated = firebase.database.ServerValue.TIMESTAMP;
                  newUserObj.score = 0;
                  newUserObj.inGames = [''];
                  newUserObj.aid = firebaseUser.uid;
                  newUserObj.emailVerified = firebaseUser.emailVerified;
                  s.aid = newUserObj.aid;
                  // newUserObj.token = firebaseUser.refreshToken;

                  addUserService.addToDb('users').$add(newUserObj)
                  .then(function(ref) {
                    s.newUserObjKey = ref.key;
                    let value = ref.key;
                    let key = newUserObj.aid;
                    let newUserMapObj = {};
                    newUserMapObj[key] = value;
                    firebase.database().ref('usermap/').update(newUserMapObj)
                      .then(function(){
                        console.log('newUserMapObj saved');
                      },function(error){ console.log(error); });
                  }, function(error) {
                    console.log("Oops, new user was not added. Error: ",error);
                  });
            } else {
              console.log('Account already exists.');
              return;
            }
          });
        })
        .catch(function(error) {
          console.error("Failed to login. Error: ",error);
        });

      };

      //SOCIAL SIGNUP
      function facebookSignin(){
        authService.$signInWithPopup("facebook")
        .then(function(result) {
          let userURL = `https://rps-warfare.firebaseio.com/usermap/${result.user.uid}.json`;
          $http({
            method: 'GET',
            url: userURL
          })
          .then(function(data){
            if (data.data === null){
                  console.log('Safe to add new user.');
                  let newUserObj = result.user.providerData[0];
                  newUserObj.dateCreated = firebase.database.ServerValue.TIMESTAMP;
                  newUserObj.score = 0;
                  newUserObj.inGames = [''];
                  newUserObj.aid = result.user.uid;
                  newUserObj.emailVerified = result.user.emailVerified;
                  s.aid = newUserObj.aid;
                  // newUserObj.token = result.credential.accessToken;

                  addUserService.addToDb('users').$add(newUserObj)
                  .then(function(ref) {
                    s.newUserObjKey = ref.key;
                    let value = ref.key;
                    let key = newUserObj.aid;
                    let newUserMapObj = {};
                    newUserMapObj[key] = value;
                    firebase.database().ref('usermap/').update(newUserMapObj)
                      .then(function(){
                        console.log('newUserMapObj saved');
                      },function(error){ console.log(error); });
                  }, function(error) {
                    console.log("Oops, new user was not added. Error: ",error);
                  });
            } else {
              console.log('Account already exists.');
              return;
            }
          });
        })
        .catch(function(error) {
          console.error("Failed to log you in. Error: ",error);
        });
      }

      function signInWithEmail(email,password){
        authService.$signInWithEmailAndPassword(email,password)
        .then(function(firebaseUser) {
          console.log('Signed in with email/password.');
        })
        .catch(function(error) {
            console.error("Failed to log you in. Error: ",error);
          });
      }

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
