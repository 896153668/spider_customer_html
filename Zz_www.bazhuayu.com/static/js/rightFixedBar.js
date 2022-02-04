/**
* JavaScript脚本实现回到页面顶部示例
* @param acceleration 速度
* @param stime 时间间隔 (毫秒)
**/
function gotoTop(acceleration, stime) {
    acceleration = acceleration || 0.1;
    stime = stime || 10;
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;
    var x3 = 0;
    var y3 = 0;
    if (document.documentElement) {
        x1 = document.documentElement.scrollLeft || 0;
        y1 = document.documentElement.scrollTop || 0;
    }
    if (document.body) {
        x2 = document.body.scrollLeft || 0;
        y2 = document.body.scrollTop || 0;
    }
    var x3 = window.scrollX || 0;
    var y3 = window.scrollY || 0;

    // 滚动条到页面顶部的水平距离
    var x = Math.max(x1, Math.max(x2, x3));
    // 滚动条到页面顶部的垂直距离
    var y = Math.max(y1, Math.max(y2, y3));

    // 滚动距离 = 目前距离 / 速度, 因为距离原来越小, 速度是大于 1 的数, 所以滚动距离会越来越小
    var speeding = 1 + acceleration;
    window.scrollTo(Math.floor(x / speeding), Math.floor(y / speeding));

    // 如果距离不为零, 继续调用函数
    if (x > 0 || y > 0) {
        var run = "gotoTop(" + acceleration + ", " + stime + ")";
        window.setTimeout(run, stime);
    }
}

