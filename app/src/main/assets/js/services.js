var PublicSerivce = angular.module("jwMobile.serivces", []);
//弹出框
PublicSerivce.factory("PopupF", function ($ionicPopup, $timeout) {
    return {
        //alert提示框
        alert: function(title, type, content, showTime, okText, okType, subTitle, obj, cssClass) {
            var theOptions;
            if (type == "template") {
                theOptions = {
                    title: title,
                    template: content,
                    okText: okText || "",
                    okType: okType || "",
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            } else {
                theOptions = {
                    title: title,
                    templateUrl: content,
                    okText: okText || "",
                    okType: okType || "",
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            }
            var alertPopup = $ionicPopup.alert(theOptions);
            alertPopup.then(obj || function(res) {});
            if (showTime != 0) {
                $timeout(function () {
                    alertPopup.close();
                }, showTime);
            }
        },
        //confirm对话框
        confirm: function(title, type, content, showTime, okText, okType, cancelText, cancelType, subTitle, obj, cssClass) {
            var theOptions;
            if (type == "template") {
                theOptions = {
                    title: title,
                    template: content,
                    okText: okText || "",
                    okType: okType || "",
                    cancelText: cancelText || "",
                    cancelType: cancelType || "",
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            } else {
                theOptions = {
                    title: title,
                    templateUrl: content,
                    okText: okText || "",
                    okType: okType || "",
                    cancelText: cancelText || "",
                    cancelType: cancelType || "",
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            }
            var confirmPopup = $ionicPopup.confirm(theOptions);
            confirmPopup.then(obj || function(res) {});
            if (showTime != 0) {
                $timeout(function () {
                    confirmPopup.close();
                }, showTime);
            }
        },
        //prompt对话框
        prompt: function(title, type, content, showTime, okText, okType, cancelText, cancelType, inputType, inputPlaceholder, subTitle, obj, cssClass) {
            var theOptions;
            if (type == "template") {
                theOptions = {
                    title: title,
                    template: content,
                    okText: okText || "",
                    okType: okType || "",
                    cancelText: cancelText || "",
                    cancelType: cancelType || "",
                    inputType: inputType || "",
                    inputPlaceholder: inputPlaceholder || "",
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            } else {
                theOptions = {
                    title: title,
                    templateUrl: content,
                    okText: okText || "",
                    okType: okType || "",
                    cancelText: cancelText || "",
                    cancelType: cancelType || "",
                    inputType: inputType || "",
                    inputPlaceholder: inputPlaceholder || "",
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            }
            var promptPopup = $ionicPopup.prompt(theOptions);
            promptPopup.then(obj || function(res) {});
            if (showTime != 0) {
                $timeout(function () {
                    promptPopup.close();
                }, showTime);
            }
        },
        //show对话框
        show: function(title, type, content, showTime, scope, buttons, subTitle, obj, cssClass) {
            var theOptions;
            if (type == "template") {
                theOptions = {
                    title: title,
                    template: content,
                    scope: scope,
                    buttons: buttons,
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            } else {
                theOptions = {
                    title: title,
                    templateUrl: content,
                    scope: scope,
                    buttons: buttons,
                    subTitle: subTitle || "",
                    cssClass: cssClass || ""
                }
            }
            var showPopup = $ionicPopup.show(theOptions);
            showPopup.then(obj || function(res) {});
            if (showTime != 0) {
                $timeout(function () {
                    showPopup.close();
                }, showTime);
            }
        }
    }
});
//通用函数
PublicSerivce.factory("PublicFnF", function ($rootScope) {
    return {
        //取得当前位置经纬度
        getCurrentPosition: function() {
            $rootScope.Constant.returnJson = {};
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    //纬度
                    $rootScope.Constant.returnJson.latitude = position.coords.latitude;
                    //经度
                    $rootScope.Constant.returnJson.longitude = position.coords.longitude;
                },function(error) {
                    switch(error.code) {
                        case error.PERMISSION_DENIED:
                            $rootScope.Constant.returnJson.errStr = "没有权限使用地理定位！";
                            break;
                        case error.POSITION_UNAVAILABLE:
                            $rootScope.Constant.returnJson.errStr = "无法确定设备的位置！";
                            break;
                        case error.TIMEOUT:
                            $rootScope.Constant.returnJson.errStr = "请求超时！";
                            break;
                        case error.UNKNOWN_ERROR:
                            $rootScope.Constant.returnJson.errStr = "未知错误！";
                            break;
                    }
                });
            } else
                $rootScope.Constant.returnJson.errStr = "当前浏览器不支持地理定位！";
        },
        //获取根URL
        getRootUrl: function(strRootUrl) {
            return strRootUrl || $rootScope.Constant.rootUrl;
        },
        //获取详细页字段json数据
        getItem: function($scope,items,itemName,type,keyName) {
            var valueType = type || "text";
            var isEdit = false;
            if(items[0].LISTFIELD)
                for(var i=0;i<items[0].LISTFIELD.length;i++)
                    if(items[0].LISTFIELD[i].FILEID == itemName){
                        isEdit = true;
                        break;
                    }
            var theValue;
            switch(valueType) {
                case "number":
                    if(items[0][itemName] == '')
                        theValue = NaN;
                    else
                        theValue = parseInt(items[0][itemName]);
                    break;
                case "date":
                    theValue = new Date(items[0][itemName]);
                    break;
                default:
                    theValue = items[0][itemName];
            }
            var keyName = keyName || itemName;
            $scope[keyName] = {
                valueRel: theValue,
                valueBak: theValue,
                content: theValue,
                isEdit: isEdit
            };
            if(items[0][itemName + "ID"]) {
                $scope[keyName].valueRel = items[0][itemName + "ID"];
                $scope[keyName].valueBak = items[0][itemName + "ID"];
            }
            if(isEdit)
                if(items[0].LISTFIELD[i].LIST)
                    $scope[keyName].selList = items[0].LISTFIELD[i].LIST;
        },
        //判断详细页字段是否需要更新
        updateItem: function($scope,KeyData,keyName,type) {
            var valueType = type || "text";
            var theValue;
            if($scope[keyName].isEdit)
                if($scope[keyName].valueRel != $scope[keyName].valueBak) {
                    switch(valueType) {
                        case "date":
                            if($scope[keyName].valueRel+"" == "undefined")
                                theValue = "";
                            else
                                theValue = DateFormat.prototype.format($scope[keyName].valueRel,"yyyy-MM-dd");
                            break;
                        case "number":
                            if($scope[keyName].valueRel+"" == "NaN")
                                theValue = "";
                            else
                                theValue = $scope[keyName].valueRel;
                            break;
                        default:
                            theValue = $scope[keyName].valueRel;
                    }
                    KeyData[keyName] = theValue;
                }
        }
    }
});
//树
PublicSerivce.factory("TreeData", function() {
    "use strict";
    /**
     * Writer: 雪狼(From http://www.ngnice.com/)
     * Edit: Zhangt、Shengjj
     * 能够自动处理树形数据联动的类，子节点列表必须命名为items。同时，节点会被增加三个属性：checked, folded, intermediate
     * @example
     * var data = new TreeData([
     *   {
     *     label: 'a',
     *     items: [
     *       {
     *         label: 'a1'
     *       },
     *       {
     *         label: 'a2'
     *       }
     *     ]
     *   },
     *   {
     *     label: 'b',
     *     items: [
     *       {
     *         label: 'b1'
     *       },
     *       {
     *         label: 'b2'
     *       }
     *     ]
     *   }
     * ]);
     * @param tree {Array.<Object>}
     * @param cbIsSame {function(Object, Object):boolean}
     * @constructor
     */
    function TreeData(tree, vm, cbIsSame) {
        var _this = this;
        this.tree = tree;
        this.isSame = cbIsSame || function(item1, item2) { return item1 === item2 };

        /**
         * show
         */
        this.show = function(){
            this.getItemInfo();
            console.log(vm.selInfo);
        };

        /**
         *  设置已选
         */
        this._setItemInfo = function(item,values) {
            if(item.lastnode != false) {
                for(var i=0;i<values.length;i++) {
                    if(item.LABELVALUE == values[i]) {
                        this.check(item, true);
                        break;
                    }
                }
            }
            _.each(item.items, function(subItem) {
                _this._setItemInfo(subItem,values);
            });
        };

        this.setItemInfo = function(values){
            _.each(tree, function(subItem) {
                _this._setItemInfo(subItem,values);
            });
        };

        /**
         *  获取已选
         */
        this._getItemInfo = function(item){
            if(item.checked)
                if(item.lastnode != false)
                    if(item.LABEL!="")
                    {
                        if(vm.selInfo == "") {
                            vm.selInfo = item.LABEL;
                            vm.selValue = item.LABELVALUE;
                        }
                        else {
                            vm.selInfo = vm.selInfo + "," + item.LABEL;
                            vm.selValue = vm.selValue + "," + item.LABELVALUE;
                        }
                    }
            _.each(item.items, function(subItem) {
                _this._getItemInfo(subItem);
            });
        };

        this.getItemInfo = function(){
            vm.selInfo = "";
            vm.selValue = "";
            _.each(tree, function(subItem) {
                _this._getItemInfo(subItem);
            });
        };

        /**
         *  获取选择数
         */
        this._computeCount = function(item){
            if(item.checked)
                if(item.lastnode != false)
                    vm.selcount = vm.selcount + 1;
            _.each(item.items, function(subItem) {
                _this._computeCount(subItem);
            });
        };

        this.computeCount = function(){
            vm.selcount = 0;
            _.each(tree, function(subItem) {
                _this._computeCount(subItem);
            });
        };

        /**
         *  清除
         */
        this._clear = function(item){
            item.checked = false;
            _.each(item.items, function(subItem) {
                _this._clear(subItem);
            });
        };

        this.clear = function(){
            _.each(tree, function(subItem) {
                _this._clear(subItem);
            });
            vm.selcount = 0;
        };

        /**
         * 折叠/展开
         * @param item {Object}
         * @param folded
         * @private
         */
        this._fold = function(item, folded) {
            item.folded = folded;
        };
        /**
         * 折叠指定的节点
         * @param item {Object}
         */
        this.fold = function(item) {
            this._fold(item, true);
        };
        /**
         * 展开指定的节点
         * @param item {Object}
         */
        this.unfold = function(item) {
            this._fold(item, false);
        };
        /**
         * 切换节点的折叠状态
         * @param item {Object}
         */
        this.toggleFold = function(item) {
            this._fold(item, !item.folded);
        };
        /**
         * 检查指定节点的折叠状态
         * @param item {Object}
         * @returns {boolean}
         */
        this.isFolded = function(item) {
            return item.folded;
        };
        /**
         * 递归检查指定节点是否有选中状态的子节点，不检查当前节点状态
         * @param item {Object} 起始节点
         * @return {boolean}
         */
        this.hasCheckedChildren = function(item) {
            return !!_.find(item.items, function(subItem) {
                return subItem.checked || _this.hasCheckedChildren(subItem);
            });
        };
        /**
         * 递归检查指定节点是否有未选中状态的子节点，不检查当前节点状态
         * @param item {Object} 起始节点
         * @return {boolean}
         */
        this.hasUncheckedChildren = function(item) {
            return !!_.find(item.items, function(subItem) {
                return !subItem.checked || _this.hasUncheckedChildren(subItem);
            });
        };
        /**
         * 指定节点是否半选状态，但不检查当前节点。即：既有被选中的子节点，也有未选中的子节点
         * @param item {Object} 起始节点
         * @return {boolean}
         */
        this.hasSemiCheckedChildren = function(item) {
            return this.hasCheckedChildren(item) && this.hasUncheckedChildren(item);
        };
        /**
         * 当前节点是否半选状态，hasSemiCheckedChildren的别名
         * @param item {Object}
         * @returns {boolean}
         */
        this.isSemiChecked = function(item) {
            return this.hasSemiCheckedChildren(item);
        };
        /**
         * 更新item的父级节点，重新检查它们的checked和semiChecked状态
         * @param items
         * @param item
         * @private
         */
        this._updateParents = function(items, item) {
            _.each(items, function(subItem) {
                if(_this.hasChildren(subItem, item)) {
                    // 先要递归更新子级，否则中间节点的状态可能仍然处于选中状态，会影响当前节点的判断
                    _this._updateParents(subItem.items, item);
                    subItem.checked = _this.hasCheckedChildren(subItem);
                    subItem.semiChecked = _this.isSemiChecked(subItem);
                }
            });
        };
        this.updateChecked = function(item) {
            this._updateParents(this.tree, item);
        };
        /**
         * 选中/反选指定节点
         * @param item {Object}
         * @param checked {boolean}
         * @private
         */
        this._check = function(item, checked) {
            item.checked = checked;
            // 把当前节点的选中状态应用到所有下级
            _.each(item.items, function(subItem) {
                _this._check(subItem, checked);
            });
            // 自动更新所有上级的状态
            this._updateParents(this.tree, item);
        };
        this._find = function(items, item) {
            if (!items)
                return null;
            // 在子节点中查找
            for (var i = 0; i < items.length; ++i) {
                var subItem = items[i];
                // 如果找到了则直接返回
                if (this.isSame(subItem, item))
                    return subItem;
                // 否则递归查找
                var subResult = _this._find(subItem.items, item);
                if (subResult)
                    return subResult;
            }
            return null;
        };
        /**
         * 查找指定的节点，会使用cbIsSame参数
         * @param item
         * @returns {Object}
         */
        this.find = function(item) {
            return this._find(this.tree, item);
        };
        /**
         * parent及其子节点中有没有指定的subItem节点
         * @param parent {Object}
         * @param subItem {Object|Array}
         * @returns {boolean}
         */
        this.hasChildren = function(parent, subItem) {
            var subItems = _.isArray(subItem) ? subItem : [subItem];
            return !!_.find(subItems, function(subItem) {
                return _this._find(parent.items, subItem);
            });
        };
        /**
         * 选中节点
         * @param item {Object}
         * @param checked {boolean}
         */
        this.check = function(item, checked) {
            item = this.find(item);
            this._check(item, checked || angular.isUndefined(checked));
            this.computeCount();
        };
        /**
         * 反选节点
         * @param item {Object}
         */
        this.uncheck = function(item) {
            item = this.find(item);
            this._check(item, false);
        };
        /**
         * 切换节点的选中状态
         * @param item {Object}
         */
        this.toggleCheck = function(item) {
            item = this.find(item);
            this._check(item, !item.checked);
        };
        /**
         * 指定节点是否被选中
         * @param item {Object}
         * @returns {boolean}
         */
        this.isChecked = function(item) {
            item = this.find(item);
            return item.checked;
        };
    }
    return TreeData;
});
//列表
PublicSerivce.provider("PublicListP", function () {
    this.dataCache = [];
    this.pageSize = 10;
    this.currentPage = [];
    this.$get = function ($http, $q) {
        var self = this;
        return {
            setCurrentPage: function(value,dataField) {
                self.currentPage[dataField] = value;
            },
            setPageSize: function(value) {
                self.pageSize = value;
            },
            getPageSize: function() {
                return self.pageSize;
            },
            loadMoreV: function (IfRefresh, Url, KeyData, dataField, delCount) {
                if (IfRefresh) {
                    self.dataCache[dataField] = [];
                    self.currentPage[dataField] = 1;
                }
                var deferred = $q.defer();
                if(!self.currentPage[dataField])
                    self.currentPage[dataField] = 1;
                if(!self.dataCache[dataField])
                    self.dataCache[dataField] = [];
                var PostData;
                if(delCount != 0)
                    PostData = {PageSize: self.pageSize, PageNo: self.currentPage[dataField]-parseInt((delCount+self.pageSize-1)/self.pageSize)};
                else
                    PostData = {PageSize: self.pageSize, PageNo: self.currentPage[dataField]};
                for(var obj in KeyData)
                    PostData[obj] = KeyData[obj];
                $http.post(Url, PostData)
                    .success(function (response) {
                        if (response.returnData.length > 0) {
                            var hasRepeat = true;
                            var len = response.returnData.length;
                            var isRepeat, j;
                            for (var i = 0; i < len; i++) {
                                if (delCount % self.pageSize != 0) {
                                    if (i >= self.pageSize - (delCount % self.pageSize)) {
                                        if (hasRepeat) {
                                            isRepeat = false;
                                            for (j=0;j<self.dataCache[dataField].length;j++) {
                                                if (self.dataCache[dataField][j].uuid == response.returnData[i].uuid) {
                                                    isRepeat = true;
                                                    break;
                                                }
                                            }
                                            if (isRepeat)
                                                continue;
                                            else {
                                                hasRepeat = false;
                                                self.dataCache[dataField].push(response.returnData[i]);
                                            }
                                        } else
                                            self.dataCache[dataField].push(response.returnData[i]);
                                    }
                                } else {
                                    if (hasRepeat) {
                                        isRepeat = false;
                                        for (j=0;j<self.dataCache[dataField].length;j++) {
                                            if (self.dataCache[dataField][j].uuid == response.returnData[i].uuid) {
                                                isRepeat = true;
                                                break;
                                            }
                                        }
                                        if (isRepeat)
                                            continue;
                                        else {
                                            hasRepeat = false;
                                            self.dataCache[dataField].push(response.returnData[i]);
                                        }
                                    } else
                                        self.dataCache[dataField].push(response.returnData[i]);
                                }
                            }
                            if(delCount == 0)
                                self.currentPage[dataField] += 1;
                            deferred.resolve(self.dataCache[dataField]);
                        } else
                            deferred.resolve([]);
                    })
                    .error(function (request, errorId) {
                        deferred.reject("系统出错，错误编号："+errorId.toString());
                    });
                return deferred.promise;
            }
        }
    }
});
//详情
PublicSerivce.provider("PublicInfoP", function () {
    this.dataCache = [];
    this.$get = function ($http, $q) {
        var self = this;
        return {
            loadInfo: function (Url, KeyData) {
                var deferred = $q.defer();
                $http.post(Url, KeyData)
                    .success(function (response) {
                        if (response.returnData.length > 0) {
                            self.dataCache = response.returnData;
                            deferred.resolve(self.dataCache);
                        } else
                            deferred.resolve([]);
                    })
                    .error(function (request, errorId) {
                        deferred.reject("系统出错，错误编号："+errorId.toString());
                    });
                return deferred.promise;
            }
        }
    }
});
