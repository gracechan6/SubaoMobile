angular.module('mJjInfo', ['starter', 'ui.router', 'jwMobile.serivces', 'jwMobile.directives', 'jwMobile.controllers', 'tabSlideBox'])
    .config(function ($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('ExpressChoose', {
                url: '/ExpressChoose',
                controller: 'ExpressChooseCtrl',
                templateUrl: 'page/ExpressChoose.html'
            });
        $urlRouterProvider.otherwise('/ExpressChoose');
    })
    .controller('ExpressChooseCtrl', function ($scope, $stateParams, $state, $ionicPopover, $ionicSlideBoxDelegate, PopupF, PublicInfoP, PublicFnF, $http) {
        $scope.express = {};
        //$scope.express.CompanyUuid = $stateParams.id;
        $scope.express.CompanyUuid = $scope.$root.tmpSearch.id;
        $scope.express.CompanyName = $scope.$root.tmpSearch.flag;
        $scope.express.pickupAddress = "请编辑收件地址";
        $scope.express.selOptions = [
            {
                "Weight":"1 KG",
                "Value": "5"
            },
            {
                "Weight":"2 KG",
                "Value": "10"
            },
            {
                "Weight":"3 KG",
                "Value": "15"
            },
            {
                "Weight":"4 KG",
                "Value": "20"
            },
            {
                "Weight":"5 KG",
                "Value": "25"
            },
            {
                "Weight":"6 KG",
                "Value": "30"
            },
            {
                "Weight":"7 KG",
                "Value": "35"
            },
            {
                "Weight":"8 KG",
                "Value": "40"
            },
            {
                "Weight":"9 KG",
                "Value": "45"
            },
            {
                "Weight":"10 KG",
                "Value": "50"
            },
            {
                "Weight":"11 KG",
                "Value": "55"
            },
            {
                "Weight":"12 KG",
                "Value": "60"
            },
            {
                "Weight":"13 KG",
                "Value": "65"
            },
            {
                "Weight":"14 KG",
                "Value": "70"
            },
            {
                "Weight":"15 KG",
                "Value": "75"
            },
            {
                "Weight":"16 KG",
                "Value": "80"
            },
            {
                "Weight":"17 KG",
                "Value": "85"
            },
            {
                "Weight":"18 KG",
                "Value": "90"
            },
            {
                "Weight":"19 KG",
                "Value": "95"
            },
            {
                "Weight":"20 KG",
                "Value": "100"
            }
        ];
        $scope.express.selected = $scope.express.selOptions[0];

        var Url = PublicFnF.getRootUrl() + 'ybpt/web/ybmobile/MobilePackageInfo_findRecent.action';
        var KeyData = {"Muuid": $scope.$root.Constant.mUuid};
        PublicInfoP.loadInfo(Url, KeyData)
            .then(function (CacheData) {
                if (CacheData.length > 0) {
                    $scope.express.sendAddress = decodeURI(CacheData[0].sendAddress);
                    $scope.express.sendPeople = decodeURI(CacheData[0].sendUser);
                    $scope.express.sendPhone = CacheData[0].sendMobile;
                    $scope.express.sendShi = decodeURI(CacheData[0].sendBeginPlace);
                }
            }, function (reason) {
                $scope.title = {
                    content: '',
                    isEdit: false
                };
                PopupF.alert("提示", "template", reason, 3000);
            });

        $scope.gotoSave = function() {
            if ($scope.express.sendAddress == "") {
                PopupF.alert("提示", "template", "寄件人件人地址不能为空！", 3000);
            } else if (typeof $scope.express.sendPeople == "undefined" || $scope.express.sendPeople == "") {
                PopupF.alert("提示", "template", "寄件人不能为空！", 3000);
            } else if (typeof $scope.express.sendPhone == "undefined" || $scope.express.sendPhone == "") {
                PopupF.alert("提示", "template", "寄件人电话不能为空！", 3000);
            } else if ($scope.express.pickupAddress == "请编辑收件地址") {
                PopupF.alert("提示", "template", "收件人地址不能为空！", 3000);
            } else if (typeof $scope.express.pickupPeople == "undefined" || $scope.express.pickupPeople == "") {
                PopupF.alert("提示", "template", "收件人不能为空！", 3000);
            } else if (typeof $scope.express.pickupPhone == "undefined" || $scope.express.pickupPhone == "") {
                PopupF.alert("提示", "template", "收件人电话不能为空！", 3000);
            } else {
                var Url = PublicFnF.getRootUrl() + 'ybpt/web/ybmobile/MobilePackageInfo_packageinfo.action';
                var KeyData = {
                    "Muuid": $scope.$root.Constant.mUuid,
                    "CompanyUuid": $scope.express.CompanyUuid,
                    "SendUser": encodeURI($scope.express.sendPeople),
                    "SendAddress": encodeURI($scope.express.sendAddress),
                    "SendBeginPlace": encodeURI($scope.express.sendShi),
                    "SendMobile": $scope.express.sendPhone,
                    "ReceiverName": encodeURI($scope.express.pickupPeople),
                    "ReceiverAddress": encodeURI($scope.express.pickupAddress),
                    "ReceiverTargetplace": encodeURI($scope.express.pickupShi),
                    "ReceiverMobile": $scope.express.pickupPhone,
                    "PackageWeight": $scope.express.selected.Weight,
                    "PackagePrice": $scope.express.selected.Value
                };
                PublicInfoP.loadInfo(Url, KeyData)
                    .then(function (CacheData) {
                        if(CacheData[0].returnFlag == 1)
                            PopupF.alert("提示", "template", "文件保存成功！", 3000, "", "", "", function(res) {
                                $scope.express.CompanyUuid = "";
                                $scope.express.pickupPeople = "";
                                $scope.express.pickupAddress = "";
                                $scope.express.pickupShi = "";
                                $scope.express.pickupPhone = "";
                                $scope.express.selected = {};
//                                console.log("我寄快递的ID"+CacheData[0].packUuid)
                                $scope.jumpTo('DJKJInfo',CacheData[0].packUuid);
                            });
                        else
                            PopupF.alert("提示", "template", "文件保存失败！", 3000);
                    }, function (reason) {
                        PopupF.alert("提示", "template", reason, 3000);
                    });
            }
        };

        //Real页面跳转
        $scope.jumpTo = function (pageName, uuid) {
            if (pageName == "DJKJInfo") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "DjInfo.html", "pageNum": "4", "title": null, "params": {"id": uuid}, "transferData": [], "hasCallbackData": false});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "DjInfo.html", "pageNum": "4", "title": "待机快递", "params": {"id": uuid}, "transferData": [], "hasCallbackData": false});
                } else {
                    window.location.href = "DjInfo.html?id=" + uuid;
                }
            }
            else if (pageName == "SelAdd") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "SelAdd.html", "pageNum": "6", "title": null, "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "SelAdd.html", "pageNum": "6", "title": "编辑地址", "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else {
                    window.location.href = "SelAdd.html?id=" + uuid;
                }
            }
            else if (pageName == "ChangeSender") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "ChangeSender.html", "pageNum": "7", "title": null, "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "ChangeSender.html", "pageNum": "7", "title": "寄件人信息", "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else {
                    window.location.href = "ChangeSender.html";
                }
            }
            else if (pageName == "SelHistory") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "SelHistory.html", "pageNum": "8", "title": null, "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "SelHistory.html", "pageNum": "8", "title": "选择收货地址", "params": {"id": uuid}, "transferData": [], "hasCallbackData": true});
                } else {
                    window.location.href = "SelHistory.html?id=" + uuid;
                }
            }
        };

        $scope.$on("getBackData", function(e,d) {
            if (d[0].data.type == "pickup") {
                var shi, address;
                if (d[0].data.Sheng == d[0].data.Shi) {
                    shi = d[0].data.Shi;
                    address = d[0].data.Shi + d[0].data.Qu + d[0].data.other;
                } else if (d[0].data.Shi == "") {
                    shi = d[0].data.Sheng;
                    address = d[0].data.Sheng + d[0].data.other;
                } else if (d[0].data.Qu == "") {
                    shi = d[0].data.Shi;
                    address = d[0].data.Sheng + d[0].data.Shi + d[0].data.other;
                } else {
                    shi = d[0].data.Shi;
                    address = d[0].data.Sheng + d[0].data.Shi + d[0].data.Qu + d[0].data.other;
                }
                $scope.$apply(function() {
                    $scope.express.pickupShi = shi;
                    $scope.express.pickupAddress = address;
                });
            }
            else if (d[0].data.type == "changeSender") {
                $scope.$apply(function() {
                    $scope.express.sendShi = d[0].data.sendShi;
                    $scope.express.sendAddress = d[0].data.sendAddress;
                    $scope.express.sendPeople = d[0].data.sendPeople;
                    $scope.express.sendPhone = d[0].data.sendPhone;
                });
            }
            else if (d[0].data.type == "selHistory") {
                $scope.$apply(function() {
                    $scope.express.pickupAddress = d[0].data.pickupAddress;
                    $scope.express.pickupPeople = d[0].data.pickupPeople;
                    $scope.express.pickupPhone = d[0].data.pickupPhone;
                    $scope.express.pickupShi = d[0].data.pickupShi;
                });
            }
        });

        $scope.decodeURI = function(str) {
            return decodeURI(str);
        };
    });
