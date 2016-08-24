

(function(){
'use strict';

  angular
    .module('rpsApp')
    .controller('usersCtr',
            ['$scope','$state','$http','$mdToast','$mdDialog','$firebaseObject','$firebaseArray','$timeout','authService','addUserService','addUserMapService',
      function($scope, $state, $http, $mdToast, $mdDialog, $firebaseObject, $firebaseArray, $timeout, authService, addUserService, addUserMapService){

      let t = this;
      let s = $scope;
      let st = $state;

      //initialize functions
      s.signInWithEmail = signInWithEmail;
      s.facebookSignin = facebookSignin;
      s.resetLoginInputs = resetLoginInputs;

      //vars
      s.users = {};
      s.email;
      s.password;
      s.auth = authService;

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
                    firebase.database().ref('usermap/').update(newUserMapObj);
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
                    firebase.database().ref('usermap/').update(newUserMapObj);
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
      }



      //Logged In
      s.auth.$onAuthStateChanged(function(firebaseUser){

        resetLoginInputs();

        if (firebaseUser){


          let ref = firebase.database();
          let usersRef = ref.ref('users');
          usersRef.orderByChild('aid').equalTo(firebaseUser.uid).on('child_added', function(snap){
            $timeout(function(){
              s.firebaseUser = snap.val();
              console.log(s.firebaseUser);
            });
          });

        } else {
          s.firebaseUser = null;
        }

      });

      // function signInWithEmail(email,password){
      //   authService.$signInWithEmailAndPassword(email,password)
      //   .then(function(firebaseUser) {
      //     let userURL = `https://rps-warfare.firebaseio.com/usermap/${firebaseUser.uid}.json`;
      //     $http({
      //       method: 'GET',
      //       url: userURL
      //     })
      //       .then(function(data){
      //         let ref = data.data;
      //         let clonedUsersURL = `https://rps-warfare.firebaseio.com/users/${ref}.json`;
      //           $http({
      //             method: 'GET',
      //             url: clonedUsersURL
      //           })
      //             .then(function(data){
      //               s.firebaseUser = data.data;
      //               console.log(s.firebaseUser);
      //             },function(error){ console.log(error); })
      //       },function(error){ console.log('error message: ', error)});
      //
      //   })
      //   .catch(function(error) {
      //       console.error("Oops, looks like we couldn't log you in for the following reason: ", error);
      //     });
      // }

      function signInWithEmail(email,password){
        authService.$signInWithEmailAndPassword(email,password)
        .then(function(firebaseUser) {

          //do something

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
