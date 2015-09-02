angular.module('mDqInfo', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('DQKJInfo', {
                url: '/DQKJInfo',
                controller: 'DQKJInfoCtrl',
                templateUrl: 'page/DQKJInfo.html'
            });
        $urlRouterProvider.otherwise('/DJKJInfo');
    })
    .controller('DQKJInfoCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicSlideBoxDelegate, PopupF, PublicInfoP, PublicFnF) {
        //var uuid = $stateParams.id;
        var uuid = $scope.$root.tmpSearch.id;
        var Url = PublicFnF.getRootUrl() + 'ybpt/web/ybmobile/ReceiveSendShow_show.action';
        var KeyData = {"Muuid": $scope.$root.Constant.mUuid, "Uuid": uuid};
        PublicInfoP.loadInfo(Url, KeyData)
            .then(function (CacheData) {
                if (CacheData.length > 0) {
                    $scope.info = CacheData[0];
                    qrcode = new QRCode("qrcode", {
                        width: 150,
                        height: 150,
                        text: CacheData[0].uuid + "^"
                    });
                }
            }, function (reason) {
                PopupF.alert("提示", "template", reason, 3000);
            });
        $scope.decodeURI = function(str) {
            return decodeURI(str);
        };
    });
