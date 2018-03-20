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