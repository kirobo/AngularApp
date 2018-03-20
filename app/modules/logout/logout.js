'use strict';

var logout = angular.module('myApp.logout', ['ngRoute']);

logout.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/logout', {
        templateUrl: 'modules/login/logout.html',
        controller: 'LogoutCtrl'
    });
}]);


logout.controller('LogoutCtrl', [function($scope, APP_CONFIG) {
    console.log('On Logout Ctrl');
    var getLogout  = function () {
        window.location.href = appConfig.siteLoginURL;
    };
    getLogout();
}]);