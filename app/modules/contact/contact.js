'use strict';

angular.module('myApp.contact', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/contact', {
            templateUrl: 'modules/contact/contact.html',
            controller: 'ContactCtrl',
            data : {
                authenticate: true
            }
        });
    }])

    .controller('ContactCtrl', [function() {

}]);