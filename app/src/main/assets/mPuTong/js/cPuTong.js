angular.module('cPuTong', [])
    .controller('RootCtrl', function($scope, $rootScope, $state, $ionicSlideBoxDelegate){
        $scope.jsonData = {};
        $scope.$on('$ionicView.beforeEnter', function(){
            try {
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.enableSlide(false);
                var i;
                if($rootScope.jwAddItem.length>0) {
                    for(i=0;i<$rootScope.jwAddItem.length;i++)
                        $scope.$broadcast( 'addItem-controllers',$rootScope.jwAddItem[i]);
                    $rootScope.jwAddItem = [];
                }
                if($rootScope.jwRemoveItem.length>0) {
                    for(i=0;i<$rootScope.jwRemoveItem.length;i++)
                        $scope.$broadcast( 'delItem-controllers',$rootScope.jwRemoveItem[i]);
                    $rootScope.jwRemoveItem = [];
                }
            } catch(err) {
                console.log(err);
            }
        });
        //页面跳转
        $scope.jumpGoTo = function (pageName) {
            $state.go(pageName);
        };
        //Real页面跳转
        $scope.jumpTo = function (pageName) {
            if (pageName == "CompanyList") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "JJ.html", "pageNum": "2", "title": null, "params": null, "transferData": [], "hasCallbackData": false});
                } else if (ionic.Platform.isAndroid()) {
//                    jwGobal.jsShowPage('{"destUrl": "JJ.html", "pageNum": "2", "title": null, "params": null, "transferData": [], "hasCallbackData": false}')
//                    jwGobal.jsShowPage({"destUrl": "JJ.html", "pageNum": "2", "title": null, "params": {}, "transferData": [], "hasCallbackData": true});
                    jwGobal.jsShowPage({"destUrl": "JJ.html", "pageNum": "2", "title": "公司列表", "params": {}, "transferData": [], "hasCallbackData": false});
                } else {
                    window.location.href = "JJ.html";
                }
            }
            else if (pageName == "Search") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "", "pageNum": "0", "title": null, "params": null, "transferData": [], "hasCallbackData": false});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "kaidi100", "pageNum": "0", "title": "快递查询", "params": {}, "transferData": [], "hasCallbackData": true});
                } else {
                    //window.location.href = "JJ.html";
                }
            }
        };
    })
    .controller('LoginCtrl', function ($scope, $rootScope, PublicFnF, PublicInfoP,$state) {
        var Url = PublicFnF.getRootUrl() + 'ybpt/web/ybmobile/MobileLogin_Login.action';
        //var KeyData = {"Mobilephone":"18758347377", "Password":"123", "OperationType":"A"};
//        var KeyData = {"Mobilephone":"18758327123", "Password":"a", "OperationType":"A"};
        var KeyData = {"Mobilephone":"18815288493", "Password":"123", "OperationType":"A"};
        PublicInfoP.loadInfo(Url, KeyData)
            .then(function (CacheData) {
                //加载
                $scope.info = CacheData[0];
                window.localStorage.setItem("mUuid", CacheData[0].mUuid);
                window.localStorage.setItem("role", CacheData[0].role);
                window.localStorage.setItem("userName", CacheData[0].userName);
                $rootScope.Constant.mUuid = window.localStorage.getItem("mUuid");
                $rootScope.Constant.sysUser = window.localStorage.getItem("userName");
                location.href="index.html";
            }, function (reason) {
                $scope.info = {
                    userName: 'a',
                    role: 'b'
                };
            });
    });
