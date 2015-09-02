angular.module('mSelHistory', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('SelHistory', {
                url: '/SelHistory',
                controller: 'SelHistoryCtrl',
                templateUrl: 'page/changeGetPeopleMessage.html'
            });
        $urlRouterProvider.otherwise('/SelHistory');
    })
    .controller('SelHistoryCtrl', function ($scope, $stateParams, PopupF, PublicInfoP, PublicFnF) {
        $scope.$root.backData.transferData.push({"key": "dataKey", "data": {}});
        $scope.$root.backData.transferData[0].data = $scope.express = {};
        $scope.express.type = $scope.$root.tmpSearch.id;

        $scope.selHistory = function(obj) {
            $scope.express.type = $scope.$root.tmpSearch.id;
            $scope.express.pickupAddress = obj.receiverAddress;
            $scope.express.pickupPeople = obj.receiverName;
            $scope.express.pickupPhone = obj.receiverMobile;
            $scope.express.pickupShi = obj.receiverMdd;
            jwGobal.jsGoBack($scope.$root.backData);
        };

        $scope.decodeURI = function(str) {
            return decodeURI(str);
        };
    });
