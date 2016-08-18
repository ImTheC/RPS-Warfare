

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('usersCtr',
            ['$scope','$state','$http','$mdToast','$mdDialog','$firebaseObject','$firebaseArray','authService','addUserService','addUserMapService',
      function($scope, $state, $http, $mdToast, $mdDialog, $firebaseObject, $firebaseArray, authService, addUserService, addUserMapService){

      let t = this;
      let s = $scope;
      let st = $state;

      //initialize functions
      s.signInWithEmail = signInWithEmail;
      s.facebookSignin = facebookSignin;

      //vars
      s.users = {};
      s.email;
      s.password;

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

            s.firebaseUser.providerData[0].dateCreated = firebase.database.ServerValue.TIMESTAMP;

            s.firebaseUser.providerData[0].inGames = [''];

            if (s.firebaseUser !== null && s.firebaseUser.providerData[0].providerId === 'password'){

              let uid = s.firebaseUser.uid;

              let providerData = s.firebaseUser.providerData[0];

              addUserService.toUserObj(uid).$add(providerData)
              .then(function(ref) {
                // let id = ref.key();
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


      // function facebookSignin(){
      //
      //   let provider = new firebase.auth.FacebookAuthProvider();
      //
      //   firebase.auth().signInWithPopup(provider)
      //
      //     .then(function(result) {
      //       let token = result.credential.accessToken;
      //       console.log(token);
      //       s.firebaseUser = result.user;
      //       console.log(s.firebaseUser);
      //     })
      //     .catch(function(error) {
      //       console.log(error);
      //     });
      //
      // }

      function facebookSignin(){
        authService.$signInWithPopup("facebook")
        .then(function(result) {
          let userURL = `https://rps-warfare.firebaseio.com/usermap/${result.user.uid}.json`;
          $http({
            method: 'GET',
            url: userURL
          })
          .then(function(data){
            console.log('http get data request: ',data.data);
            if (data.data === null){
                  console.log('data was null, therefore saving new record to DB');
                  let newUserObj = result.user.providerData[0];
                  newUserObj.dateCreated = firebase.database.ServerValue.TIMESTAMP;
                  newUserObj.score = 0;
                  newUserObj.inGames = [''];
                  newUserObj.aid = result.user.uid;
                  newUserObj.token = result.credential.accessToken;

                  addUserService.addToDb('users').$add(newUserObj)
                  .then(function(ref) {
                    s.firebaseUser = newUserObj;
                    console.log('this was saved to firebaseUser and to scope: ',newUserObj);
                    let value = ref.key;
                    let key = newUserObj.aid;
                    addUserMapService.addToDb(key).$add(value)
                      .then(function(ref){
                        console.log('record added to usermap');
                      },function(error){
                        console.log(error);
                      });
                  }, function(error) {
                    console.log("Oops, the following went wrong: ", error);
                  });
            } else {
              console.log('data exists already, therefore no new record being created');
              return;
            }
          });
        })
        .catch(function(error) {
          console.error("Authentication failed: ", error);
        });
      }



      //SOCIAL SIGNUPS
      // s.auth = authService;
      // authService.$onAuthStateChanged(function(firebaseUser){
      //   s.tempUser = firebaseUser;
      //
      //   if (s.tempUser && s.tempUser.providerData[0].providerId === 'password'){
      //     Object.defineProperties(s.tempUser.providerData[0],{
      //       displayName: { writable:true },
      //       email: { writable:true }
      //     });
      //
      //     s.tempUser.providerData[0].displayName = s.tempUser.providerData[0].email.replace(/@.*/, '');
      //
      //   }
      //
      //   if (s.tempUser){
      //
      //     if (s.tempUser.providerData[0].providerId !== "password"){
      //
      //       s.tempUser.providerData[0].score = 0;
      //
      //       s.tempUser.providerData[0].dateCreated = firebase.database.ServerValue.TIMESTAMP;
      //
      //       s.tempUser.providerData[0].inGames = [''];
      //
      //       let uid = s.tempUser.uid;
      //
      //       let providerData = s.tempUser.providerData[0];
      //
      //       addUserService.toUserObj(uid).$add(providerData)
      //       .then(function(ref) {
      //         console.log('Social Signup Saved');
      //       }, function(error) {
      //         console.log("Oops, the following went wrong: ", error);
      //       });
      //
      //     }
      //   } else {
      //     console.log('is logged out');
      //   }
      //
      // });

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
