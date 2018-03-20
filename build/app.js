'use strict';

var appConfig = window.appConfig || {};

appConfig.menu_speed = 200;
appConfig.backendURL = "http://localhost/gimages-backend";
appConfig.siteURL = "http://localhost/angular-seed/app/images/";
appConfig.siteLoginURL =  'http://localhost/gimages-backend/login';
appConfig.apiRootUrl = '../api';
appConfig.siteAPIURL = 'http://localhost/gimages-backend/api';
appConfig.siteUserImagesURL = 'http://imagesystem.bluapp.cloud/backend/images/profile-pictures/resized/';
appConfig.frontCSS = [
    'css'
];

window.appConfig = appConfig;


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


'use strict';

angular.module('myApp').factory('APIDataService', function ($http, $q, APP_CONFIG) {
    var dfd = $q.defer();
    var LOCAL_TOKEN_KEY = 'USER_DATA';
    var username = '';
    var isAuthenticated = false;
    var role = '';
    var authToken;


    var processForm = function (formData) {
        var def = $q.defer();
        $http({
            method: 'POST',
            url: APP_CONFIG.siteAPIURL + '/authentication/login',
            data: formData,  // pass in data as strings
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {

                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    dfd.resolve(UserModel);
                    // if successful, bind success message to message
                    UserModel.username = data.data.data.first_name + ' ' + data.data.data.last_name;
                    UserModel.picture = APP_CONFIG.siteUserImagesURL+data.data.data.avatar;
                    UserModel.data = data.data;
                    UserModel.data.isAuthenticated = true;
                    storeUserCredentials(UserModel);
                    def.resolve(UserModel);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;

    };


    var registerForm = function (formData) {
        var def = $q.defer();
        $http({
            method: 'POST',
            url: APP_CONFIG.siteAPIURL + '/authentication/register',
            data: formData,  // pass in data as strings
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {

                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };
    var getAllImages = function () {
        var def = $q.defer();
        $http({
            method: 'POST',
            url: APP_CONFIG.siteAPIURL + '/authentication/get-images',
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data.data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };

    var isUserLoggedIn = function () {
        var def = $q.defer();
        var token = JSON.parse(window.localStorage.getItem(LOCAL_TOKEN_KEY));
        if (token) {
            console.log(token);
            if(token.data.isAuthenticated === true)
            {
                def.resolve(token);
            } else {
                def.reject(token);
            }
        } else {
            def.reject(token);
        }
        return def.promise;
    };

    var downloadTIFF = function (checkedtiffpath) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: { checkedtiffpath: checkedtiffpath },
            url: APP_CONFIG.siteAPIURL + '/authentication/downtiffs',
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data);
                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data.data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };

    var downloadPreviews = function (checkedprevpath) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: { checkedprevpath: checkedprevpath },
            url: APP_CONFIG.siteAPIURL + '/authentication/downprevs',
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data);
                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data.data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };

    function storeLocalData(key, token) {
        window.localStorage.setItem(key, angular.toJson(token));
    };

    function loadLocalData(key) {
        var token = window.localStorage.getItem(key);
        if (token) {
            return token;
        } else {
            return false;
        }
    };

    var getImage = function (imageID) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: { imageID: imageID },
            url: APP_CONFIG.siteAPIURL + '/authentication/image-details-data',
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data);
                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data.data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };

    var downloadPreviewImage = function (imageID) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: { imageID: imageID },
            url: APP_CONFIG.siteAPIURL + '/authentication/image-details-data',
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data);
                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data.data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };

    var downloadTIFFImage = function (imageID) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: { imageID: imageID },
            url: APP_CONFIG.siteAPIURL + '/authentication/image-details-data',
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                console.log(data);
                if (!data.data.status) {
                    // if not successful, bind errors to error variables
                    def.reject("Failed!");
                } else {
                    // if successful, bind success message to message
                    def.resolve(data.data);
                }
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };


    var getSearchImages = function (searchData, pageNumber) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: {searcharg: searchData},
            url: APP_CONFIG.siteAPIURL + '/authentication/search-images?page='+pageNumber,
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
               def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };

    var getOldData = function (searchData, totalPages, pageNumber) {
        var def = $q.defer();
        $http({
            method: 'POST',
            data: {searcharg: searchData, pages: totalPages},
            url: APP_CONFIG.siteAPIURL + '/authentication/get-old-data?page='+pageNumber,
            headers: {'Content-Type': 'application/json'}  // set the headers so angular passing info as form data (not request payload)
        })
            .success(function (data) {
                def.resolve(data);
            })
            .error(function() {
                def.reject("Failed to get albums");
            });
        return def.promise;
    };




    var UserModel = {
        initialized: dfd.promise,
        username: undefined,
        picture: undefined,
        data: undefined,
        processForm: processForm,
        registerForm: registerForm,
        getAllImages: getAllImages,
        downloadTIFF: downloadTIFF,
        downloadPreviews: downloadPreviews,
        getImage: getImage,
        downloadPreviewImage: downloadPreviewImage,
        downloadTIFFImage: downloadTIFFImage,
        getSearchImages: getSearchImages,
        storeLocalData: storeLocalData,
        loadLocalData: loadLocalData,
        isUserLoggedIn: isUserLoggedIn,
        getOldData: getOldData

    };
    return UserModel;
});
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
angular.module('myApp').run(['$templateCache', function($templateCache) {$templateCache.put('app/modules/directives/header/header.tpl.html','<div class="off-canvas position-left light-off-menu" data-off-canvas>\n    <div class="off-menu-close">\n        <h3>Menu</h3>\n        <span class="left-off-canvas-toggle"><i class="fa fa-times"></i></span>\n    </div>\n    <div class="callout">\n        <ul class="vertical menu off-menu drilldown menu" drilldown-menu data-responsive-menu="drilldown">\n            <li class="has-submenu">\n                <a href="#!/home"><i class="fa fa-home"></i>{{getWord(\'home\')}}</a>\n            </li>\n            <li class="has-submenu" data-dropdown-menu="example1">\n                <a><i class="fa fa-film"></i>{{getWord(\'categories\')}}</a>\n                <ul class="submenu menu vertical" data-submenu>\n                    <li><a href="#!/home"><i class="fa fa-film"></i>seleziona tutte</a></li>\n                    <li><a href="#!/home"><i class="fa fa-film"></i>scarica alta </a></li>\n                    <li><a href="#!/home"><i class="fa fa-film"></i>scarica bassa </a></li>\n                    <li><a href="#!/home"><i class="fa fa-film"></i>modifica tag</a></li>\n                </ul>\n            </li>\n            <li><a href="#!/home"><i class="fa fa-th"></i>{{getWord(\'my-account\')}}</a></li>\n\n            <li><a href="#!/about"><i class="fa fa-user"></i>{{getWord(\'about\')}}</a></li>\n            <li><a href="#!/contact"><i class="fa fa-envelope"></i>{{getWord(\'contact\')}}</a></li>\n        </ul>\n    </div>\n\n    <div class="responsive-search">\n        <form method="post">\n            <div class="input-group">\n                <input class="input-group-field" type="text" placeholder="{{getWord(\'search-here\')}}">\n                <div class="input-group-button">\n                    <button type="submit" name="search"><i class="fa fa-search"></i></button>\n                </div>\n            </div>\n        </form>\n    </div>\n    <div class="off-social">\n        <h6>{{getWord(\'social-media\')}}</h6>\n        <a href="#"><i class="fa fa-facebook"></i></a>\n        <a href="#"><i class="fa fa-twitter"></i></a>\n        <a href="#"><i class="fa fa-google-plus"></i></a>\n        <a href="#"><i class="fa fa-instagram"></i></a>\n        <a href="#"><i class="fa fa-vimeo"></i></a>\n        <a href="#"><i class="fa fa-youtube"></i></a>\n    </div>\n</div>\n');
$templateCache.put('app/modules/directives/footer/footer.tpl.html','\n<div id="footer-bottom" class="subheader-color">\n    <div class="logo text-center">\n        <img ng-src="{{imageURL + \'logo-front-white.png\'}}" alt="footer logo">\n    </div>\n    <div class="btm-footer-text text-center">\n        <p>All rights reserved | \xA9 Angelo Trani | info@angelotranicloud.com</p>\n    </div>\n</div>');
$templateCache.put('app/modules/directives/language-selector/languageSelector.tpl.html','<div class="top-button" ng-controller="LanguagesCtrl">\n    <ul class="menu float-right">\n        <li ng-repeat="language in languages">\n            <img class="language" ng-click="selectLanguage(language)" ng-src="{{ imageURL + language.img }}" alt="{{language.name}}">\n        </li>\n        <li>\n            <a class="left-off-canvas-toggle transparent-btn" >\n                <span class="menu-icon"></span>\n            </a>\n        </li>\n        <li>\n            <a class="transparent-btn" href="#!/logout">{{getWord(\'logout\')}}</a>\n        </li>\n    </ul>\n</div>');
$templateCache.put('app/modules/directives/web-header/header.tpl.html','<!--Navber-->\n<section id="navBar" ng-cloak>\n    <nav class="sticky-container" data-sticky-container>\n        <div class="topnav" data-sticky data-top-anchor="navBar" data-btm-anchor="footer-bottom:bottom" data-margin-top="0" data-margin-bottom="0" style="width: 100%; background: #fff;" data-sticky-on="large">\n            <div class="title-bar" data-responsive-toggle="beNav" data-hide-for="large" ng-show="isMobileDevice">\n                <div class="visible-xs">\n                    <button class="left-off-canvas-toggle menu-icon" type="button"></button>\n                </div>\n                <div class="title-bar-title"><img src="{{imageURL + \'logo-front-white.png\'}}" alt="logo"></div>\n            </div>\n            <div class="show-for-large topbar-full clearfix" id="beNav" style="width: 100%;">\n                <div class="top-bar-left toplogo">\n                    <ul class="menu">\n                        <li class="menu-text">\n                            <a href="#!/home"><img ng-src="{{imageURL + \'logo-front-white.png\'}}" alt="logo"></a>\n                        </li>\n                    </ul>\n                </div>\n                <div class="top-bar-left topnews">\n                    <div class="newsTicker">\n                        <i class="fa fa-image"></i>\n                        <span class="text-white">{{getWord(\'new-submissions\')}}</span>\n                        <ul id="newsBar">\n                            <li><a class="text-white" href="#">Submission 1</a></li>\n                            <li><a class="text-white" href="#">Submission 2</a></li>\n                            <li><a class="text-white" href="#">Submission 3</a></li>\n                            <li><a class="text-white" href="#">Submission 3</a></li>\n                        </ul>\n                    </div>\n                </div>\n                <div class="top-bar-left topsearch">\n                    <div class="search-bar-full">\n                        <form method="get">\n                            <div class="input-group">\n                                <div class="input-group-button icon-btn">\n                                    <i class="text-white top-0 fa fa-2x fa-info-circle" class="has-tip" tooltip-placement="bottom" tooltip="{{getWord(\'tooltip\')}}"></i>\n                                </div>\n                                <input class="input-group-field" ng-model="searchTerms" ng-model="searchTerms" ng-keydown="($event.keyCode===13) ? searchAllImages() : return"  type="search" placeholder="{{getWord(\'search-description\')}}">\n                                <div class="input-group-button icon-btn" ng-click="searchAllImages();">\n                                    <i class="text-white top-0 fa fa-2x fa-search auto-right"></i>\n                                </div>\n                            </div>\n                        </form>\n                    </div>\n                </div>\n                <div class="top-bar-left topbtn">\n                    <div language-selector></div>\n                </div>\n            </div>\n        </div>\n    </nav>\n</section>\n');}]);
"use strict";

