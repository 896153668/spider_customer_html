(function () {
    // 网页打点

    var test_stat = "http://111.231.105.166/increase/track/funnel/forweb/batch";
    var formal_stat = "http://compass.skieer.com/increase/track/funnel/forweb/batch";
    var currentHref = window.location.href;
    /*打点项*/
    /*
       web_plan 的type为 26
       web_plan_about  的type为 27
       web_plan_pay_choose  的type为 28
       web_plan_pay_loaded  的type为 29
       web_plan_trial_choose  的type为 30
       web_plan_pay_config  的type为 31
       web_plan_pay_submit  的type为 32
       web_plan_pay_result  的type为 33
       */
      var getQuery = function (name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return unescape(r[2]);
        }
        return null;
    }
    var matchUrlLocation = function () {
        var test = false; // 修改状态
        var bzy_url = test ? "192.168.5.24" : "www.bazhuayu.com";
        currentHref === bzy_url > -1 && sessionStorage.setItem('entrance', 'main_page')
    }
    var STAT = (() => {
        var timeObj = {};
        var statSetting = {
            // 共有属性 --------------------------------------------------------------------------
            data: {
                "source": "WEB",
                "success": true,
                "userId":$(".user-name").data("userid"),
                "browser": window.navigator.userAgent
            },
            type: 26, // 这个数据是哪个打点项的打点，这个对应关系见下面
        }
        return {
            statTime: (type) => {
                var time = +new Date()
                timeObj[type] = time;
            },
            mergeSetting: (data) => {
                var newObj = JSON.parse(JSON.stringify(statSetting))
                Object.assign(newObj.data, data.data)
                Object.assign(newObj, data.type)
                return [newObj]
            },
            encrypt: (data) => {
                //    加密逻辑
            },
            appendForm: (data) => {
                var form = new FormData();
                form.append("data", JSON.stringify(data));
                form.append("code", "origin");
                form.append("sync", "true");
                return form
            },
            timeLog: () => {
                return timeObj
            },
            mainEntrance: () => {
                return { entrance: sessionStorage.getItem('entrance') ? sessionStorage.getItem('entrance') : 'other' }
            }
        }
    })();

    var getCookie = function (name) {
        var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        if (arr = document.cookie.match(reg))
            return decodeURIComponent(arr[2]);
        else
            return null;
    }
    var statXhr = function (formData, fn) {
        $.ajax({
            method: 'POST',
            crossDomain: true,
            url: formal_stat,
            data: formData,
            // xhrFields: {
            //     withCredentials: true
            // },
            processData: false,
            contentType: false,
            success: function (data) {
                fn && fn(data)
            }
        })
    }

    var planPage = function () {
        /* 进入页面 */
        sessionStorage.setItem('entrance', 'pay_main_page')
        window.onload = function () {
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: entrance,
                type: {
                    type: 26
                }
            })))
        }
        /* 版本 */
        $('.plan-top .heading .btn').click(function () {
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: {
                    introductType: $(this).data("type")
                },
                type: {
                    type: 27
                }
            })))
        })
        /* 申请试用 */
        $('.pack-sq a').click(function () {
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: {
                    entrance: "pay_main_page",
                    tryType: $(this).data("type")
                },
                type: {
                    type: 30
                }
            })))
        })
        /* 购买页面 立即购买按钮 */
        $('.package-buy a').click(function () {
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: {
                    entrance: "pay_main_page",
                    planType: $(this).data("type")
                },
                type: {
                    type: 28
                }
            })))
        })

    }
    var readyPay = function () {
        var planTypeMapper = {
            "购买八爪鱼采集器专业版": "profession",
            "购买八爪鱼采集器旗舰版": "ultimate",
            "购买任务控制AP": "api",
            "购买验证码": "captcha",
            "购买优质代理IP": "proxy_ip"
        }
        window.onload = function () {
            var productName = $('#productName').text().trim();
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: {
                    planType: planTypeMapper[productName],
                    entrance:entrance.entrance
                },
                type: {
                    type: 29
                }
            })))
        }
        /* 去支付 */
        $('input.btn-Confirm').click(function () {
            var productName = $('#productName').text().trim();
            var monthes = $("form[action='/buy/Ultimate'] #qtyList").val() || $("form[action='/buy/Profession'] #qtyList").val();
            var captchaCounts = $("form[action='/buy/Captcha'] #afterCount").text().trim();
            var priceTotal = $('#total').text().trim();
            var apiCounts = $("form[action='/buy/AdvancedApi'] #qtyList").val();
            var ipCounts = $("form[action='/buy/AdvanceIpProxydApi'] #afterCount").text().trim();
            var cpName = $('#yhjboxs:visible').find("#couponList").val()
            var statData = {};
            statData['planType'] = planTypeMapper[productName];
            monthes && (statData['quality'] = monthes);
            captchaCounts && (statData['quality'] = captchaCounts);
            apiCounts && (statData['quality'] = apiCounts);
            ipCounts && (statData['quality'] = ipCounts);
            priceTotal && (statData['amount'] = priceTotal);
            cpName && (statData['couponName'] = cpName);
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data:statData,
                type:{
                    type:31
                }
            })))
        })
    }
    var payPage = function () {
        /* 确认支付 */
        
        $('input.btn-Confirm').click(function () {
            var payWay = $(".nav-tabs >li.active").find("a").attr('href').replace('#', '');
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: {
                    orderId: getQuery("tradeId"),
                    payWay
                },
                type: {
                    type: 32
                }
            })))
        })
        $('#cp_body_Pay_5_offlineTab').click(function () {
            statXhr(STAT.appendForm(STAT.mergeSetting({
                data: {
                    orderId: getQuery("tradeId"),
                    payWay:'offline'
                },
                type: {
                    type: 32
                }
            })))
        })
    }
    matchUrlLocation();
    var entrance = getQuery("entrance") ? {"entrance" : getQuery("entrance")} : STAT.mainEntrance()
    if (currentHref.indexOf('/buy') > -1) {
        readyPay();
    } else if (currentHref.indexOf('/plan') > -1) {
        planPage();

    } else if (currentHref.indexOf('/pay') > -1) {
        payPage();
    }
})();