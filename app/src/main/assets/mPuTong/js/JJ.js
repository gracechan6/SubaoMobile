angular.module('mJJ', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('CompanyList', {
                url: '/CompanyList',
                controller: 'CompanyListCtrl',
                templateUrl: 'page/CompanyList.html'
            });
        $urlRouterProvider.otherwise('/CompanyList');
    })
    .controller('CompanyListCtrl', function ($scope, PublicListP) {
        $scope.$on('$ionicView.beforeLeave', function(){
            try {
                jwGobal.jsSetTitle("快递公司");
                PublicListP.setCurrentPage(1,"Company");
            } catch(err) {
                console.log(err);
            }
        });
    });
