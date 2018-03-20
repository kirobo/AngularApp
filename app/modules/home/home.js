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