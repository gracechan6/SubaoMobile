angular.module("jwMobile.directives", [])
    .directive("script", function() {
        /**
         * [即时载入js]
         * */
        return {
            restrict: "E",
            scope: false,
            link: function(scope, elem, attr) {
                if (attr.type==="text/javascript-lazy") {
                    var s = document.createElement("script");
                    s.type = "text/javascript";
                    var src = elem.attr("src");
                    if(src!==undefined) {
                        s.src = src;
                    } else {
                        s.text = elem.text();
                    }
                    document.head.appendChild(s);
                    elem.remove();
                }
            }
        };
    })
    .directive("jwList",function(){
        /**
         * [列表]属性说明：
         * jw-path：获取数据接口的路径，必须配置
         * jw-template：指令内容模板路径，必须配置，若不配置则为默认模板
         * jw-key：获取数据的附加参数，若没有可不配置
         * jw-page-size：设置每次加载条数，若不配置则默认为10条
         * jw-root：获取数据接口的根链接，如无特殊可不配置
         * jw-field：多页签页用，区分页签，就一个列表的页面不必配置
         * */
        return {
            restrict: "E",
            replace: true,
            scope: true,
            controller: "jwListCtrl",
            templateUrl: function(elem, attr){
                return attr.jwTemplate || "../page/jw-list.html";
            }
        }
    })
    .directive("jwItem",function(){
        /**
         * [字段]属性说明：
         * jw-type：字段类别，内容为input类别、select
         * jw-template：指令内容模板路径，一般不配置，不配置则根据jw-type获取默认模板
         * jw-name：字段名称
         * jw-placeholder：输入内容提示信息,date类型、select不需要这个属性
         * jw-bind：双向绑定的作用域属性
         * jw-last: 是否最后一个，配置为是，不配置为否
         * */
        return {
            restrict: "E",
            replace: true,
            scope: {
                itemBind: "=jwBind"
            },
            controller: "jwItemCtrl",
            templateUrl: function(elem, attr){
                var strTemplate;
                switch (attr.jwType) {
                    case "text":
                        strTemplate = "../page/jw-item-text.html";
                        break;
                    case "number":
                        strTemplate = "../page/jw-item-number.html";
                        break;
                    case "date":
                        strTemplate = "../page/jw-item-date.html";
                        break;
                    case "select":
                        strTemplate = "../page/jw-item-select.html";
                        break;
                    default :
                        strTemplate = "../page/jw-item.html";
                }
                return attr.jwTemplate || strTemplate;
            }
        }
    })
    .directive("jwFile",function(){
        /**
         * [文号]属性说明：
         * jw-template：指令内容模板路径，一般不配置，不配置则获取默认模板
         * jw-name：字段名称
         * jw-type：双向绑定的作用域属性(文种)
         * jw-year：双向绑定的作用域属性(年份)
         * jw-num：双向绑定的作用域属性(编号)
         * jw-year-opt: 双向绑定的作用域属性(年份选项)
         * jw-last: 是否最后一个，配置为是，不配置为否
         * */
        return {
            restrict: "E",
            replace: true,
            scope: {
                fileType: "=jwType",
                fileYear: "=jwYear",
                fileNum: "=jwNum",
                selYearList: "=jwYearOpt"
            },
            controller: "jwFileCtrl",
            templateUrl: function(elem, attr){
                return attr.jwTemplate || "../page/jw-file.html";
            }
        }
    })
    .directive("signature", function() {
        /**
         * [手写签批]
         * jw-template：指令内容模板路径，一般不配置，不配置则获取默认模板
         * jw-data：双向绑定的作用域属性
         * */
        return {
            restrict: "E",
            replace:false,
            scope: {data: "=jwData"},
            templateUrl: function(elem, attr){
                return attr.jwTemplate || "../page/jw-signature.html";
            },
            controller:"signatureCtrl"
        };
    })
    .directive("ngAutoExpand", function() {
        /**
         * [高度自适应textarea]
         * jw-padding：padding值，单位“px”，默认4
         * jw-line-hight：line-height值，单位“px”，默认20
         * jw-time：延迟时间，单位毫秒，默认200
         * */
        return {
            restrict: "A",
            link: function( $scope, elem, attrs) {
                var padding = attrs.jwPadding || 4;
                var lineHight = attrs.jwLineHight || 20;
                var theTime = attrs.jwTime || 200;
                setInterval( function() {
                    var element = elem[0];
                    element.style.height = "0px";
                    var height = element.scrollHeight;
                    if (height < lineHight)
                        height = lineHight + padding * 2;
                    element.style.height = height + "px";
                }, theTime)
            }
        };
    });
