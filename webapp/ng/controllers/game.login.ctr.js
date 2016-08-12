

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('loginCtr',
            ['$scope','$state','$mdSidenav','$timeout','$mdToast','$mdDialog','$firebaseObject','$firebaseArray','authService','addUserService',
      function($scope, $state, $mdSidenav, $timeout, $mdToast, $mdDialog, $firebaseObject, $firebaseArray, authService, addUserService){

      let t = this;
      let s = $scope;
      let st = $state;

      //initialize functions
      s.signInWithEmail = signInWithEmail;
      t.closeRightSidebar = closeRightSidebar;

      //initialize vars
      s.users = {};
      s.email;
      s.password;
      t.rightSidenavOpen;

      //START NAV CONTROLS
      $timeout(function(){
        $mdSidenav('right').open();
        t.rightSidenavOpen = true;
      });

      s.$watch('t.rightSidenavOpen',function(sidenav){
        if(sidenav === false){
          $mdSidenav('right')
            .close()
            .then(function(){
              st.go('games');
            });
        }
      });

      function closeRightSidebar(){
        $mdSidenav('right').close();
        st.go('games');
        t.rightSidenavOpen = false;
      };//END NAV CONTROLS

      //EMAIL SIGNUPS
      s.createUser = function() {
        s.message = null;
        s.error = null;
        authService.$createUserWithEmailAndPassword(s.email,s.password)
          .then(function(firebaseUser) {

            s.firebaseUser = firebaseUser;

            Object.defineProperties(s.firebaseUser.providerData[0],{
              displayName: { writable:true },
              email: { writable:true },
              photoURL: { writable:true }
            });

            s.firebaseUser.providerData[0].displayName;
            $scope.$watch('firebaseUser.providerData[0].displayName', function(){
                if (s.firebaseUser){
                  s.firebaseUser.providerData[0].displayName = s.firebaseUser.providerData[0].email.replace(/@.*/, '');
                }
              }
            );
            s.firebaseUser.providerData[0].displayName = s.firebaseUser.providerData[0].email.replace(/@.*/, '');

            s.firebaseUser.providerData[0].photoURL = 'assets/images/no-photo.gif';

            s.firebaseUser.providerData[0].score = 0;

            if (s.firebaseUser !== null && s.firebaseUser.providerData[0].providerId === 'password'){

              var uid = s.firebaseUser.uid;

              s.users[uid] = s.firebaseUser.providerData[0];

              addUserService.$add(s.users[uid])
              .then(function(ref) {
                var globalizeUser = s.firebaseUser;
                s.$emit('firebaseUser', globalizeUser);
                closeRightSidebar();
                console.log('Email Signup Saved');
              }, function(error) {
                console.log("Oops, the following went wrong: ", error);
              });

            } else {
              console.log('is logged out');
            }


          })
          .catch(function(error) {
            s.error = error;
          });
      };

      //SOCIAL SIGNUPS
      s.auth = authService;
      authService.$onAuthStateChanged(function(firebaseUser){
        s.firebaseUser = firebaseUser;

        if (s.firebaseUser && s.firebaseUser.providerData[0].providerId === 'password'){
          Object.defineProperties(s.firebaseUser.providerData[0],{
            displayName: { writable:true },
            email: { writable:true }
          });

          s.firebaseUser.providerData[0].displayName;
          $scope.$watch('firebaseUser.providerData[0].displayName', function(){
              if (s.firebaseUser){
                s.firebaseUser.providerData[0].displayName = s.firebaseUser.providerData[0].email.replace(/@.*/, '');
              }
            }
          );
        }

        if (s.firebaseUser){

          if (s.firebaseUser.providerData[0].providerId !== "password"){

            var uid = s.firebaseUser.uid;

            s.firebaseUser.providerData[0].score = 0;

            s.users[uid] = s.firebaseUser.providerData[0];

            addUserService.$add(s.users[uid])
            .then(function(ref) {
              // closeRightSidebar();
              console.log('Social Signup Saved');
            }, function(error) {
              console.log("Oops, the following went wrong: ", error);
            });

          }
        } else {
          console.log('is logged out');
        }

      });

      function signInWithEmail(email,password){
        authService.$signInWithEmailAndPassword(email,password)
        .then(function(firebaseUser) {

          s.firebaseUser = firebaseUser;

          Object.defineProperties(s.firebaseUser.providerData[0],{
            displayName: { writable:true },
            email: { writable:true }
          });

          s.firebaseUser.providerData[0].displayName;
          $scope.$watch('firebaseUser.providerData[0].displayName', function(){
              if (s.firebaseUser){
                s.firebaseUser.providerData[0].displayName = s.firebaseUser.providerData[0].email.replace(/@.*/, '');
              }
            }
          );
          s.firebaseUser.providerData[0].displayName = s.firebaseUser.providerData[0].email.replace(/@.*/, '');
        })
        .catch(function(error) {
            console.error("Oops, looks like we couldn't log you in for the following reason: ", error);
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
