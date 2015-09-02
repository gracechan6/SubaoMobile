angular.module("starter", ["ionic", "jwMobile.serivces"])
    .run(function ($ionicPlatform, $rootScope) {
        $ionicPlatform.ready(function () {
            //Hide the accessory bar by default (remove this to show the accessory bar above the keyboard for form inputs)
            if (window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            }
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }
        });
        //通用常量
        $rootScope.Constant = {
            mUuid: "",
//            rootUrl: "http://192.168.0.50:8080/"
            rootUrl: "http://121.40.250.221:8080/"
        };
        //接口返回数据结构相关
        $rootScope.DataStructure = {
            rootType: "Obj",
            content: "returnData",
            success: "success"
        };
        //账户信息获取
        try {
            if (getQueryString("Muuid") != null)
                window.localStorage.setItem("mUuid", getQueryString("Muuid"));
            $rootScope.Constant.mUuid = window.localStorage.getItem("mUuid");
        } catch(err) {
            console.log(err);
        }
        //列表数据变动相关
        $rootScope.jwRemoveItem = [];
        $rootScope.jwAddItem = [];
        $rootScope.jwRemoveCount = {};
        //弹出框历史记录
        $rootScope.jwGolbalHistory = [];
        //用于数据传递
        $rootScope.backData = {
            "destUrl": null,
            "pageNum": null,
            "params": null,
            "transferData": [],
            "hasCallbackData": false
        };
        //获取URL参数
        $rootScope.tmpSearch = {};
        if (window.location.search != "") {
            var options = window.location.search.substring(1).split("&");
            for (var i = 0; i < options.length; i++) {
                var option = options[i].split("=");
                $rootScope.tmpSearch[option[0]] = option[1];
            }
        }
    })
    .config(function ($httpProvider) {
        //用于POST请求request payload转form data
        $httpProvider.defaults.transformRequest = function (obj) {
            var str = [];
            for (var p in obj) {
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        };
        $httpProvider.defaults.headers.post = {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    });
