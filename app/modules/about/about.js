'use strict';

angular.module('myApp.about', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/about', {
            templateUrl: 'modules/about/about.html',
            controller: 'AboutCtrl',
            data : {
                authenticate: true
            }
        });
    }])

    .controller('AboutCtrl', [function() {

    }]);