angular.module('cYongBao', [])
    .controller('YRootCtrl', function($scope, $rootScope, $ionicSlideBoxDelegate,$state){
        $scope.jsonData = {};
        $scope.$on('$ionicView.beforeEnter', function(){
            try {
                jwGobal.jsHideOrShowNavIcon(true);
                jwGobal.jsHideMenu();
                jwGobal.jsHideMainMenu();
                jwGobal.jsSetTitle("甬宝快递");
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
        $scope.showInfo = function (pageName,uuid,flag) {
            var theFlag = flag || "";
            if (theFlag === "")
                $state.go(pageName, {id: uuid});
            else
                $state.go(pageName, {id: uuid, flag: theFlag});
        };
    })
    .controller('DJKJInfoCtrl', function ($scope) {

        })
    .controller('DQKJInfoCtrl', function ($scope) {

    })
    .controller('KJGZInfoCtrl', function ($scope) {

    })
    .controller('KJGZCheckInfoCtrl', function ($scope) {

    })
    .controller('KJCXInfoCtrl', function ($scope) {

    })
    .controller('WYJJInfoCtrl', function ($scope,$state) {
        $scope.showInfo = function (pageName,uuid,flag) {
            var theFlag = flag || "";
            if (theFlag === "")
                $state.go(pageName, {id: uuid});
            else
                $state.go(pageName, {id: uuid, flag: theFlag});
        };
    })
    .controller('ExpressChooseCtrl', function ($scope,$state) {
        $scope.showInfo = function (pageName,uuid,flag) {
            var theFlag = flag || "";
            if (theFlag === "")
                $state.go(pageName, {id: uuid});
            else
                $state.go(pageName, {id: uuid, flag: theFlag});
        };
    })
    .controller('changeSendPeopleMessageCtrl', function ($scope) {

    })
    .controller('changeGetPeopleMessageCtrl', function ($scope) {

    })
    .controller('FileInInfoCtrl', function ($scope, $stateParams, $rootScope, $state, $ionicPopover, $ionicSlideBoxDelegate, AlertP, PublicInfoP, PublicFnF, TreeData) {
        var uuid = $stateParams.id;
        var theFlag = $stateParams.flag;
        var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_detailFilein';
        var KeyData = {"uuid":uuid,"username":$rootScope.Constant.sysUser};
        PublicInfoP.loadInfo(Url, KeyData)
            .then(function (CacheData) {
                //加载
                $scope.info = CacheData[0];
                //显示原生按钮
                $scope.sendData = {
                    "ntko": [],
                    "file": []
                };
                var files, fileTemp, i;
                if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0) {
                    if($scope.info.LISTFILEZSNTKO.length > 0) {
                        files = [];
                        for(i=0;i<$scope.info.LISTFILEZSNTKO.length;i++) {
                            fileTemp = {
                                "name": $scope.info.LISTFILEZSNTKO[i].FILE_NAME,
                                "url": $scope.info.FILE_UPLOAD+"?fileName="+$scope.info.LISTFILEZSNTKO[i].FILE_NAME+"&file="+$scope.info.LISTFILEZSNTKO[i].FILE_SVAE_NAME,
                                "size": $scope.info.LISTFILEZSNTKO[i].FILE_SIZE || 0
                            };
                            files.push(fileTemp);
                        }
                        $scope.sendData.ntko = files;
                    }
                    if($scope.info.LISTFILE.length > 0) {
                        files = [];
                        for(i=0;i<$scope.info.LISTFILE.length;i++) {
                            fileTemp = {
                                "name": $scope.info.LISTFILE[i].FILE_NAME,
                                "url": $scope.info.FILE_UPLOAD+"?fileName="+$scope.info.LISTFILE[i].FILE_NAME+"&file="+$scope.info.LISTFILE[i].FILE_SVAE_NAME,
                                "size": $scope.info.LISTFILE[i].FILE_SIZE || 0
                            };
                            files.push(fileTemp);
                        }
                        $scope.sendData.file = files;
                    }
                    jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                }
                //意见
                $scope.textareaInfo = {
                    placeholder: '请输入',
                    model: '',
                    value: '',
                    isBack: false
                };
                var j, bn;
                $scope.ideas = [];
                for(i=0;i<CacheData[0].LISTNOTE.length;i++) {
                    bn = false;
                    for(j = 0;j<$scope.ideas.length;j++) {
                        if($scope.ideas[j].idea == CacheData[0].LISTNOTE[i].FIELD_NAME) {
                            $scope.ideas[j].ideas.push(CacheData[0].LISTNOTE[i]);
                            bn = true;
                            break;
                        }
                    }
                    if(!bn) {
                        $scope.ideas.push({
                            idea:CacheData[0].LISTNOTE[i].FIELD_NAME,
                            ideas:[CacheData[0].LISTNOTE[i]]
                        });
                    }
                }
                //审批
                $scope.ideaInfo = {id:"",name:"",content:"",contentBak:"", path:"",file:"",fileName:"",hasfile:false,delfile:false,flag:"0"};
                if(CacheData[0].LISTFIELD)
                    for(i=0;i<CacheData[0].LISTFIELD.length;i++)
                        if(CacheData[0].LISTFIELD[i].FLAG == '1'){
                            $scope.ideaInfo.id = CacheData[0].LISTFIELD[i].FIELD_ID;
                            $scope.ideaInfo.name = CacheData[0].LISTFIELD[i].FIELD_NAME;
                            $scope.ideaInfo.flag = '1';
                            if(CacheData[0].LISTNOTE)
                                for(j=0;j<CacheData[0].LISTNOTE.length;j++)
                                    if(CacheData[0].LISTNOTE[j].FIELD_ID == CacheData[0].LISTFIELD[i].FIELD_ID && CacheData[0].LISTNOTE[j].USERNAME == $rootScope.Constant.sysUser) {
                                        if(CacheData[0].LISTNOTE[j].NOTE) {
                                            $scope.ideaInfo.content = CacheData[0].LISTNOTE[j].NOTE.substring(0,CacheData[0].LISTNOTE[j].NOTE.indexOf("\n    （"));
                                            $scope.ideaInfo.contentBak = CacheData[0].LISTNOTE[j].NOTE.substring(0,CacheData[0].LISTNOTE[j].NOTE.indexOf("\n    （"));
                                        } else {
                                            $scope.ideaInfo.content = "";
                                            $scope.ideaInfo.contentBak = "";
                                        }
                                        if(CacheData[0].LISTNOTE[j].NOTEFILE) {
                                            $scope.ideaInfo.file = CacheData[0].LISTNOTE[j].NOTEFILE;
                                            $scope.ideaInfo.hasfile = true;
                                        }
                                        break;
                                    }
                            //手签必要信息
                            $scope.signatureInfo = {
                                "flowid": CacheData[0].FLOW_ID,
                                //"curtacheid": CacheData[0],
                                "tacheid": CacheData[0].TACHE_ID,
                                "fielded": CacheData[0].LISTFIELD[i].FIELD_ID,
                                "moduleid": CacheData[0].MODULE_ID,
                                "uuid": CacheData[0].UUID,
                                "username": $scope.$root.Constant.sysUser
                            };
                            break;
                        }
                //获取年份的select options列表
                $scope.selYearList = getYearOpt();
                //标题
                PublicFnF.getItem($scope,CacheData,'FILEIN_TITLE','title');
                //登记人
                PublicFnF.getItem($scope,CacheData,'REGISTERED_USER','registeredUser');
                //登记日期
                PublicFnF.getItem($scope,CacheData,'REGISTERED_TIME','registeredTime');
                //收文类型
                PublicFnF.getItem($scope,CacheData,'FILEIN_TYPE','typeid');
                //收文年份
                PublicFnF.getItem($scope,CacheData,'FILEIN_YEAR','year');
                //收文流水号
                PublicFnF.getItem($scope,CacheData,'FILEIN_SERIAL','serial');
                //收文日期
                PublicFnF.getItem($scope,CacheData,'FILEIN_TIME','fileintime','date');
                //缓急
                PublicFnF.getItem($scope,CacheData,'URGENCY','urgency');
                //来文文号
                PublicFnF.getItem($scope,CacheData,'SYMBOL','symbol');
                //来文年份
                PublicFnF.getItem($scope,CacheData,'SYMBOL_YEAR','symbolyear');
                //来文编号
                PublicFnF.getItem($scope,CacheData,'SYMBOL_NO','symbolno');
                //来文机关
                PublicFnF.getItem($scope,CacheData,'AUTHORITIES','authorities');
                //办理期限
                PublicFnF.getItem($scope,CacheData,'DEADLINE','deadline','date');
                //页数
                PublicFnF.getItem($scope,CacheData,'PAGES','pages','number');
                //备注
                PublicFnF.getItem($scope,CacheData,'REMARKS','remarks');
                //份数
                PublicFnF.getItem($scope,CacheData,'COPIES','copies','number');
                //当前环节名称
                $scope.tacheName = CacheData[0].TACHE_NAME;
                //按钮
                $scope.buttons = {};
                if(CacheData[0].LISTBUTTON)
                    for(i=0;i<CacheData[0].LISTBUTTON.length;i++) {
                        $scope.buttons[CacheData[0].LISTBUTTON[i].BUTTONID] = true;
                    }
                //提交页面
                if($scope.buttons.next) {
                    var nextUrl = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_nextFilein';
                    var nextKeyData = {"uuid":uuid,"username":$rootScope.Constant.sysUser};
                    PublicInfoP.loadInfo(nextUrl, nextKeyData)
                        .then(function (CacheData) {
                            $scope.tacheInfo = CacheData[0];
                            if(CacheData[0].LIST_NEXT) {
                                $scope.nextTache = CacheData[0].LIST_NEXT;
                                $scope.selInfo = {
                                    "nextTacheSelected":CacheData[0].LIST_NEXT[0].NEXT_TACHE_ID,
                                    "selUser":"",
                                    "selSys":""
                                };
                                $scope.isMustSend = false;
                                var vm1 = $scope.vm1 = {};
                                var vm2 = $scope.vm2 = {};
                                $ionicPopover.fromTemplateUrl('../common/page/jw-flow-next.html', {
                                    scope: $scope
                                }).then(function(popover) {
                                    $scope.popoverNext = popover;
                                });
                                $scope.openNextPopover = function($event) {
                                    $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "popoverNext.hidden"});
                                    $scope.popoverNext.show($event);
                                    jwGobal.jsSetTitle("流程处理");
                                    jwGobal.jsHideMenu();
                                };
                                $scope.closeNextPopover = function() {
                                    $scope.$root.jwGolbalHistory.pop();
                                    jwGobal.jsSetTitle("收文管理");
                                    if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                                        jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                                    $scope.popoverNext.hide();
                                };
                                $scope.$on('$destroy', function() {
                                    $scope.popoverNext.remove();
                                });
                                $scope.$on('popoverNext.hidden', function(e,d) {
                                    if(d == "goback")
                                        $scope.closeNextPopover();
                                });
                            }
                        }, function (reason) {
                            AlertP.alert(reason);
                        });
                }
                //退回页面
                if($scope.buttons.withdramal) {
                    var backUrl = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_BackFilein';
                    var backKeyData = {"uuid":uuid};
                    PublicInfoP.loadInfo(backUrl, backKeyData)
                        .then(function (CacheData) {
                            $scope.backInfo = CacheData[0];
                            $ionicPopover.fromTemplateUrl('../common/page/jw-flow-back.html', {
                                scope: $scope
                            }).then(function(popover) {
                                $scope.popoverBack = popover;
                            });
                            $scope.openBackPopover = function($event) {
                                $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "popoverBack.hidden"});
                                $scope.popoverBack.show($event);
                                jwGobal.jsSetTitle("退回处理");
                                jwGobal.jsHideMenu();
                            };
                            $scope.closeBackPopover = function() {
                                $scope.$root.jwGolbalHistory.pop();
                                jwGobal.jsSetTitle("收文管理");
                                if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                                    jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                                $scope.popoverBack.hide();
                            };
                            $scope.$on('$destroy', function() {
                                $scope.popoverBack.remove();
                            });
                            $scope.$on('popoverBack.hidden', function(e,d) {
                                if(d == "goback")
                                    $scope.closeBackPopover();
                            });
                        }, function (reason) {
                            AlertP.alert(reason);
                        });
                }
                //催办页面
                if($scope.buttons.urge) {
                    var urgeUrl = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_urge';
                    var urgeKeyData = {"uuid":uuid};
                    PublicInfoP.loadInfo(urgeUrl, urgeKeyData)
                        .then(function (CacheData) {
                            $scope.urgeInfo = CacheData;
                            $scope.info.allUrge = false;
                            $ionicPopover.fromTemplateUrl('../common/page/jw-flow-urge.html', {
                                scope: $scope
                            }).then(function(popover) {
                                $scope.popoverUrge = popover;
                            });
                            $scope.openUrgePopover = function($event) {
                                $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "popoverUrge.hidden"});
                                $scope.popoverUrge.show($event);
                                jwGobal.jsSetTitle("收文催办");
                                jwGobal.jsHideMenu();
                            };
                            $scope.closeUrgePopover = function() {
                                $scope.$root.jwGolbalHistory.pop();
                                jwGobal.jsSetTitle("收文管理");
                                if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                                    jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                                $scope.popoverUrge.hide();
                            };
                            $scope.$on('$destroy', function() {
                                $scope.popoverUrge.remove();
                            });
                            $scope.$on('popoverUrge.hidden', function(e,d) {
                                if(d == "goback")
                                    $scope.closeUrgePopover();
                            });
                        }, function (reason) {
                            AlertP.alert(reason);
                        });
                }
                //历史审批页面
                if($scope.info.LISTNOTE.length > 0) {
                    $ionicPopover.fromTemplateUrl('../common/page/jw-history-idea.html', {
                        scope: $scope
                    }).then(function(popover) {
                        $scope.popoverHistory = popover;
                    });
                    $scope.openHistoryPopover = function($event) {
                        $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "popoverHistory.hidden"});
                        $scope.popoverHistory.show($event);
                        jwGobal.jsSetTitle("历史审批");
                    };
                    $scope.closeHistoryPopover = function() {
                        $scope.$root.jwGolbalHistory.pop();
                        jwGobal.jsSetTitle("收文管理");
                        if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                            jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                        $scope.popoverHistory.hide();
                    };
                    $scope.$on('$destroy', function() {
                        $scope.popoverHistory.remove();
                    });
                    $scope.$on('popoverHistory.hidden', function(e,d) {
                        if(d == "goback")
                            $scope.closeHistoryPopover();
                    });
                }
                //常用短语
                if($scope.ideaInfo.flag == '1') {
                    var ideaUrl = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_listPhrase';
                    var ideaKeyData = {"username":$rootScope.Constant.sysUser};
                    PublicInfoP.loadInfo(ideaUrl, ideaKeyData)
                        .then(function (CacheData) {
                            $scope.ideaListInfo = CacheData;
                            $ionicPopover.fromTemplateUrl('../common/page/jw-idea.html', {
                                scope: $scope
                            }).then(function(popover) {
                                $scope.popoverIdea = popover;
                            });
                            $scope.openIdeaPopover = function($event) {
                                $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "popoverIdea.hidden"});
                                jwGobal.jsSetTitle("常用意见");
                                $scope.popoverIdea.show($event);
                                try {
                                    $ionicSlideBoxDelegate.update();
                                    $ionicSlideBoxDelegate.enableSlide(false);
                                } catch(err) {
                                    console.log(err);
                                }
                            };
                            $scope.closeIdeaPopover = function() {
                                $scope.$root.jwGolbalHistory.pop();
                                jwGobal.jsSetTitle("收文管理");
                                if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                                    jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                                $scope.popoverIdea.hide();
                            };
                            $scope.$on('$destroy', function() {
                                $scope.popoverIdea.remove();
                            });
                            $scope.$on('popoverIdea.hidden', function(e,d) {
                                if(d == "goback")
                                    $scope.closeIdeaPopover();
                            });
                        }, function (reason) {
                            AlertP.alert(reason);
                        });
                }

                //附件列表
                if($scope.info.LISTFILE.length > 0 || $scope.info.LISTFILEZSNTKO.length > 0) {
                    $scope.openFile = function (id,name) {
                        var url = $scope.info.FILE_UPLOAD + "?fileName=" + name + "&file=" + id;
                        jwGobal.jsShouldDownLoadFile(url);
                    };
                    $ionicPopover.fromTemplateUrl('../common/page/jw-file-list.html', {
                        scope: $scope
                    }).then(function(popover) {
                        $scope.filelistpopover = popover;
                    });
                    $scope.openFileListPopover = function($event) {
                        $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "filelistpopover.hidden"});
                        $scope.filelistpopover.show($event);
                    };
                    $scope.closeFileListPopover = function() {
                        $scope.$root.jwGolbalHistory.pop();
                        if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                            jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
                        $scope.filelistpopover.hide();
                    };
                    $scope.$on('$destroy', function() {
                        $scope.filelistpopover.remove();
                    });
                    $scope.$on('filelistpopover.hidden', function(e,d) {
                        if(d == "goback")
                            $scope.closeFileListPopover();
                    });
                    $scope.$on('filelistpopover.showPage', function(e,d) {
                        if(d == "open") {
                            $scope.openFileListPopover();
                            jwGobal.jsHideMenu();
                        }
                    });
                } else {
                    //隐藏附件列表按钮
                    jwGobal.jsHideMenu();
                }
            }, function (reason) {
                $scope.title = {
                    content: '',
                    isEdit: false
                };
                AlertP.alert(reason);
            });

        $scope.$on('get-signature', function(e,d) {
            var data = JSON.parse(d);
            $scope.ideaInfo.path = data.path;
            $scope.ideaInfo.file = data.data;
            $scope.ideaInfo.fileName = DateFormat.prototype.format(new Date(), "yyyyMMddHHmmss") + $scope.$root.Constant.sysUser + ".png";
        });

        //下一步
        $scope.goNext = function() {
            if ($scope.ideaInfo.flag == "1" && $scope.ideaInfo.content == "" && $scope.ideaInfo.file == "") {
                AlertP.alert("审批意见不能为空！");
            } else {
                var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_nextFilein';
                var KeyData = {"uuid":uuid,"username":$rootScope.Constant.sysUser};
                PublicInfoP.loadInfo(Url, KeyData)
                    .then(function (CacheData) {
                        if(CacheData[0]['5'] == '最后一步!') {
                            var endUrl = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
                            var endKeyData = {
                                "uuid":uuid,
                                "username":$rootScope.Constant.sysUser,
                                "moduleid":$scope.info.MODULE_ID,
                                "flowid":$scope.info.FLOW_ID,
                                "tacheid":$scope.info.TACHE_ID,
                                "procesStatus":'*'
                            };
                            $scope.updateItems(endKeyData);
                            PublicInfoP.loadInfo(endUrl, endKeyData)
                                .then(function (CacheData) {
                                    if(CacheData[0].VALUE == '记录更新成功!')
                                        AlertP.alert('文件已结束流程！',function(res) {
                                            $rootScope.jwAddItem.push({'uuid':uuid,'datafield':'ywc','addfield':theFlag});
                                            $rootScope.jwRemoveItem.push({'uuid':uuid,'datafield':'db'});
                                            $rootScope.jwRemoveItem.push({'uuid':uuid,'datafield':'zb'});
                                            $state.go('FileInList');
                                        });
                                    else
                                        AlertP.alert("文件提交失败！");
                                }, function (reason) {
                                    AlertP.alert(reason);
                                });
                        } else if(CacheData[0]['4'] == '还需要其他人审核!') {
                            var otherUrl = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
                            var otherKeyData = {
                                "uuid":uuid,
                                "username":$rootScope.Constant.sysUser,
                                "moduleid":$scope.info.MODULE_ID,
                                "flowid":$scope.info.FLOW_ID,
                                "tacheid":$scope.info.TACHE_ID,
                                "procesStatus":'5'
                            };
                            $scope.updateItems(otherKeyData);
                            PublicInfoP.loadInfo(otherUrl, otherKeyData)
                                .then(function (CacheData) {
                                    if(CacheData[0].VALUE == '记录更新成功!')
                                        AlertP.alert('已保存，还需要其他人审核!',function(res) {
                                            $rootScope.jwRemoveItem.push({'uuid':uuid,'datafield':'db'});
                                            $state.go('FileInList');
                                        });
                                    else
                                        AlertP.alert("文件提交失败！");
                                }, function (reason) {
                                    AlertP.alert(reason);
                                });
                        } else {
                            $scope.openNextPopover();
                        }
                    }, function (reason) {
                        AlertP.alert(reason);
                    });
            }
        };

        //保存
        $scope.gotoSave = function() {
            if ($scope.ideaInfo.flag == "1" && $scope.ideaInfo.content == "" && $scope.ideaInfo.file == "") {
                AlertP.alert("审批意见不能为空！");
            } else {
                var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
                var KeyData = {
                    "uuid":uuid,
                    "username":$rootScope.Constant.sysUser,
                    "moduleid":$scope.info.MODULE_ID,
                    "flowid":$scope.info.FLOW_ID,
                    "tacheid":$scope.info.TACHE_ID
                };
                $scope.updateItems(KeyData);
                PublicInfoP.loadInfo(Url, KeyData)
                    .then(function (CacheData) {
                        if(CacheData[0].VALUE == '记录更新成功!')
                            AlertP.alert('文件保存成功！',function(res) {
                                $state.go('FileInList');
                            });
                        else
                            AlertP.alert("文件保存失败！");
                    }, function (reason) {
                        AlertP.alert(reason);
                    });
            }
        };

        //退回
        $scope.gotoBack = function() {
            if(!$scope.backInfo.backSelected)
                AlertP.alert('请选择退回环节！');
            else {
                var backUsers = $scope.backInfo.backSelected.TACHE_TRANSACTOR;
                backUsers = backUsers.replace(/,/g, "+");
                var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
                var KeyData = {
                    "uuid":uuid,
                    "username":$rootScope.Constant.sysUser,
                    "moduleid":$scope.info.MODULE_ID,
                    "flowid":$scope.info.FLOW_ID,
                    "tacheid":$scope.info.TACHE_ID,
                    "nexttacheid":$scope.backInfo.backSelected.TACHE_ID,
                    "tacheClrList":backUsers,
                    "procesStatus":'2'
                };
                if($scope.backInfo.withdramalopinion)
                    KeyData.withdramalopinion = $scope.backInfo.withdramalopinion;
                $scope.updateItems(KeyData);
                PublicInfoP.loadInfo(Url, KeyData)
                    .then(function (CacheData) {
                        if(CacheData[0].VALUE == '记录更新成功!')
                            AlertP.alert('文件退回成功！',function(res) {
                                $scope.$root.jwGolbalHistory.pop();
                                if(CacheData[0].FLAG != "1")
                                    $rootScope.jwRemoveItem.push({'uuid':uuid,'datafield':'db'});
                                $state.go('FileInList');
                            });
                        else
                            AlertP.alert("文件退回失败！");
                    }, function (reason) {
                        AlertP.alert(reason);
                    });
            }
        };

        //收回
        $scope.gotoRecovery = function() {
            var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
            var KeyData = {
                "uuid":uuid,
                "username":$rootScope.Constant.sysUser,
                "moduleid":$scope.info.MODULE_ID,
                "flowid":$scope.info.FLOW_ID,
                "tacheid":$scope.info.TACHE_ID,
                "procesStatus":'3'
            };
            $scope.updateItems(KeyData);
            PublicInfoP.loadInfo(Url, KeyData)
                .then(function (CacheData) {
                    if(CacheData[0].VALUE == '记录更新成功!')
                        AlertP.alert('文件收回成功！',function(res) {
                            $rootScope.jwAddItem.push({'uuid':uuid,'datafield':'db','addfield':theFlag});
                            $state.go('FileInList');
                        });
                    else
                        AlertP.alert("文件收回失败！");
                }, function (reason) {
                    AlertP.alert(reason);
                });
        };

        //催办
        $scope.gotoUrge = function() {
            var urgeUsers = '';
            for(var i=0;i<$scope.urgeInfo.length;i++) {
                if($scope.urgeInfo[i].checked) {
                    if(urgeUsers == '')
                        urgeUsers = $scope.urgeInfo[i].USERSYSNAME;
                    else
                        urgeUsers = urgeUsers + "+" + $scope.urgeInfo[i].USERSYSNAME;
                }
            }
            if(urgeUsers == '')
                AlertP.alert('请选择未办理人员！');
            else {
                var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
                var KeyData = {
                    "uuid":uuid,
                    "username":$rootScope.Constant.sysUser,
                    "moduleid":$scope.info.MODULE_ID,
                    "flowid":$scope.info.FLOW_ID,
                    "tacheid":$scope.info.TACHE_ID,
                    "nexttacheid":$scope.info.TACHE_ID,
                    "tacheClrList":urgeUsers,
                    "procesStatus":'4'
                };
                $scope.updateItems(KeyData);
                PublicInfoP.loadInfo(Url, KeyData)
                    .then(function (CacheData) {
                        if(CacheData[0].VALUE == '记录更新成功!')
                            AlertP.alert('文件催办成功！',function(res) {
                                $scope.$root.jwGolbalHistory.pop();
                                $state.go('FileInList');
                            });
                        else
                            AlertP.alert("文件催办失败！");
                    }, function (reason) {
                        AlertP.alert(reason);
                    });
            }
        };

        //催办全选
        $scope.AllUrge = function() {
            for(var i=0;i<$scope.urgeInfo.length;i++) {
                $scope.urgeInfo[i].checked = $scope.info.allUrge;
            }
        };

        //生成选择树
        $scope.createTree = function() {
            var i, j, bn;
            for(i = 0;i<$scope.nextTache.length;i++) {
                if($scope.nextTache[i].NEXT_TACHE_ID == $scope.selInfo.nextTacheSelected) {
                    var dataDept = $scope.nextTache[i].LIST_DEPTUSER;
                    var dataRole = $scope.nextTache[i].LIST_ROLEUSER;
                    break;
                }
            }
            //按部门分类
            vm1 = $scope.vm1 = {};
            vm1.selcount = 0;
            vm1.selInfo = "";
            vm1.selValue = "";
            vm1.countries = [{
                label: '全部备选人员',
                lastnode:false,
                items: []
            }];
            for(i = 0;i<dataDept.length;i++) {
                bn = false;
                for(j = 0;j<vm1.countries[0].items.length;j++) {
                    if(dataDept[i].DEPT_ID == vm1.countries[0].items[j].deptid) {
                        vm1.countries[0].items[j].items.push(dataDept[i]);
                        bn = true;
                        break;
                    }
                }
                if(!bn) {
                    vm1.countries[0].items.push({
                        deptid:dataDept[i].DEPT_ID,
                        deptname:dataDept[i].DEPT_NAME,
                        deptsort:dataDept[i].DEPT_SORT,
                        lastnode:false,
                        items:[dataDept[i]]
                    });
                }
            }
            vm1.countries[0].items.sort(getSortFun('asc', 'deptsort'));
            vm1.tree = new TreeData(vm1.countries,vm1);
            //按角色分类
            vm2 = $scope.vm2 = {};
            vm2.selcount = 0;
            vm2.selInfo = "";
            vm2.selValue = "";
            vm2.countries = [{
                label: '全部备选人员',
                lastnode:false,
                items: []
            }];
            for(i = 0;i<dataRole.length;i++) {
                bn = false;
                for(j = 0;j<vm2.countries[0].items.length;j++) {
                    if(dataRole[i].ROLE_ID == vm2.countries[0].items[j].roleid) {
                        vm2.countries[0].items[j].items.push(dataRole[i]);
                        bn = true;
                        break;
                    }
                }
                if(!bn) {
                    vm2.countries[0].items.push({
                        roleid:dataRole[i].ROLE_ID,
                        rolename:dataRole[i].ROLE_NAME,
                        //rolesort:dataTemp[i].ROLE_SORT,
                        lastnode:false,
                        items:[dataRole[i]]
                    });
                }
            }
            vm2.tree = new TreeData(vm2.countries,vm2);
        };

        //选择处理人
        $scope.changeCheck = function(vm,obj) {
            if(obj.checked)
                obj.checked = false;
            else
                obj.checked = true;
            vm.tree.check(obj, obj.checked);
        };

        //打开组织树选择人员
        $scope.strSel = function() {
            $scope.createTree();
            $scope.openPopover();
        };

        //清空选择人员
        $scope.clearSel = function() {
            $scope.selInfo.selUser = '';
            $scope.selInfo.selSys = '';
        };

        //数据同步
        $scope.dataSynchronization = function(vm1,vm2) {
            if(vm1) {
                vm1.tree.getItemInfo();
                vm2.selInfo = vm1.selInfo;
                vm2.selValue = vm1.selValue;
            }
        };

        //选择同步
        $scope.selSynchronization = function(vm) {
            if(vm) {
                vm.tree.clear();
                var values = vm.selValue.split(',');
                vm.tree.setItemInfo(values);
            }
        };

        //同步汇总
        $scope.allSynchronization = function(vm1,vm2) {
            $scope.dataSynchronization(vm1,vm2);
            $scope.selSynchronization(vm2);
        };

        //人员选择确定
        $scope.determine = function(vm) {
            vm.tree.getItemInfo();
            $scope.selInfo.selUser = vm.selInfo;
            $scope.selInfo.selSys = vm.selValue;
            $scope.closePopover();
            jwGobal.jsHideMenu();
        };

        //选择常用意见
        /*$scope.sleIdea = function() {
            for(var i=0;i<$scope.ideaListInfo.length;i++) {
                if($scope.ideaListInfo[i].checked == true) {
                    if($scope.ideaInfo.content == "")
                        $scope.ideaInfo.content = $scope.ideaListInfo[i].PHRASE_BODY;
                    else
                        $scope.ideaInfo.content = $scope.ideaInfo.content + "\n" + $scope.ideaListInfo[i].PHRASE_BODY;
                }
            }
            $scope.closeIdeaPopover();
        };*/
        $scope.sleIdea = function(obj) {
            if($scope.ideaInfo.content == "")
                $scope.ideaInfo.content = obj.PHRASE_BODY;
            else
                $scope.ideaInfo.content = $scope.ideaInfo.content + "\n" + obj.PHRASE_BODY;
            $scope.closeIdeaPopover();
        };

        //下一步确认
        $scope.gotoNext = function() {
            var users = $scope.selInfo.selSys;
            if(users == '')
                AlertP.alert('请选择下一环节处理人员！');
            else {
                users = users.replace(/,/g, "+");
                var isMustSend = $scope.isMustSend?1:0;
                var Url = PublicFnF.getRootUrl() + 'jwmagic/serviceClient/wgjAjax_updateFilein';
                var KeyData = {
                    "uuid":uuid,
                    "username":$rootScope.Constant.sysUser,
                    "moduleid":$scope.info.MODULE_ID,
                    "flowid":$scope.info.FLOW_ID,
                    "tacheid":$scope.info.TACHE_ID,
                    "nexttacheid":$scope.selInfo.nextTacheSelected,
                    "tacheClrList":users,
                    "isMustSend":isMustSend,
                    "procesStatus":'1'
                };
                $scope.updateItems(KeyData);
                PublicInfoP.loadInfo(Url, KeyData)
                    .then(function (CacheData) {
                        if(CacheData[0].VALUE == '记录更新成功!')
                            AlertP.alert('文件提交成功！',function(res) {
                                $scope.$root.jwGolbalHistory.pop();
                                if(users.indexOf($rootScope.Constant.sysUser) < 0)
                                    $rootScope.jwRemoveItem.push({'uuid':uuid,'datafield':'db'});
                                $state.go('FileInList');
                            });
                        else
                            AlertP.alert("文件提交失败！");
                    }, function (reason) {
                        AlertP.alert(reason);
                    });
            }
        };

        //各字段传参
        $scope.updateItems = function(KeyData) {
            PublicFnF.updateItem($scope,KeyData,'title');
            PublicFnF.updateItem($scope,KeyData,'typeid');
            PublicFnF.updateItem($scope,KeyData,'year');
            PublicFnF.updateItem($scope,KeyData,'serial');
            PublicFnF.updateItem($scope,KeyData,'urgency');
            PublicFnF.updateItem($scope,KeyData,'fileintime','date');
            PublicFnF.updateItem($scope,KeyData,'deadline','date');
            PublicFnF.updateItem($scope,KeyData,'pages','number');
            PublicFnF.updateItem($scope,KeyData,'copies','number');
            PublicFnF.updateItem($scope,KeyData,'symbol');
            PublicFnF.updateItem($scope,KeyData,'symbolyear');
            PublicFnF.updateItem($scope,KeyData,'symbolno');
            PublicFnF.updateItem($scope,KeyData,'authorities');
            PublicFnF.updateItem($scope,KeyData,'remarks');
            if($scope.ideaInfo.flag == '1') {
                if($scope.ideaInfo.content != "" && $scope.ideaInfo.content != $scope.ideaInfo.contentBak) {
                    KeyData.fielded = $scope.ideaInfo.id;
                    var nowDT = DateFormat.prototype.format(new Date(), "yyyy-MM-dd HH:mm:ss");
                    KeyData.note = $scope.ideaInfo.content + "\n    （" + $rootScope.Constant.chUser + "      " + nowDT.substring(0,nowDT.lastIndexOf(":")) + "）";
                }
                if($scope.ideaInfo.path != "") {
                    KeyData.fielded = $scope.ideaInfo.id;
                    KeyData.tacheid = $scope.info.TACHE_ID;
                    KeyData.fileName = $scope.ideaInfo.fileName;
                    //KeyData.myfile = $scope.ideaInfo.path;
                    KeyData.myfile = $scope.ideaInfo.file;
                    KeyData.enctype = "multipart/form-data";
                } else {
                    if($scope.ideaInfo.delfile)
                        KeyData.isdeletejpg = "0";
                }
            }
        };

        //开始编辑textarea
        $scope.startEdit = function($event) {
            var str = $event.target.outerHTML;
            str = str.substring(str.indexOf('ng-model="')+10);
            str = str.substring(0,str.indexOf('"'));
            $scope.textareaInfo.placeholder = $event.target.placeholder;
            $scope.textareaInfo.value = $event.target.value;
            $scope.textareaInfo.model = str;
            $scope.openEditPopover();
        };

        //编辑textarea结束
        $scope.endEdit = function() {
            var temp = $scope.textareaInfo.model.split('.');
            $scope[temp[0]][temp[1]] = $scope.textareaInfo.value;
            $scope.closeEditPopover();
        };

        //textarea编辑
        $ionicPopover.fromTemplateUrl('../common/page/jw-textarea-edit.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.editpopover = popover;
        });
        $scope.openEditPopover = function($event) {
            $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "editpopover.hidden"});
            $scope.editpopover.show($event);
            $scope.editpopover.el.querySelector("textarea").focus();
            if ($scope.popoverBack) {
                if ($scope.popoverBack.isShown()) {
                    $scope.popoverBack.hide();
                    $scope.textareaInfo.isBack = true;
                }
            }
            jwGobal.jsHideMenu();
        };
        $scope.closeEditPopover = function() {
            $scope.$root.jwGolbalHistory.pop();
            if($scope.info.LISTFILEZSNTKO.length > 0 || $scope.info.LISTFILE.length > 0)
                jwGobal.jsShowMenu(1,JSON.stringify($scope.sendData));
            $scope.editpopover.hide();
            if ($scope.textareaInfo.isBack == true) {
                $scope.popoverBack.show();
                $scope.textareaInfo.isBack = false;
            }
        };
        $scope.$on('$destroy', function() {
            $scope.editpopover.remove();
        });
        $scope.$on('editpopover.hidden', function(e,d) {
            if(d == "goback")
                $scope.closeEditPopover();
        });

        //手写数据清除
        $scope.delSignature = function() {
            $scope.ideaInfo.path = "";
            $scope.ideaInfo.file = "";
            $scope.ideaInfo.fileName = "";
            jwGobal.jsClearSign();
            if($scope.ideaInfo.hasfile)
                $scope.ideaInfo.delfile = true;
        };

        //人员选择
        $ionicPopover.fromTemplateUrl('../common/page/jw-select-person.html', {
            scope: $scope
        }).then(function(popover) {
            $scope.popover = popover;
        });
        $scope.openPopover = function($event) {
            //jwGobal.jsShowMenu(1,"callBack");
            $scope.$root.jwGolbalHistory.push({"type": "popover", "name": "popover.hidden"});
            $scope.popover.show($event);
            try {
                $ionicSlideBoxDelegate.update();
                $ionicSlideBoxDelegate.enableSlide(false);
            } catch(err) {
                console.log(err);
            }
        };
        $scope.closePopover = function() {
            $scope.$root.jwGolbalHistory.pop();
            jwGobal.jsSetTitle("流程处理");
            $scope.popover.hide();
        };
        $scope.$on('$destroy', function() {
            $scope.popover.remove();
        });
        $scope.$on('popover.hidden', function(e,d) {
            if(d == "goback")
                $scope.closePopover();
        });
        $scope.$on('$ionicView.beforeEnter', function(){
            try {
                jwGobal.jsSetTitle("收文管理");
            } catch(err) {
                console.log(err);
            }
        });
    });
