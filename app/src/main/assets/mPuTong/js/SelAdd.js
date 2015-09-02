angular.module('mSelAdd', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('SelAdd', {
                url: '/SelAdd',
                controller: 'SelAddCtrl',
                templateUrl: 'page/selectAddress.html'
            });
        $urlRouterProvider.otherwise('/SelAdd');
    })
    .controller('SelAddCtrl', function ($scope, $stateParams, $http, PopupF, PublicInfoP, PublicFnF) {
        $scope.$root.backData.transferData.push({"key": "dataKey", "data": {}});
        $scope.$root.backData.transferData[0].data = $scope.addressInfo = {};
        $scope.addressInfo1 = {};
        $scope.addressInfo.type = $scope.$root.tmpSearch.id;
        $http.get("../js/city.json").success(function(response) {
            $scope.addressInfo1.cityJson = response;
            $scope.addressInfo1.cityJsonSub = $scope.addressInfo1.cityJson[0].sub;
            $scope.addressInfo1.cityJsonSubSub = $scope.addressInfo1.cityJson[0].sub[0].sub;
            $scope.addressInfo.Sheng = $scope.addressInfo1.cityJson[0].name;
            $scope.addressInfo.Shi = $scope.addressInfo1.cityJson[0].sub[0].name;
            $scope.addressInfo.Qu = $scope.addressInfo1.cityJson[0].sub[0].sub[0].name;
            $scope.addressInfo.other = "";
        });

        $scope.changeSheng = function() {
            for (var i = 0; i < $scope.addressInfo1.cityJson.length; i++) {
                if ($scope.addressInfo1.cityJson[i].name == $scope.addressInfo.Sheng) {
                    if (typeof $scope.addressInfo1.cityJson[i].sub == "undefined") {
                        $scope.addressInfo1.cityJsonSub = [];
                        $scope.addressInfo.Shi = "";
                        $scope.addressInfo1.cityJsonSubSub = [];
                        $scope.addressInfo.Qu = "";
                    } else {
                        if (typeof $scope.addressInfo1.cityJson[i].sub[0].sub == "undefined") {
                            $scope.addressInfo1.cityJsonSub = [];
                            $scope.addressInfo1.cityJsonSub.push($scope.addressInfo1.cityJson[i]);
                            $scope.addressInfo.Shi = $scope.addressInfo1.cityJsonSub[0].name;
                        } else {
                            $scope.addressInfo1.cityJsonSub = $scope.addressInfo1.cityJson[i].sub;
                            $scope.addressInfo.Shi = $scope.addressInfo1.cityJsonSub[0].name;
                        }
                        $scope.changeShi();
                    }
                    break;
                }
            }
        };

        $scope.changeShi = function() {
            for (var i = 0; i < $scope.addressInfo1.cityJsonSub.length; i++) {
                if ($scope.addressInfo1.cityJsonSub[i].name == $scope.addressInfo.Shi) {
                    if (typeof $scope.addressInfo1.cityJsonSub[i].sub == "undefined") {
                        $scope.addressInfo1.cityJsonSubSub = [];
                        $scope.addressInfo.Qu = "";
                    } else {
                        if ($scope.addressInfo1.cityJsonSub[i].sub.length == 0) {
                            $scope.addressInfo1.cityJsonSubSub = [];
                            $scope.addressInfo.Qu = "";
                        } else {
                            $scope.addressInfo1.cityJsonSubSub = $scope.addressInfo1.cityJsonSub[i].sub;
                            $scope.addressInfo.Qu = $scope.addressInfo1.cityJsonSubSub[0].name;
                        }
                    }
                    break;
                }
            }
        };

        $scope.$on("goBackSave", function(e) {
            console.log("已经进入goBackSaveAddress")
            $scope.addressInfo.type = $scope.$root.tmpSearch.id;
            if ($scope.addressInfo.Sheng == "请选择") {
                PopupF.alert("提示", "template", "请选择省市区！", 3000);
                return false;
            }
            if ($scope.addressInfo.other == "") {
                PopupF.alert("提示", "template", "请填写详细地址！", 3000);
                return false;
            }
            jwGobal.jsGoBack($scope.$root.backData);
        });
    });