angular.module('myApp').factory('DeviceDetector', function($http, APP_CONFIG){

    var isMobile, isDesktop, device, nameObj = {};
    var detector = function(a, nameObj) {
        if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) {
            isMobile = true;
            isDesktop = false;
            device = nameObj.mobile;
        } else {
            isMobile = false;
            isDesktop = true;
            device = nameObj.desktop;
        }

    };

    return {
        init: function(obj) {
            console.log('here');
            detector(navigator.userAgent||navigator.vendor||window.opera, obj);
        },
        isMobile: function() {
            if(typeof isMobile === "undefined") {
                detector();
                return isMobile;
            } else {
                return isMobile;
            }
        },
        isDesktop: function() {
            if(typeof isDesktop === "undefined") {
                detector();
                return isDesktop;
            } else {
                return isDesktop;
            }
        },
        deviceTitle: function() {
            return device;
        },
        $get: function(){
            return {
                isMobile: function() {
                    if(typeof isMobile === "undefined") {
                        detector();
                        return isMobile;
                    } else {
                        return isMobile;
                    }
                },
                isDesktop: function() {
                    if(typeof isDesktop === "undefined") {
                        detector();
                        return isDesktop;
                    } else {
                        return isDesktop;
                    }
                },
                deviceTitle: device
            };
        }
    };

});
"use strict";

