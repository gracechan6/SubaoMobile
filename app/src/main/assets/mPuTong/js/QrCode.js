angular.module('mQrCode', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('QrCode', {
                url: '/QrCode',
                controller: 'QrCodeCtrl',
                templateUrl: 'page/QrCode.html'
            });
        $urlRouterProvider.otherwise('/QrCode');
    })
    .controller('QrCodeCtrl', function ($scope) {
        var content, size;
        if (typeof $scope.$root.tmpSearch.content != "undefined") {
            content = $scope.$root.tmpSearch.content + "^";
            size = $scope.$root.tmpSearch.size;
            qrcode = new QRCode("qrcode", {
                width: size,
                height: size,
                text: content
            });
        }
        $scope.$root.$on("getParamsData", function(e) {
            content = $scope.$root.tmpSearch.content + "^";
            size = $scope.$root.tmpSearch.size;
            qrcode = new QRCode("qrcode", {
                width: size,
                height: size,
                text: content
            });
        });
    });
