'use strict';

// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
  'ngRoute',
  'myApp.version',
  'myApp.home',
  'myApp.detail',
  'myApp.about',
  'myApp.contact',
  'myApp.login',
  'ui.router',
  'myApp.logout',
  'bsLoadingOverlay',
  'bsLoadingOverlaySpinJs'

]).
config(['$locationProvider', '$routeProvider', '$stateProvider', function($locationProvider, $routeProvider, $stateProvider) {
  $locationProvider.hashPrefix('!');
  $routeProvider.otherwise({redirectTo: '/login'});

}]);

app.directive('appFooter', function(){

    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/modules/directives/footer/footer.tpl.html',
        link: function(scope, element){

            // User.initialized.then(function(){
            //     scope.user = User
            // });
        }
    }
});
app.directive('mobileHeader', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/modules/directives/header/header.tpl.html',
        link: function(scope, element){

            // User.initialized.then(function(){
            //     scope.user = User
            // });
        }
    }
});
app.directive('webHeader', function(){
    return {
        restrict: 'A',
        replace: true,
        templateUrl: 'app/modules/directives/web-header/header.tpl.html',
        link: function(scope, element){

            // User.initialized.then(function(){
            //     scope.user = User
            // });
        }
    }
});

app.directive('languageSelector', function(Language){
    return {
        restrict: "EA",
        replace: true,
        templateUrl: "app/modules/directives/language-selector/languageSelector.tpl.html",
        scope: true
    }
});
app.constant('APP_CONFIG', window.appConfig);
/*
app.run(['$rootScope', '$state', '$stateParams', 'APP_CONFIG', 'DeviceDetector' '$location', 'AuthenticationService', function ($rootScope, $state, $stateParams, APP_CONFIG, DeviceDetector, $location, AuthenticationService) {
    $rootScope.$on('$routeChangeStart', function (event) {

        if (!AuthenticationService.isLoggedIn()) {
            console.log('DENY');
            event.preventDefault();
            $location.path('/login');
        }
        else {
            console.log('ALLOW');
            $location.path('/home');
        }
    });
}]);

*/

app.run(function ($rootScope , $state, $stateParams, APP_CONFIG, DeviceDetector, bsLoadingOverlayService) {


    /*
    $rootScope.$on('$routeChangeStart', function(event, next, current) {
        console.log('Now checking the login route');
        console.log(next.data);
        if(next.data)
        {
            if(next.data.authenticate && AuthenticationService.isLoggedIn())
            {

            }
            else {
                $state.go("login");
                event.preventDefault();
            }
        } else {
            $state.go("login");
            event.preventDefault();
        }

    });
    */

    /*
    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams, AuthenticationService){
        console.log('state changing da');
        if (toState.authenticate && AuthenticationService.isLoggedIn()){
            // User isn’t authenticated
            $state.go("login");
            event.preventDefault();
        }
    });
    */

    DeviceDetector.init({desktop: 'desktop', mobile: 'mobile'});
    $rootScope.isMobileDevice = DeviceDetector.isMobile();
    $rootScope.imageURL = APP_CONFIG.siteURL;

    $rootScope.$state = $state;
    $rootScope.$stateParams = $stateParams;
    bsLoadingOverlayService.setGlobalConfig({
        delay: 100, // Minimal delay to hide loading overlay in ms.
        activeClass: 'grey-bg', // Class that is added to the element where bs-loading-overlay is applied when the overlay is active.
        templateUrl: 'bsLoadingOverlaySpinJs' // Template url for overlay element. If not specified - no overlay element is created.
        //templateOptions: undefined // Options that are passed to overlay template (specified by templateUrl option above).
    });
    // editableOptions.theme = 'bs3';

});



app.filter('searchImages', function() {

    // Create the return function and set the required parameter name to **input**
    return function(input) {

        var out = [];

        // Using the angular.forEach method, go through the array of data and perform the operation of figuring out if the language is statically or dynamically typed.
        angular.forEach(input, function(record) {

            if (record.filename === 'static') {
                out.push(record)
            }

        });

        return out;
    }

});