angular.module('myApp').factory('Language', function($http, APP_CONFIG){

    function getLanguage(key, callback) {

        $http.get(APP_CONFIG.apiRootUrl + '/langs/' + key + '.json').success(function(data){

            callback(data);

        }).error(function(){

            $log.log('Error');
            callback([]);

        });

    }

    function getLanguages(callback) {

        $http.get(APP_CONFIG.apiRootUrl + '/languages.json').success(function(data){

            callback(data);

        }).error(function(){

            $log.log('Error');
            callback([]);

        });

    }

    return {
        getLang: function(type, callback) {
            getLanguage(type, callback);
        },
        getLanguages:function(callback){
            getLanguages(callback);
        }
    }

});
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
'use strict';

angular.module('myApp.detail', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/detail/:id', {
            templateUrl: 'modules/detail/detail.html',
            controller: 'DetailCtrl',
            data : {
                authenticate: true
            }
        });
    }])

    .controller('DetailCtrl', ['$scope', '$rootScope', '$routeParams', 'APIDataService', '$location', '$timeout', function($scope, $rootScope, $routeParams, APIDataService, $location, $timeout) {
        $scope.vm = this;
        $scope.formData = {};
        $scope.records = {};
        $rootScope.searchTerms = '';
        $scope.record = {};
        $scope.showResults = false;
        $scope.tags = {};
        var isLoggedIn = APIDataService.isUserLoggedIn()
            .then(function(data) {
                    console.log(data);
                },
                function(data) {
                    $location.path('/login').replace();
                });
        APIDataService.getImage($routeParams.id)
            .then(function(data) {
                    console.log(data);
                    $scope.record = data.imageData;
                    $scope.tags = $scope.record.tags.split(';');
                },
                function(data) {
                    console.log('Image retrieval failed.')
                });
        $scope.downloadTIFFImage = function () {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.setAttribute("type", "hidden");
            link.download = $scope.record.filename + '.tiff';
            link.href = $scope.record.url;
            link.click();
            document.body.removeChild(link);

        };
        $scope.downloadPreviewImage = function () {
            var link = document.createElement("a");
            document.body.appendChild(link);
            link.setAttribute("type", "hidden");
            link.download = $scope.record.filename + '.jpg';
            link.href = $scope.record.prevpath;
            link.click();
            document.body.removeChild(link);
        };

        $scope.searchAllImages = function () {
            APIDataService.storeLocalData('doSearch', true);
            APIDataService.storeLocalData('searchTerms', $scope.searchTerms);
            $location.path('/home').replace();
        };

        if(APIDataService.loadLocalData('hasDetailSearch'))
        {
            $timeout(function(){
                // Any code in here will automatically have an $scope.apply() run afterwards
                if(!$scope.$$phase) {
                    //$digest or $apply
                    $scope.$apply()
                }
                $scope.searchTerms = JSON.parse(APIDataService.loadLocalData('searchTerms'));
                window.localStorage.removeItem('hasDetailSearch');
                window.localStorage.removeItem('searchTerms');
                // And it just works!
            });
        }

        var changeLocation = function(url, forceReload) {
            $scope = $scope || angular.element(document).scope();
            if(forceReload || $scope.$$phase) {
                window.location = url;
            }
            else {
                //only use this if you want to replace the history stack
                //$location.path(url).replace();

                //this this if you want to change the URL and add it to the history stack
                $location.path(url);
                $scope.$apply();
            }
        };

    }]);
