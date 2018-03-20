'use strict';

var login = angular.module('myApp.login', ['ngRoute']);

login.config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'modules/login/login.html',
            controller: 'AuthCtrl',
        });
    }]);

login.controller('AuthCtrl', [function($scope, APP_CONFIG) {
        console.log('On Login Ctrl');
    window.location.href = appConfig.siteLoginURL;
}]);