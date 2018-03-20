"use strict";

angular.module('myApp').factory('AuthenticationService', function($http, APP_CONFIG){
    var dfd = $q.defer();
    var LOCAL_TOKEN_KEY = 'USER_DATA';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;

    var isLoggedIn = function() {
        var token = window.localStorage.getItem(LOCAL_TOKEN_KEY);
        console.log(token);
        if (token) {
            if(token.isAuthenticated)
            {
                console.log('here');
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    return {
        isLoggedIn: isLoggedIn
    }

});