'use strict';

var home = angular.module('myApp.home', ['ngRoute', 'mm.foundation']);

home.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/home', {
        templateUrl: 'modules/home/home.html',
        controller: 'HomeCtrl',
        data : {
            authenticate: true
        }
    });
}]);

    home.controller('HomeCtrl', ['$scope', '$rootScope', '$q', 'APP_CONFIG', '$timeout', '$log', 'Language', 'APIDataService', '$filter', 'bsLoadingOverlayService', '$location', function($scope, $rootScope, $q, APP_CONFIG, $timeout, $log, Language, APIDataService, $filter, bsLoadingOverlayService, $location) {
        'ngInject';
        $scope.vm = this;
        var vmt = this;
        $scope.showResults = false;
        $scope.formData = {};
        $scope.called = false;
        $scope.hasResults = false;
        $rootScope.currentPageNumber = 1;
        $scope.originalData = {};
        $scope.allOldData = {};
        $rootScope.lang = {};
        $rootScope.newData = {};
        $scope.records = [];
        $rootScope.searchTerms = '';
        $scope.showDownloads = false;
        $scope.cntchecked = 0;
        $scope.checkedtiffpath = {};
        $scope.checkedprevpath = {};
        $scope.ontogglecheckbox = function (event, record) {
            console.log($scope.checkedtiffpath);
            if($scope.checkedtiffpath[record.id])
            {
                    $scope.cntchecked--;
                    record.isChecked = !record.isChecked;
                    delete $scope.checkedtiffpath[record.id];
                    delete $scope.checkedprevpath[record.id];
                    console.log('removing');
            } else {
                $scope.cntchecked++;
                record.isChecked = !record.isChecked;
                $scope.checkedtiffpath[record.id] = record.dbpathname;
                $scope.checkedprevpath[record.id] = record.path;
            }

            if($scope.cntchecked > 0)
            {
                $scope.showDownloads = true;
            } else {
                $scope.showDownloads = false;
            }

        };


         var isLoggedIn = APIDataService.isUserLoggedIn()
             .then(function(data) {

                 },
                 function(data) {
                     $location.path('/login').replace();
                 });
        if(APIDataService.loadLocalData('hasChangedState') === true) {
            bsLoadingOverlayService.start();
            $scope.searchTerms = JSON.parse(APIDataService.loadLocalData('changedSearchTerm'));
            var totalPages = JSON.parse(APIDataService.loadLocalData('oldData'));
            $timeout(function(){
                APIDataService.getOldData($scope.searchTerms, totalPages, 1)
                    .then(function(data) {

                            if(data.thumbpath.length > 0)
                            {
                                $rootScope.newData = data.thumbpath;
                                angular.forEach($scope.newData, function(image){
                                    $scope.originalData.push(image);
                                });
                                $scope.records = $scope.originalData;
                                $scope.allOldData = $scope.originalData;
                                if (!$scope.$$phase) {
                                    $scope.$apply(function () {
                                        console.log('records found');
                                        $scope.hasResults = true;
                                        $scope.records = Array.prototype.slice.call( data.thumbpath, 0 );
                                        console.log($scope.records);
                                    });
                                }
                                else
                                {
                                    $timeout(function(){
                                        $scope.$apply(function () {
                                            console.log('records found');
                                            $scope.hasResults = true;
                                            $scope.records = Array.prototype.slice.call( data.thumbpath, 0 );
                                            console.log($scope.records);
                                        });
                                    }, 0);

                                }
                                APIDataService.getOldData($scope.searchTerms, totalPages, 1)
                                    .then(function (data) {
                                        console.log('weird');
                                    });

                                //$scope.records = [];
                                //$scope.originalData = [];
                                // angular.forEach(data.thumbpath, function(image){
                                //     console.log(image);
                                //     $scope.records.push(image);
                                // });
                                //$scope.records = $scope.originalData;
                            } else {
                                $scope.hasResults = false;
                            }
                            bsLoadingOverlayService.stop();

                        },
                        function(data) {
                            bsLoadingOverlayService.stop();
                            console.log('Image retrieval failed.')
                        });
            }, 0);
        }

        //var getOldDataOn =

        var winHeight = jQuery(window).height();
        var element = angular.element(document.querySelector('.content'));
        if(element[0] !== undefined)
        {
            var height = element[0].offsetHeight;
            //console.log('window height ' + winHeight);
            //console.log('elemnt height' + height);
            var wrappers = [".content"];
            if (height < winHeight ) {
                for (var i = 0, n = wrappers.length; i < n; i++) {
                    jQuery(wrappers[i]).addClass("full-height");
                    jQuery(wrappers[i]).css('height',(winHeight-175)+'px');
                }
                jQuery("#footer-bottom").addClass("sticky-footer");
            }
        }


        /*

        var result =  APIDataService.getAllImages()
            .then(function(data) {
                    console.log(data);
                    //$scope.records = data.images.thumbpath;
                    $scope.originalData = $scope.records;
                },
                function(data) {
                    console.log('Image retrieval failed.')
                });
        */

        if(APIDataService.loadLocalData('doSearch'))
        {
            $timeout(function(){
                // Any code in here will automatically have an $scope.apply() run afterwards
                if(!$scope.$$phase) {
                    //$digest or $apply
                    $scope.$apply()
                }
                jQuery('.content').css({'height' : 'auto'});
                $scope.searchTerms = JSON.parse(APIDataService.loadLocalData('searchTerms'));
                //console.log($scope.searchTerms);
                getNewData();
                // And it just works!
            });
        }



        $scope.$on("$locationChangeStart",function() {
            if(!APIDataService.loadLocalData('hasChangedState'))
            {
                APIDataService.storeLocalData('hasChangedState', true);
                APIDataService.storeLocalData('changedSearchTerm', $scope.searchTerms);
                APIDataService.storeLocalData('oldData', $rootScope.currentPageNumber);
            }

        });

        var getNewData = function () {
            $scope.showResults = true;
            //Save Data
            var out = [];
            APIDataService.getSearchImages($scope.searchTerms, $rootScope.currentPageNumber)
                .then(function(data) {
                       // console.log('got data for ' + $scope.searchTerms);
                        $scope.records = data.thumbpath;
                        $scope.originalData = $scope.records;
                        $scope.allOldData = $scope.originalData;
                        //$scope.originalData = $scope.records;
                    },
                    function(data) {
                        console.log('Image retrieval failed.')
                    });
            return out;
        };

        $scope.downloadTIFF = function () {
            APIDataService.downloadTIFF($scope.checkedtiffpath)
                .then(function(data) {
                        var link = document.createElement("a");
                        link.download = 'download-tiff.zip';
                        link.href = APP_CONFIG.backendURL + '/download-tiff.zip';
                        link.click();
                    },
                    function(data) {
                        console.log('Image retrieval failed.')
                    });
        };

        $scope.downloadPrevs = function () {
            APIDataService.downloadPreviews($scope.checkedprevpath)
                .then(function(data) {
                        var link = document.createElement("a");
                        link.download = 'download-prev.zip';
                        link.href = APP_CONFIG.backendURL + '/download-prev.zip';
                        link.click();
                    },
                    function(data) {
                        console.log('Image retrieval failed.')
                    });
        };
        $rootScope.searchAllImages = function () {
            $scope.showResults = true;
            bsLoadingOverlayService.start();
            //Save Data
            var out = [];
            APIDataService.storeLocalData('hasDetailSearch', true);
            APIDataService.storeLocalData('searchTerms', $scope.searchTerms);
            APIDataService.getSearchImages($scope.searchTerms, $rootScope.currentPageNumber)
                .then(function(data) {
                        if(data.thumbpath.length > 0)
                        {
                            jQuery('.content').css({'height' : 'auto'});
                            $scope.hasResults = true;
                            //console.log('got data for ' + $scope.searchTerms);
                            $scope.records = data.thumbpath;
                            $scope.originalData = $scope.records;
                            $scope.allOldData = $scope.records;
                        } else {
                            $scope.hasResults = false;
                        }
                        bsLoadingOverlayService.stop();
                        //$scope.originalData = $scope.records;
                    },
                    function(data) {
                        bsLoadingOverlayService.stop();
                        console.log('Image retrieval failed.')
                    });
            return out;
        };
        $rootScope.viewMoreImages = function () {
            $rootScope.currentPageNumber++;
            //Save Data
            var out = [];
            bsLoadingOverlayService.start();
            APIDataService.getSearchImages($scope.searchTerms, $rootScope.currentPageNumber)
                .then(function(data) {
                        $rootScope.newData = data.thumbpath;
                        if(data.thumbpath.length > 0)
                        {
                            angular.forEach($scope.newData, function(image){
                                $scope.originalData.push(image);
                            });
                            $scope.records = $scope.originalData;
                            $scope.allOldData = $scope.originalData;
                        } else {
                            $scope.hasResults = false;
                        }
                        bsLoadingOverlayService.stop();
                    },
                    function(data) {
                        console.log('Image retrieval failed.')
                    });
            return out;
        }
    }]);
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
"use strict";

angular.module('myApp').controller("LanguagesCtrl",  function LanguagesCtrl($scope, $rootScope, $log, Language){

    $rootScope.lang = {};

    Language.getLanguages(function(data){

        $rootScope.currentLanguage = data[0];

        $rootScope.languages = data;

        Language.getLang(data[0].key,function(data){

            $rootScope.lang = data;
        });

    });

    $scope.selectLanguage = function(language){
        $rootScope.currentLanguage = language;

        Language.getLang(language.key,function(data){

            $rootScope.lang = data;

        });
    }

    $rootScope.getWord = function(key){
        if(angular.isDefined($rootScope.lang[key])){
            return $rootScope.lang[key];
        }
        else {
            return key;
        }
    }

});