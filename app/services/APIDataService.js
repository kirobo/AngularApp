
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