function getCustomerServiceUrl() {
    $.post("/common/AjaxGetUserCustomerServiceUrl", function (r) {
        if (r && r.status == 1) {
            $("#chatFlag").data("mType", r.type)
            if (r.type == 0) {
                console.log("type0-" + r.type)
                $("#upgradeNow").attr("href", "/account/login");
                $("#upgradeNow").text("立即登录");
                //$("#consultNow").attr("href",r.url);
                $("#consultNow").attr("href", "javascript:void(0)");
				$("#consultNow").attr("target", "")
                $("#consultNow").attr("onClick", "consultBeforeBuy()")
                $("#consultNow").text("进行售前咨询");
                $("#detailTipContent").text("请登录后开启人工售后服务");
                var d = new Date();
                var nickName = d.getHours().toString() + d.getMinutes().toString() + "-" + d.getMilliseconds().toString();
                manualInitZhichi({ "uname": "(售前咨询)" + nickName }, 3)
            } else if (r.type == 1 || r.type == 2) {
                console.log("type-" + r.type)
                $("#upgradeNow").attr("href", "/plan");
                $("#upgradeNow").text("立即升级套餐");
				$("#consultNow").remove();
                $(".modal-footer div").css("textAlign", "right");
                // $("#consultNow").attr("href", "http://bbs.bazhuayu.com");
                // $("#consultNow").text("论坛求助");
                // $("#detailTipContent").text(r.type == 1 ? "您当前账户为免费套餐，请付款后再开启一对一咨询服务" : "您的专属客服服务已到期，如需继续享受，请购买付费版");
                let detailTipContent = r.type == 1 ? `
                    您当前账户为免费套餐，请付款后再开启一对一咨询服务。或加入免费版 <a style="color: #0043ea;" href='https://jq.qq.com/?_wv=1027&k=wLSnymRW' target='_blank'>QQ群1</a>、<a style="color: #0043ea;" href='https://jq.qq.com/?_wv=1027&k=vuehKrEr' target='_blank'>QQ群2</a> 中进行咨询！
                    ` : '您的专属客服服务已到期，如需继续享受，请购买付费版'
                 $("#detailTipContent").html(detailTipContent);
                manualInitZhichi(r.userInfo, 1)
            } else if (r.type == 3) {
                manualInitZhichi(r.userInfo, 3)
                //alert("进入初始化3")
                //$("#onlineChatAnchor").attr("href",r.url);
                return true;
            }
        }
    });
}
function consultBeforeBuy() {
    $("#serviceTip").modal("hide");
    zhichiFrameToggle();
	return false;
}
function manualInitZhichi(userInfo, modelType) {
    var zhiManager = (getzhiSDKInstance());
    zhiManager.set('userinfo', userInfo);
    //初始化智齿咨询组件实例

    zhiManager.set('customBtn', 'true');
    zhiManager.set('customMargin', 100);
    zhiManager.set('vertical', 50);
    zhiManager.set('color', '0f92ed'); //API示例，格式为 0-9 a-f 之间的六位有效字符 不用加#
    zhiManager.set('size', {
        'width': 360,
        'height': 540
    });
    zhiManager.set('moduleType', modelType);
}
function zhichiFrameToggle() {

    $("#btn").trigger("click");
    //if ($("#ZCChatFrame").css("display") != "none")
    //{

    //    $("#pbtn").removeClass("pZhichiCustomBtn").addClass("pZhichiCustomBtnClose");
    //    return;
    //} else {
    //    $("#btn").trigger("click");
    //    $("#pbtn").removeClass("pZhichiCustomBtnClose").addClass("pZhichiCustomBtn");

    //}
}
$(function () {
    getCustomerServiceUrl();
    $("#onlineChatDD").click(function (e) {
        if ($("#onlineChatAnchor").attr("href").search(/http:/gi) >= 0) {
            $("#onlineChatAnchor p").trigger("click");
        } else {
            $("#serviceTip").modal('show');
        }
    });
    $("#pbtn").click(function (e) {
        //对于已经打开聊天窗口的，直接关闭
        if ($("#ZCChatFrame").css("display") == "block") {
            zhichiFrameToggle();
            return;
        }
        if ($("#chatFlag").data("mType") == 3) {
            zhichiFrameToggle();
        } else {
            $("#serviceTip").modal('show');
        }
    });
    setInterval('getCustomerServiceUrl()', 60 * 60 * 1000);

    $('#Telphone').change(function () {
        if ($('.mobile-code').hasClass('hidden')) {
            $('.mobile-code').removeClass('hidden');
        }
    })
    var timeCount = 60;
    $('#sendMobileCode').unbind('click').click(function () {
        var mobile = $("#Telphone").val();
        var messageBox = $(".telphone p.error");
        messageBox.text("");
        var btn = $(this);
        if (mobile == "") {
            messageBox.text("请输入手机号");
            return
        }
        if (!checkMobile(mobile)) {
            messageBox.text("请输入正确的手机号");
            return;
        }
        btn.attr("disabled", "disabled");
        interval = setInterval(function () {
            timeCount--;
            if (timeCount == 0) {
                window.clearInterval(interval);
                timeCount = 60;
                btn.removeAttr("disabled");
                btn.text("重新获取短信验证码");
            } else {
                btn.text(timeCount + "秒后重新获取");
            }
        }, 1000);

        $.post("/ajaxtrial/AjaxGetTrialCode"
            , { mobile: mobile }
            , function (result) {
                if (result.status != 1) {
                    window.clearInterval(interval);
                    timeCount = 60;
                    btn.removeAttr("disabled");
                    if (result.message) {
                        messageBox.text(result.message);
                    }
                    else {
                        messageBox.text("获取短信验证码失败");
                    }
                }
            });
    })

    $('#radioSwitch').click(function (e) {
        var target = e.target || e.srcElement;//兼容ie7,8
        if (target.nodeName == "INPUT" && target.id == "personPlan") {
            $('#entertainmentPlanForm').addClass('hidden');
        } else if (target.nodeName == "INPUT" && target.id == "entertainmentPlan") {
            $('#entertainmentPlanForm').removeClass('hidden');
        }
    });

    $("#try-other-version").click(function () {
        getTrialIndex();
    })

    $("#trial-form").validate({
        rules: {
            Contact: {
                required: true
            },
            MobileCode: {
                required: true,
            },
            Reason: {
                required: true
            },
            CompanyName: {
                required: true
            },
            JobTitle: {
                required: true
            },
            filecard: {
                required: true
            }
        },
        messages: {
            Contact: {
                required: "请填写联系人信息"
            },
            MobileCode: {
                required: "请填写验证码"
            },
            Reason: {
                required: "请填写试用用途"
            },
            CompanyName: {
                required: "请填写公司名称"
            },
            JobTitle: {
                required: "请填写职位"
            },
            filecard: {
                required: "请上传名片"
            },
        },
        submitHandler: function () {
            var ApplyAccountType = $("#AvailableTypes").val();
            var Contact = $("#Contact").val();
            var Telphone = $("#Telphone").val();
            var MobileCode = $("#MobileCode").val();
            var Reason = $("#Reason").val();
            var CompanyName = $("#CompanyName").val();
            var JobTitle = $("#JobTitle").val();
            var ApplicantType = $("input[type='radio']:checked").val();
            var files = $('#filecard').prop('files');

            var fileData = new FormData();
            fileData.append('ApplyAccountType', ApplyAccountType);
            fileData.append('Contact', Contact);
            fileData.append('Telphone', Telphone);
            fileData.append('MobileCode', MobileCode);
            fileData.append('Reason', Reason);
            fileData.append('CompanyName', CompanyName);
            fileData.append('JobTitle', JobTitle);
            fileData.append('ApplicantType', ApplicantType);
            if (files.length > 0) {
                fileData.append('File', files[0]);
            }

            $.ajax({
                type: "POST",
                url: "/ajaxtrial/index",
                data: fileData,
                cache: false,
                contentType: false,
                processData: false,
                success: function (data) {
                    if (data.status == 1) {
                        $('#free-trial').modal('hide');
                        $('#free-trial .modal-content').removeClass('trial-plan');
                        $('#successMsg p.text span').text('已提交申请。我们会在2个工作日内审核。');
                        $('#successMsg').removeClass('hidden');
                        setTimeout(function () { $('#successMsg').addClass('hidden') }, 5000);
                    } else if (data.status == 2) {
                        $('#free-trial').modal('hide');
                        $('#free-trial .modal-content').removeClass('trial-plan');
                        $('#successMsg p.text span').text('申请通过！请重启八爪鱼体验。');
                        $('#successMsg p.sub-text').text('（如需帮助，请点击八爪鱼的“人工客服”咨询）');
                        $('#successMsg p.sub-text').removeClass('hidden');
                        $('#successMsg').removeClass('hidden');
                        setTimeout(function () {
                            $('#successMsg').addClass('hidden');
                            $('#successMsg p.sub-text').addClass('hidden');
                        }, 5000);
                    } else {
                        alert('提交失败');
                        alert(data.message);
                    }
                }
            })
        }
    });

    function getQueryVariable(variable) {
        var query = window.location.search.substring(1);
        var vars = query.split("&");
        for (var i = 0; i < vars.length; i++) {
            var pair = vars[i].split("=");
            if (pair[0] == variable) { return pair[1]; }
        }
        return (false);
    }

    function showTrialModel() {
        var bzytrial = getQueryVariable('bzytrial');
        var bzytype = getQueryVariable('bzytype');
        if (bzytrial) {
            getTrialIndex(bzytype);
        }
    }

    showTrialModel();

    $('#gotoTrial').click(function () {
        var isshow = $('#free-trial').css('display') == 'none';
        if (isshow) {
            getTrialIndex();
        } else {
            $('#free-trial').modal('hide')
        }

        // $('#free-trial .modal-content').addClass('trial-plan');
        // $('#free-trial').modal('show');
    })
})

