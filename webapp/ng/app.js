

(function() {

  angular

    .module('rpsApp', ['ngMaterial','ngAnimate','ui.router','firebase'])

    .config(function($mdThemingProvider,$stateProvider){

      $mdThemingProvider
        .theme('default')
        .primaryPalette('teal')
        .accentPalette('orange');

      $stateProvider
        .state('users',{
          url: '/users',
          templateUrl: '/ng/views/users.tpl.html',
          controller: 'usersCtr as users'
        })
        .state('users.new',{
          url: '/new',
          templateUrl: '/ng/views/user.new.tpl.html',
          controller: 'newUserCtr as newuser'
        })
        .state('users.edit',{
          url: '/edit/:id',
          templateUrl: '/ng/views/user.edit.tpl.html',
          controller: 'editUserCtr as edituser',
          params: {
            user: null
          }
        })
        .state('games',{
          url: '/games',
          templateUrl: '/ng/views/games.tpl.html',
          controller: 'gamesCtr as games'
        })
        .state('games.new',{
          url: '/new',
          templateUrl: '/ng/views/game.new.tpl.html',
          controller: 'newGameCtr as newgame'
        })
        .state('games.login',{
          url: '/login',
          templateUrl: '/ng/views/game.login.tpl.html',
          controller: 'loginCtr as login'
        })
        .state('games.id',{
          url: '/:id',
          templateUrl: '/ng/views/games.tpl.html',
          controller: 'gameCtr as game',
          params: {
            user: null
          }
        });

    });

}());
