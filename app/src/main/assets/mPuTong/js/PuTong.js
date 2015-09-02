angular.module('mPuTong', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'cPuTong', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('Login', {
                url: '/Login',
                controller: 'LoginCtrl',
                templateUrl: 'page/Login.html'
            })
            .state('ExpressList', {
                url: '/ExpressList',
                controller: 'RootCtrl',
                templateUrl: 'page/ExpressList.html'
            });
        $urlRouterProvider.otherwise('/ExpressList');
    });
