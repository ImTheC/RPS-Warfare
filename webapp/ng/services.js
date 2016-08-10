(function(){

  'use strict';

  angular

    .module('rpsApp')

    .service('getUsersService',['$scope','$http','$firebaseObject',
                        function($scope, $http, $firebaseObject){



    }])

    .service('authService',['$firebaseAuth',function($firebaseAuth){

      return $firebaseAuth();

    }])

    .service("addUserService", ["$firebaseObject",
      function($firebaseObject) {
        return function(uid) {
          // create a reference to the database node where we will store our data
          var ref = firebase.database().ref("users").push();
          var uidRef = ref.child(uid);

          // return it as a synchronized object
          return $firebaseObject(uidRef);
        }
      }
    ])

    .service('newGameService',['$http','$firebaseObject',function($http,$firebaseObject){



    }])

    .service('setupGameService',['$http','$firebaseObject',function($http,$firebaseObject){



    }])

    .service('getGameService',['$http','$firebaseObject',function($http,$firebaseObject){



    }]);

})();