// 判断是否为IE浏览器： /msie/i.test(navigator.userAgent) 为一个简单正则
var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
function fileChange(target) {
    var fileSize = 0;
    var file;
    var filename = target.value;
    var previewImg;
    var exts = ["jpg", "jpeg", "bmp", "png", "gif"];
    if (isIE && !target.files) {    // IE浏览器
        var filePath = target.value; // 获得上传文件的绝对路径
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        // GetFile(path) 方法从磁盘获取一个文件并返回。
        file = fileSystem.GetFile(filePath);
        fileSize = file.Size;    // 文件大小，单位：b
    }
    else {    // 非IE浏览器
        file = target.files[0];
        fileSize = file.size;
    }
    var ext = filename.substr(filename.lastIndexOf('.') + 1);
    if (exts.indexOf(ext) < 0) {
        alertMsg("图片格式不对，请重新上传(png,jpeg,jpg,gif,bmp)");
        return;
    }
    var size = fileSize / 1024 / 1024;
    if (size > 3) {
        alert("文件太大,尺寸不能超过3MB!");
        return;
    }
    previewImage(target);
}

//图片上传预览    IE是用了滤镜。
function previewImage(file) {
    if (file.files && file.files[0]) {
        var img = document.getElementById('userCardImg');
        var reader = new FileReader();
        reader.onload = function (evt) { img.src = evt.target.result; }
        reader.readAsDataURL(file.files[0]);
    }
    else //兼容IE
    {
        var sFilter = 'filter:progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod=scale,src="';
        file.select();
        var src = document.selection.createRange().text;
        var img = document.getElementById('userCardImg');
        img.filters.item('DXImageTransform.Microsoft.AlphaImageLoader').src = src;
    }
}

