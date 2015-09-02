/**
 * 获取url参数值
 */
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
        return decodeURI(r[2]);
    return null;
}

/**
 * 取得当前位置经纬度
 */
function getLocation() {
    var x = document.getElementById("CurrentPosition");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition,showError);
    } else {
        x.innerHTML = "当前浏览器不支持地理定位！";
    }
}
function showPosition(position) {
    var x = document.getElementById("CurrentPosition");
    //纬度latitude,经度longitude
    x.innerHTML = position.coords.latitude + "," + position.coords.longitude;
}
function showError(error) {
    var x = document.getElementById("CurrentPosition");
    switch(error.code) {
        case error.PERMISSION_DENIED:
            x.innerHTML = "没有权限使用地理定位！";
            break;
        case error.POSITION_UNAVAILABLE:
            x.innerHTML = "无法确定设备的位置！";
            break;
        case error.TIMEOUT:
            x.innerHTML = "请求超时！";
            break;
        case error.UNKNOWN_ERROR:
            x.innerHTML = "未知错误！";
            break;
    }
}

/**
 * 将全角字符当两个字符计算
 */
String.prototype.getBytes = function() {
    var cArr = this.match( /[\u4e00-\u9fa5|，。；“”！·￥（）【】—、《》：‘’　]/ig );
    return this.length + ( cArr == null ? 0 : cArr.length);
};

/**
 * json对象数组按对象属性排序
 * 参数：
 * order：排序方式，‘asc’顺序，else倒序(‘desc’)；
 * sortBy：用于排序的属性
 */
function getSortFun(order, sortBy) {
    var ordAlpah = (order == "asc") ? ">" : "<";
    var sortFun = new Function("a", "b", "return a." + sortBy + ordAlpah + "b." + sortBy + "?1:-1");
    return sortFun;
}

/**
 * 定义年份的options
 */
function getYearOpt(){
    var yearJson = [];
    for(var i = 0;i < 50;i++)
        yearJson.push({label:(1999+i)+"年", value:(1999+i), NAME:(1999+i)+"", UUID:(1999+i)+""});
    return yearJson;
}

/**
 * 定义月份的options
 */
function getMonthOpt(){
    return [
        {label:"1月", name:"一月", value:1},
        {label:"2月", name:"二月", value:2},
        {label:"3月", name:"三月", value:3},
        {label:"4月", name:"四月", value:4},
        {label:"5月", name:"五月", value:5},
        {label:"6月", name:"六月", value:6},
        {label:"7月", name:"七月", value:7},
        {label:"8月", name:"八月", value:8},
        {label:"9月", name:"九月", value:9},
        {label:"10月", name:"十月", value:10},
        {label:"11月", name:"十一月", value:11},
        {label:"12月", name:"十二月", value:12}
    ];
}

/**
 * 定义星期的options
 */
function getDayOpt(){
    return [
        {label:"星期日", value:0},
        {label:"星期一", value:1},
        {label:"星期二", value:2},
        {label:"星期三", value:3},
        {label:"星期四", value:4},
        {label:"星期五", value:5},
        {label:"星期六", value:6}
    ];
}

/**
 * 用于显示元素
 */
function objShow(objId) {
    document.getElementById(objId).style.display = "block";
}

/**
 * 用于隐藏元素
 */
function objHide(objId) {
    document.getElementById(objId).style.display = "none";
}

/**
 * 用于月历（日程安排）
 */
//判断闰年
function runNian(_year) {
    if(_year%400 === 0 || (_year%4 === 0 && _year%100 !== 0) )
        return true;
    else
        return false;
}
//判断某年某月的1号是星期几
function getFirstDay(_year,_month) {
    var allDay = 0, y = _year-1, i = 1;
    allDay = y + Math.floor(y/4) - Math.floor(y/100) + Math.floor(y/400) + 1;
    for ( ; i<_month; i++) {
        switch (i) {
            case 1: allDay += 31; break;
            case 2:
                if(runNian(_year)) { allDay += 29; }
                else { allDay += 28; }
                break;
            case 3: allDay += 31; break;
            case 4: allDay += 30; break;
            case 5: allDay += 31; break;
            case 6: allDay += 30; break;
            case 7: allDay += 31; break;
            case 8: allDay += 31; break;
            case 9: allDay += 30; break;
            case 10: allDay += 31; break;
            case 11: allDay += 30; break;
            case 12: allDay += 31; break;
        }
    }
    return allDay%7;
}
//获取某年某月天数
function getMonthDaysCount(_year,_month) {
    var count;
    switch (_month) {
        case 1: count = 31; break;
        case 2:
            if(runNian(_year)) { count = 29; }
            else { count = 28; }
            break;
        case 3: count = 31; break;
        case 4: count = 30; break;
        case 5: count = 31; break;
        case 6: count = 30; break;
        case 7: count = 31; break;
        case 8: count = 31; break;
        case 9: count = 30; break;
        case 10: count = 31; break;
        case 11: count = 30; break;
        case 12: count = 31; break;
    }
    return count;
}
//获取某年某月上一月年份
function getLastMonthYear(_year,_month) {
    if(_month == 1)
        return _year-1;
    else
        return _year;
}
//获取某年某月下一月年份
function getNextMonthYear(_year,_month) {
    if(_month == 12)
        return _year+1;
    else
        return _year;
}
//获取某年某月上一月天数
function getLastMonthDaysCount(_year,_month) {
    var lyear, lmonth;
    if (_month == 1) {
        lyear = _year - 1;
        lmonth = 12;
    } else {
        lyear = _year;
        lmonth = _month - 1;
    }
    return getMonthDaysCount(lyear,lmonth);
}
//获取用于月历显示的json数据
function getCalendar(_year,_month,firstDay) {
    var i = 0,
        monthDay = 0,
        showStr = "",
        classname = "",
        lastYear = getLastMonthYear(_year,_month),
        lastMonth = _month- 1,
        nextYear = getNextMonthYear(_year,_month),
        nextMonth = _month+ 1,
        lastMonthCount = getLastMonthDaysCount(_year,_month),
        today = new Date();

    if(lastMonth == 0)
        lastMonth = 12;
    if(nextMonth == 13)
        nextMonth = 1;

    //月份的天数
    monthDay = getMonthDaysCount(_year,_month);
    //输出日历表格，这部分因结构而异
    showStr = "[[";
    //当月第一天前的空格
    for (i=1; i<=firstDay; i++)
        showStr += "{year:"+lastYear+",month:"+lastMonth+",day:"+ (lastMonthCount - firstDay + i) +"},";
    //显示当前月的天数
    for (i=1; i<=monthDay; i++) {
        //当日的日期
        firstDay = (firstDay+1)%7;
        if(firstDay == 0)
            showStr += "{year:"+_year+",month:"+_month+",day:"+i+"}";
        else
            showStr += "{year:"+_year+",month:"+_month+",day:"+i+"},";
        if(firstDay === 0 && i !== monthDay)
            showStr += "],[";
    }
    //剩余的空格
    if(firstDay!==0) {
        var x = 1;
        for (i=firstDay; i<7; i++) {
            if(i==6)
                showStr += "{year:"+nextYear+",month:"+nextMonth+",day:"+x+"}";
            else
                showStr += "{year:"+nextYear+",month:"+nextMonth+",day:"+x+"},";
            x += 1;
        }
    }
    showStr +="]]";
    return eval (showStr);
}
/**
 * 以上用于月历（日程安排）
 */
