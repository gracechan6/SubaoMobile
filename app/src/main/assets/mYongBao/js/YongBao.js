angular.module('mYongBao', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'cYongBao', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ExpressList', {
                url: '/ExpressList',
                controller: 'YRootCtrl',
                templateUrl: 'page/ExpressList.html'
            })
            .state('DJKJInfo', {
                url: '/DJKJInfo?id&flag',
                controller: 'DJKJInfoCtrl',
                templateUrl: 'page/DJKJInfo.html'
            })
            .state('DQKJInfo', {
                url: '/DQKJInfo?id&flag',
                controller: 'DQKJInfoCtrl',
                templateUrl: 'page/DQKJInfo.html'
            })
            .state('KJGZInfo', {
                url: '/KJGZInfo?id&flag',
                controller: 'KJGZInfoCtrl',
                templateUrl: 'page/KJGZInfo.html'
            })
            .state('KJGZCheckInfo', {
                url: '/KJGZCheckInfo?id&flag',
                controller: 'KJGZCheckInfoCtrl',
                templateUrl: 'page/KJGZCheckInfo.html'
            })
            .state('KJCXInfo', {
                url: '/KJCXInfo',
                controller: 'KJCXInfoCtrl',
                templateUrl: 'page/KJCXInfo.html'
            })
            .state('WYJJInfo', {
                url: '/WYJJInfo',
                controller: 'WYJJInfoCtrl',
                templateUrl: 'page/WYJJInfo.html'
            })
            .state('ExpressChoose', {
                url: '/ExpressChoose',
                controller: 'ExpressChooseCtrl',
                templateUrl: 'page/ExpressChoose.html'
            })
            .state('changeSendPeopleMessage', {
                url: '/changeSendPeopleMessage',
                controller: 'changeSendPeopleMessageCtrl',
                templateUrl: 'page/changeSendPeopleMessage.html'
            })
            .state('changeGetPeopleMessage', {
                url: '/changeGetPeopleMessage',
                controller: 'changeGetPeopleMessageCtrl',
                templateUrl: 'page/changeGetPeopleMessage.html'
            })
            .state('CompanyList', {
                url: '/CompanyList',
                controller: 'RootCtrl',
                templateUrl: 'page/CompanyList.html'
            });
        $urlRouterProvider.otherwise('/ExpressList');
    });
