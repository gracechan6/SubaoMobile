angular.module('mChangeSender', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ChangeSender', {
                url: '/ChangeSender',
                controller: 'ChangeSenderCtrl',
                templateUrl: 'page/changeSendPeopleMessage.html'
            });
        $urlRouterProvider.otherwise('/ChangeSender');
    })
    .controller('ChangeSenderCtrl', function ($scope, $stateParams, $http, PopupF, PublicInfoP, PublicFnF) {
        $scope.$root.backData.transferData.push({"key": "dataKey", "data": {}});
        $scope.$root.backData.transferData[0].data = $scope.express = {};
        $scope.express.type = $scope.$root.tmpSearch.id;

        //Real页面跳转
        $scope.jumpTo = function (pageName, uuid) {
            if (pageName == "SelAdd") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "SelAdd.html", "pageNum": "6", "title": null, "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "SelAdd.html", "pageNum": "6", "title": "编辑地址", "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else {
                    window.location.href = "SelAdd.html?id=" + uuid;
                }
            }
        };

        $scope.$on("getBackData", function(e,d) {
            if (d[0].data.type == "send") {
                var shi, address;
                if (d[0].data.Sheng == d[0].data.Shi) {
                    shi = d[0].data.Shi;
                    address = d[0].data.Shi + d[0].data.Qu + d[0].data.other;
                } else if (d[0].data.Shi == "") {
                    shi = d[0].data.Sheng;
                    address = d[0].data.Sheng + d[0].data.other;
                } else if (d.Qu == "") {
                    shi = d[0].data.Shi;
                    address = d[0].data.Sheng + d[0].data.Shi + d[0].data.other;
                } else {
                    shi = d[0].data.Shi;
                    address = d[0].data.Sheng + d[0].data.Shi + d[0].data.Qu + d[0].data.other;
                }
                $scope.$apply(function() {
                    $scope.express.sendShi = shi;
                    $scope.express.sendAddress = address;
                });
            }
        });

        $scope.$on("goBackSave", function(e) {
            console.log("已经进入goBackSave")
            console.log(typeof $scope.express.sendAddress == "undefined" || $scope.express.sendAddress == "")
            if (typeof $scope.express.sendAddress == "undefined" || $scope.express.sendAddress == "") {
                PopupF.alert("提示", "template", "请编辑寄件人地址！", 3000);
                return false;
            }
            if (typeof $scope.express.sendPeople == "undefined" || $scope.express.sendPeople == "") {
                PopupF.alert("提示", "template", "请填写寄件人！", 3000);
                return false;
            }
            if (typeof $scope.express.sendPhone == "undefined" || $scope.express.sendPhone == "") {
                PopupF.alert("提示", "template", "请填写寄件人电话！", 3000);
                return false;
            }
            jwGobal.jsGoBack($scope.$root.backData);
        });
    });
