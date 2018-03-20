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