function getTrialIndex(url) {
    $(".telphone p.error").text("");
    $("#trial-form")[0].reset();
    $("#userCardImg").attr("src", "/images/profile/add.png");
    $('#free-trial .modal-content').removeClass('trial-plan').removeClass('none').removeClass('invalid');
    $('#free-trial .modal-dialog').removeClass('margintop');
    $.ajax({
        method: 'get',
        url: '/ajaxtrial/index?target=' + url,
        success: function (d) {
            if (d.status == 1) {
                var type;
                switch (url) {
                    case "ultimate":
                        type = 3;
                        break;
                    case "ultimateplus":
                        type = 31;
                        break;
                }
                showFreeTrial(d, type);
            } else if (d.status == -1) {
                var subUrl = document.location.toString().split('//')[1];
                var returnurl = subUrl.substring(subUrl.indexOf('/'))
                if (subUrl.indexOf('?') != -1) {
                    returnurl = returnurl.split('?')[0]
                }
                window.location.href = '/account/gologin?type=' + url + '&returnurl=' + returnurl
            }
        }
    });
}

function showFreeTrial(res, type) {
    var data = res.data;
    $('#currentAccountName').text(getCurrentAccountName(data.CurrentAccountType));
    if (data.AvailableTypes.length == 0) {
        $('#free-trial .modal-content').addClass('none');
    } else if (type && data.AvailableTypes.length > 0 && data.AvailableTypes.indexOf(type) == -1) {
        $('#free-trial .modal-content').addClass('invalid');
    } else {
        $('#free-trial .modal-content').removeClass('invalid').addClass('trial-plan');
        $('#free-trial .modal-dialog').addClass('margintop');
        //手机号已绑定
        if (data.Telphone) {
            $('.mobile-code').addClass('hidden');
            $('#Telphone').val(data.Telphone);
        } else {
            $('.mobile-code').removeClass('hidden');
        }
    }
    $("#AvailableTypes").empty();
    for (var i = 0; i < data.AvailableTypes.length; i++) {
        $("#AvailableTypes").prepend("<option value='" + data.AvailableTypes[i] + "'>" + getCurrentAccountName(data.AvailableTypes[i]) + "</option>");
    }
    if (type) {
        $("#AvailableTypes").val(type);
    } else {
        $("#AvailableTypes").val(data.AvailableTypes[data.AvailableTypes.length - 1]);
    }
    $("#trial-form").validate().resetForm();
    $('#free-trial').modal('show');
}

function getCurrentAccountName(currentAccount) {
    var currentAccountName;
    switch (currentAccount) {
        case 2:
            currentAccountName = "专业版";
            break;
        case 3:
            currentAccountName = "旗舰版";
            break;
        case 4:
            currentAccountName = "企业版";
            break;
        case 31:
            currentAccountName = "旗舰+";
            break;
        default:
            currentAccountName = "免费版";
            break;
    }
    return currentAccountName;
}