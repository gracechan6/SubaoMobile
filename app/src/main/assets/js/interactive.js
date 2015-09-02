/**
 * 与原生交互接口
 * jwGobal函数说明
 * jwGobal.getUserName 供原生调用来获取登录用户名
 * jwGobal.complete 供原生调用来完成并返回
 * jwGobal.transferData 供原生调用来传递数据
 * jwGobal.jsGetIMEI 调用原生获取设备号
 * jwGobal.jsGoBack 调用原生返回上一页面
 * jwGobal.jsShowPage 调用原生打开新页面
 */
var jwGobal = [];
jwGobal.getUserName = function (data) {
    console.log("进入 getUserName")
    var userInfo = JSON.parse(JSON.stringify(data));
    window.location.href = "index.html?Muuid=" + userInfo.Muuid;
};
jwGobal.complete = function () {
    console.log("已经进入jwGobal.complete1")
    var $body = angular.element(document.body);
    var $rootScope = $body.scope().$root;
    $rootScope.$apply(function () {
        if ($rootScope.jwGolbalHistory.length > 0) {
            if ($rootScope.jwGolbalHistory[$rootScope.jwGolbalHistory.length - 1].type == "popover") {
                //存在popover窗口，只关闭popover
                $rootScope.$broadcast($rootScope.jwGolbalHistory[$rootScope.jwGolbalHistory.length - 1].name, 'goSubmit');
            }
        } else {
            $rootScope.$broadcast("goBackSave");
        }
    });
};
jwGobal.transferData = function (data) {
    if(data=="[]"){
       return;
    }
    console.log("已经进入jwGobal.transferData"+JSON.stringify(data))
    data=JSON.parse(JSON.stringify(data));
    var $body = angular.element(document.body);
    var $rootScope = $body.scope().$root;
    if (data[0].key == "params") {
        for(var obj in data[0].data)
            $rootScope.tmpSearch[obj] = data[0].data[obj];
        $rootScope.$broadcast("getParamsData");
    } else {
        console.log("我就是要用这个方法"+"getBackData")
        $rootScope.$broadcast("getBackData",data);
    }
};
jwGobal.jsGetIMEI = function () {
    try {
        if(ionic.Platform.isIOS()) {
            //调用ios函数获得设备IMEI值
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('jsGetIMEI', '', function(response) {
                    console.log('html5 jsGetIMEI:'+response);
                });
            });
        } else if (ionic.Platform.isAndroid()) {
            //调用android函数获得设备IMEI值
            return jsInterface.jsGetIMEI();
        } else {
            //console.log("不是iOS或Android系统！");
        }
    } catch(err) {
        console.log(err);
    }
};
jwGobal.jsGoBack = function (data) {
    console.log("进入jwGobal.jsGoBack"+JSON.stringify(data));
    try {
        if(ionic.Platform.isIOS()) {
            //调用ios函数返回上一页面
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler('jsGoBack', data, function(response) {
                });
            });
        } else if (ionic.Platform.isAndroid()) {
            //调用android函数返回上一页面
            console.log("进入jwGobal.jsGoBack")
            return jsInterface.jsGoBack(JSON.stringify(data));
        } else {
            //console.log("不是iOS或Android系统！");
        }
    } catch(err) {
        console.log(err);
    }
};
jwGobal.jsShowPage = function (data) {
    //data键说明：
    //url：要显示的页面地址
    //pageNum：页面编号
    //pageNum编号说明：0，快件查询；2，快递公司列表；3，寄件详情；4，待寄包裹；5，待取包裹；6，编辑地址；7，编辑寄件人；8，选择历史收件人
    console.log(typeof o)
    try {
        if(ionic.Platform.isIOS()) {
            //调用ios函数
            connectWebViewJavascriptBridge(function(bridge) {
                bridge.callHandler("jsShowPage", {"data": data}, function(response) {
                });
            });
        } else if (ionic.Platform.isAndroid()) {
            //调用android函数
            console.log("jsShowPage andrion"+data)
            jsInterface.jsShowPage(JSON.stringify(data));
        } else {
            //console.log("不是iOS或Android系统！");
        }
    } catch(err) {
        console.log(err);
    }
};

/**
 * 调用该函数实现与ios的数据交互
 * connectWebViewJavascriptBridge函数说明
 * bridge.init初始化对象，只需首次调用一次
 * bridge.registerHandler注册供原生调用的函数
 * bridge.callHandler调用原生函数，可得到返回值
 * bridge.send向原生发送消息
 */
function connectWebViewJavascriptBridge(callback) {
    if (window.WebViewJavascriptBridge) {
        callback(WebViewJavascriptBridge)
    } else {
        document.addEventListener('WebViewJavascriptBridgeReady', function() {
            callback(WebViewJavascriptBridge)
        }, false)
    }
}
connectWebViewJavascriptBridge(function(bridge) {
    bridge.init(function(message, responseCallback) {
        var data = { 'Javascript Responds':'Wee!' };
        responseCallback(data);
    });
    bridge.registerHandler('jwGobal.getUserName', jwGobal.getUserName);
    bridge.registerHandler('complete', jwGobal.complete);
    bridge.registerHandler('transferData', jwGobal.transferData);
});
