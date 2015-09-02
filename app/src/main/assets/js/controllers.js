angular.module("jwMobile.controllers", [])
    .controller("jwListCtrl", function ($scope, $attrs, $location, $state, PopupF, PublicListP, PublicFnF) {
        if(!$scope.jsonData)
            $scope.jsonData = {};
        $scope.moreDataCanBeLoaded = true;
        $scope.loadMore = null;
        if ($attrs.jwPageSize)
            PublicListP.setPageSize($attrs.jwPageSize);
        //下拉刷新
        $scope.doRefresh = function () {
            $scope.loadMore(true);
        };
        var dataField = $attrs.jwField || "default";
        //加载更多
        $scope.loadMore = function (IfRefresh) {
            if ($scope.moreDataCanBeLoaded || IfRefresh) {
                if ($location.search().flag && $scope.$root.TheConstant){
                    if ($scope.$root.TheConstant.flag) {
                        if($location.search().flag != $scope.$root.TheConstant.flag)
                            IfRefresh = true;
                        $scope.$root.TheConstant.flag = $location.search().flag;
                    }
                }
                var Url = PublicFnF.getRootUrl() + $attrs.jwPath;
                if ($attrs.jwRoot)
                    Url = PublicFnF.getRootUrl($attrs.jwRoot) + $attrs.jwPath;
                var KeyData = {};
                if ($attrs.jwKey)
                    KeyData = JSON.parse($attrs.jwKey);
                var delCount = 0;
                if ($scope.$root.jwRemoveCount[dataField]) {
                    if (parseInt($scope.$root.jwRemoveCount[dataField]) > 0) {
                        delCount = parseInt($scope.$root.jwRemoveCount[dataField]);
                        $scope.$root.jwRemoveCount[dataField] = "0";
                    }
                }
                var pageSize = PublicListP.getPageSize();
                var forCount = parseInt((delCount+pageSize-1)/pageSize)+1;
                for(var i= 0;i<forCount;i++) {
                    PublicListP.loadMoreV(IfRefresh, Url, KeyData, dataField,delCount)
                        .then(function (CacheData) {
                            var len = CacheData.length;
                            if (angular.isUndefined(CacheData[0])) {
                                if (!$scope.jsonData[dataField])
                                    $scope.jsonData[dataField] = [];
                                $scope.moreDataCanBeLoaded = false;
                            } else
                                $scope.jsonData[dataField] = CacheData;
                        }, function (reason) {
                            if (!$scope.jsonData[dataField])
                                $scope.jsonData[dataField] = [];
                            $scope.moreDataCanBeLoaded = false;
                            PopupF.alert("提示", "template", reason, 3000, "确定");
                        }).finally(function () {
                            if (IfRefresh)
                                $scope.moreDataCanBeLoaded = true;
                            $scope.$broadcast("scroll.infiniteScrollComplete");
                            $scope.$broadcast("scroll.refreshComplete");
                        });
                    if(delCount % pageSize == 0)
                        delCount = delCount - pageSize;
                    else
                        delCount = delCount - delCount % pageSize;
                }
            }
        };
        //跳转至详细页
        $scope.showInfo = function (pageName,uuid,flag) {
            var theFlag = flag || "";
            if (theFlag === "")
                $state.go(pageName, {id: uuid});
            else
                $state.go(pageName, {id: uuid, flag: theFlag});
        };
        //Real页面跳转
        $scope.jumpTo = function (pageName, uuid, flag) {
            var theUuid = uuid || "";
            var theFlag = flag || "";
            if (pageName == "ExpressChoose") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "JjInfo.html", "pageNum": "3", "title": theFlag, "params": {"id": theUuid, "flag": theFlag}, "transferData": [], "hasCallbackData": false});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "JjInfo.html", "pageNum": "3", "title": theFlag, "params": {"id": theUuid, "flag": theFlag}, "transferData": [], "hasCallbackData": false});
                } else {
                    window.location.href = "JjInfo.html?id=" + theUuid + "&flag=" + theFlag;
                }
            }
            else if (pageName == "DJKJInfo") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "DjInfo.html", "pageNum": "4", "title": null, "params": {"id": theUuid}, "transferData": [], "hasCallbackData": false});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "DjInfo.html", "pageNum": "4", "title": "等待寄件", "params": {"id": theUuid}, "transferData": [], "hasCallbackData": false});
                } else {
                    window.location.href = "DjInfo.html?id=" + theUuid;
                }
            }
            else if (pageName == "DQKJInfo") {
                if(ionic.Platform.isIOS()) {
                    jwGobal.jsShowPage({"destUrl": "DqInfo.html", "pageNum": "5", "title": null, "params": {"id": theUuid}, "transferData": [], "hasCallbackData": false});
                } else if (ionic.Platform.isAndroid()) {
                    jwGobal.jsShowPage({"destUrl": "DqInfo.html", "pageNum": "5", "title": "待取快件", "params": {"id": theUuid}, "transferData": [], "hasCallbackData": true});
                } else {
                    window.location.href = "DqInfo.html?id=" + theUuid;
                }
            }
        };
        //数据增加
        $scope.$on("addItem-controllers", function(e, d) {
            if(d.datafield == dataField) {
                if($scope.jsonData[d.datafield]) {
                    for(var i=0;i<$scope.jsonData[d.addfield].length;i++) {
                        if($scope.jsonData[d.addfield][i].UUID == d.uuid) {
                            $scope.jsonData[d.datafield].unshift($scope.jsonData[d.addfield][i]);
                            break;
                        }
                    }
                }
            }
        });
        //数据删除
        $scope.$on("delItem-controllers", function(e, d) {
            if(d.datafield == dataField) {
                if($scope.jsonData[d.datafield]) {
                    for(var i=0;i<$scope.jsonData[d.datafield].length;i++) {
                        if($scope.jsonData[d.datafield][i].UUID == d.uuid) {
                            $scope.jsonData[d.datafield].splice(i,1);
                            if(!$scope.$root.jwRemoveCount[d.datafield])
                                $scope.$root.jwRemoveCount[d.datafield] = "1";
                            else
                                $scope.$root.jwRemoveCount[d.datafield] = (parseInt($scope.$root.jwRemoveCount[d.datafield]) + 1).toString();
                            break;
                        }
                    }
                }
            }
        });
    });
